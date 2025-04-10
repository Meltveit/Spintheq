// src/components/games/TruthOrDareGame.tsx
'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import AdBanner from '../ui/AdBanner';
import DifficultySelector from './DifficultySelector';
import PlayerScoreboard from './PlayerScoreboard';
import GameHistoryLog from './GameHistoryLog';
import { 
  DifficultyLevel, 
  GameState, 
  Player,
  STARTING_PASSES,
  ChallengeType,
  POINTS_FOR_TRUTH,
  POINTS_FOR_DARE,
  GameActionHistory,
  POINTS_TO_DISTRIBUTE,
  DIFFICULTY_CONFIG
} from '@/lib/models/truth-or-dare';
import { v4 as uuidv4 } from '@/lib/utils/uuid';

export default function TruthOrDareGame() {
  // Initialize game state
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    difficultyLevel: 'Light',
    currentPlayerId: null,
    targetPlayerId: null,
    selectedChallengeType: null,
    gameStarted: false,
    roundInProgress: false,
    dealerId: null,
    round: 1,
    lastAction: null
  });
  
  // Additional UI state
  const [playerName, setPlayerName] = useState('');
  const [isDealer, setIsDealer] = useState(false);
  const [gameHistory, setGameHistory] = useState<GameActionHistory[]>([]);
  const [distributionMode, setDistributionMode] = useState(false);
  const [selectedPlayerForDistribution, setSelectedPlayerForDistribution] = useState<string | null>(null);
  const [distributionAmount, setDistributionAmount] = useState(0);
  
  // Add a player to the game
  const handleAddPlayer = () => {
    if (playerName.trim()) {
      const newPlayer: Player = {
        id: uuidv4(),
        name: playerName.trim(),
        isDealer: isDealer,
        passesRemaining: STARTING_PASSES,
        points: 0,
        penaltiesUsed: 0,
        challengesCompleted: 0,
        challengesFailed: 0
      };
      
      // If this is a dealer, remove dealer status from any existing dealers
      let updatedPlayers = [...gameState.players];
      if (isDealer) {
        updatedPlayers = updatedPlayers.map(player => ({
          ...player,
          isDealer: false
        }));
        setGameState(prev => ({
          ...prev,
          dealerId: newPlayer.id
        }));
      }
      
      setGameState(prev => ({
        ...prev,
        players: [...updatedPlayers, newPlayer]
      }));
      
      // Reset inputs
      setPlayerName('');
      setIsDealer(false);
    }
  };
  
  // Remove a player from the game
  const handleRemovePlayer = (playerId: string) => {
    const updatedPlayers = gameState.players.filter(p => p.id !== playerId);
    
    // If the removed player was the dealer, reset dealerId
    const removedPlayer = gameState.players.find(p => p.id === playerId);
    const wasDealer = removedPlayer?.isDealer || false;
    
    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      dealerId: wasDealer ? null : prev.dealerId
    }));
  };
  
  // Change the difficulty level
  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    setGameState(prev => ({
      ...prev,
      difficultyLevel: difficulty
    }));
  };
  
  // Start the game
  const startGame = () => {
    // Check if we have enough players and a dealer
    if (gameState.players.length < 2 || !gameState.dealerId) return;
    
    // Get a random non-dealer player to start
    const nonDealerPlayers = gameState.players.filter(p => !p.isDealer);
    if (nonDealerPlayers.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * nonDealerPlayers.length);
    const startingPlayerId = nonDealerPlayers[randomIndex].id;
    
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      currentPlayerId: startingPlayerId,
      targetPlayerId: null,
      round: 1,
      lastAction: `Game started with ${nonDealerPlayers[randomIndex].name} going first`
    }));
  };
  
  // Handle selecting a target player for the challenge
  const handleSelectTargetPlayer = (targetId: string) => {
    if (!gameState.currentPlayerId || targetId === gameState.currentPlayerId) return;
    
    const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId);
    const targetPlayer = gameState.players.find(p => p.id === targetId);
    
    if (!currentPlayer || !targetPlayer) return;
    
    setGameState(prev => ({
      ...prev,
      targetPlayerId: targetId,
      lastAction: `${currentPlayer.name} chose to challenge ${targetPlayer.name}`
    }));
  };
  
  // Select a challenge type (Truth or Dare)
  const handleSelectChallengeType = (type: ChallengeType) => {
    if (!gameState.currentPlayerId || !gameState.targetPlayerId) return;
    
    const targetPlayer = gameState.players.find(p => p.id === gameState.targetPlayerId);
    if (!targetPlayer) return;
    
    setGameState(prev => ({
      ...prev,
      selectedChallengeType: type,
      roundInProgress: true,
      lastAction: `${targetPlayer.name} chose ${type}`
    }));
  };
  
  // Handle when a player completes a challenge
  const handleChallengeComplete = () => {
    // Ensure we have valid state
    if (!gameState.currentPlayerId || !gameState.targetPlayerId || !gameState.selectedChallengeType) return;
    
    const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId);
    const targetPlayer = gameState.players.find(p => p.id === gameState.targetPlayerId);
    
    if (!currentPlayer || !targetPlayer) return;
    
    // Calculate points based on challenge type
    const pointsEarned = gameState.selectedChallengeType === 'Truth' ? POINTS_FOR_TRUTH : POINTS_FOR_DARE;
    
    // Create a history item
    const historyItem: GameActionHistory = {
      round: gameState.round,
      challengerId: currentPlayer.id,
      targetId: targetPlayer.id,
      challengeType: gameState.selectedChallengeType,
      result: 'completed',
      points: pointsEarned
    };
    
    // Update game history
    setGameHistory([...gameHistory, historyItem]);
    
    // Update player stats
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => 
        player.id === targetPlayer.id 
          ? { 
              ...player, 
              points: player.points + pointsEarned,
              challengesCompleted: player.challengesCompleted + 1 
            }
          : player
      ),
      // Move to next round, make the target player the new current player
      currentPlayerId: prev.targetPlayerId,
      targetPlayerId: null,
      roundInProgress: false,
      selectedChallengeType: null,
      round: prev.round + 1,
      lastAction: `${targetPlayer.name} completed the ${prev.selectedChallengeType} and earned ${pointsEarned} point${pointsEarned !== 1 ? 's' : ''}`
    }));
  };
  
  // Handle when a player passes on a challenge
  const handleChallengePass = () => {
    // Ensure we have valid state
    if (!gameState.currentPlayerId || !gameState.targetPlayerId || !gameState.selectedChallengeType) return;
    
    const targetPlayer = gameState.players.find(p => p.id === gameState.targetPlayerId);
    if (!targetPlayer) return;
    
    if (targetPlayer.passesRemaining > 0) {
      // Use a free pass
      const historyItem: GameActionHistory = {
        round: gameState.round,
        challengerId: gameState.currentPlayerId,
        targetId: targetPlayer.id,
        challengeType: gameState.selectedChallengeType,
        result: 'passed'
      };
      
      setGameHistory([...gameHistory, historyItem]);
      
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(p => 
          p.id === targetPlayer.id 
            ? { 
                ...p, 
                passesRemaining: p.passesRemaining - 1,
                challengesFailed: p.challengesFailed + 1
              }
            : p
        ),
        // Move to next round, make the target player the new current player
        currentPlayerId: prev.targetPlayerId,
        targetPlayerId: null,
        roundInProgress: false,
        selectedChallengeType: null,
        round: prev.round + 1,
        lastAction: `${targetPlayer.name} passed using 1 of their free passes (${targetPlayer.passesRemaining - 1} remaining)`
      }));
    } else {
      // Calculate penalty based on difficulty and how many times they've used penalties
      const config = DIFFICULTY_CONFIG[gameState.difficultyLevel];
      const penalty = config.startingSips + (targetPlayer.penaltiesUsed * config.incrementSips);
      
      const historyItem: GameActionHistory = {
        round: gameState.round,
        challengerId: gameState.currentPlayerId,
        targetId: targetPlayer.id,
        challengeType: gameState.selectedChallengeType,
        result: 'penalty',
        sips: penalty
      };
      
      setGameHistory([...gameHistory, historyItem]);
      
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(p => 
          p.id === targetPlayer.id 
            ? { 
                ...p, 
                penaltiesUsed: p.penaltiesUsed + 1,
                challengesFailed: p.challengesFailed + 1
              }
            : p
        ),
        // Move to next round, make the target player the new current player
        currentPlayerId: prev.targetPlayerId,
        targetPlayerId: null,
        roundInProgress: false,
        selectedChallengeType: null,
        round: prev.round + 1,
        lastAction: `${targetPlayer.name} took a penalty of ${penalty} sips`
      }));
    }
  };
  
  // Handle starting distribution
  const handleStartDistribution = (playerId: string) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player || player.points < POINTS_TO_DISTRIBUTE) return;
    
    setDistributionMode(true);
    setDistributionAmount(DIFFICULTY_CONFIG[gameState.difficultyLevel].distributionMultiplier);
    
    // Set the player as current player if not already
    if (gameState.currentPlayerId !== playerId) {
      setGameState(prev => ({
        ...prev,
        currentPlayerId: playerId,
        targetPlayerId: null,
        roundInProgress: false,
        selectedChallengeType: null,
        lastAction: `${player.name} is distributing sips`
      }));
    }
  };
  
  // Handle completing distribution
  const handleCompleteDistribution = () => {
    if (!gameState.currentPlayerId || !selectedPlayerForDistribution) return;
    
    const fromPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId);
    const toPlayer = gameState.players.find(p => p.id === selectedPlayerForDistribution);
    
    if (!fromPlayer || !toPlayer) return;
    
    const historyItem: GameActionHistory = {
      round: gameState.round,
      challengerId: fromPlayer.id,
      targetId: toPlayer.id,
      challengeType: null,
      result: 'distribution',
      points: -POINTS_TO_DISTRIBUTE,
      sips: distributionAmount
    };
    
    setGameHistory([...gameHistory, historyItem]);
    
    // Update player points (subtract from distributing player)
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => 
        player.id === fromPlayer.id 
          ? { ...player, points: Math.max(0, player.points - POINTS_TO_DISTRIBUTE) }
          : player
      ),
      lastAction: `${fromPlayer.name} distributed ${distributionAmount} sips to ${toPlayer.name}`
    }));
    
    // Reset distribution mode
    setDistributionMode(false);
    setSelectedPlayerForDistribution(null);
    setDistributionAmount(0);
  };
  
  // Handle canceling distribution
  const handleCancelDistribution = () => {
    setDistributionMode(false);
    setSelectedPlayerForDistribution(null);
    setDistributionAmount(0);
  };
  
  // Get the current player
  const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId);
  
  // Get the dealer
  const dealer = gameState.players.find(p => p.id === gameState.dealerId);
  
  // Get the target player
  const targetPlayer = gameState.players.find(p => p.id === gameState.targetPlayerId);
  
  // Determine if we're in the player selection phase
  const isPlayerSelectionPhase = !gameState.targetPlayerId && gameState.currentPlayerId && !gameState.roundInProgress;
  
  // Reset the game
  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: false,
      roundInProgress: false,
      currentPlayerId: null,
      targetPlayerId: null,
      selectedChallengeType: null,
      round: 1,
      lastAction: null
    }));
    setGameHistory([]);
    setDistributionMode(false);
    setSelectedPlayerForDistribution(null);
  };
  
  // Calculate the next skip penalty for a player
  const getSkipPenalty = (player: Player | undefined) => {
    if (!player) return 0;
    if (player.passesRemaining > 0) return 0;
    
    const config = DIFFICULTY_CONFIG[gameState.difficultyLevel];
    return config.startingSips + (player.penaltiesUsed * config.incrementSips);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {!gameState.gameStarted ? (
        // Game setup screen
        <div className="space-y-8">
          {/* Player Setup */}
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-400/30">
            <h3 className="text-lg font-medium mb-3 text-white">Add Players</h3>
            
            {/* Add player form */}
            <div className="flex flex-col space-y-4 mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter player name"
                  className="flex-1 p-2 rounded bg-purple-800/70 border border-purple-400 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  maxLength={20}
                />
                <Button 
                  onClick={handleAddPlayer}
                  disabled={!playerName.trim()}
                  variant="secondary"
                >
                  Add
                </Button>
              </div>
              
              <div className="flex items-center">
                <input
                  id="dealer-checkbox"
                  type="checkbox"
                  checked={isDealer}
                  onChange={(e) => setIsDealer(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="dealer-checkbox" className="ml-2 text-sm font-medium text-white">
                  This player is the Dealer (tracks points, manages the game)
                </label>
              </div>
            </div>
            
            {/* Player list */}
            {gameState.players.length === 0 ? (
              <p className="text-purple-100 text-center py-4">Add at least 2 players to start the game</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {gameState.players.map((player) => (
                  <div 
                    key={player.id} 
                    className={`${player.isDealer ? 'bg-yellow-500' : 'bg-purple-500'} py-1 px-3 rounded-full flex items-center shadow-md border border-white/20`}
                  >
                    <span className="mr-2 text-white font-medium">
                      {player.name} {player.isDealer && '(Dealer)'}
                    </span>
                    <button 
                      onClick={() => handleRemovePlayer(player.id)}
                      className="text-white/80 hover:text-white transition-colors"
                      aria-label={`Remove ${player.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Dealer Warning */}
            {gameState.players.length > 0 && !gameState.dealerId && (
              <p className="text-yellow-300 text-sm mt-2">You need to designate one player as the Dealer</p>
            )}
            
            {/* Player count */}
            {gameState.players.length > 0 && (
              <p className="text-purple-100 text-sm mt-4">
                {gameState.players.length} player{gameState.players.length !== 1 ? 's' : ''} added
              </p>
            )}
          </div>
          
          {/* Ad Banner */}
          <AdBanner position="middle" />
          
          {/* Difficulty Selection */}
          <div className="bg-gradient-to-r from-pink-900 to-red-900 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-pink-400/30">
            <h3 className="text-lg font-medium mb-3 text-white">Select Drinking Difficulty</h3>
            <DifficultySelector 
              selectedDifficulty={gameState.difficultyLevel}
              onSelectDifficulty={handleDifficultyChange}
            />
          </div>
          
          {/* Start Game Button */}
          <Button 
            onClick={startGame} 
            disabled={gameState.players.length < 2 || !gameState.dealerId}
            variant="primary"
            size="lg"
            fullWidth
          >
            Start Game
          </Button>
          
          {gameState.players.length < 2 && (
            <p className="text-yellow-300 text-center text-sm">
              Add at least 2 players to start the game
            </p>
          )}
        </div>
      ) : (
        // Game screen
        <div className="space-y-8">
          {/* Game Controls */}
          <div className="flex justify-between items-center">
            <Button onClick={resetGame} variant="outline" size="sm">
              Back to Setup
            </Button>
            <div className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-medium shadow-md">
              <span>Round {gameState.round}</span> | <span>{gameState.difficultyLevel}</span> Mode
            </div>
          </div>
          
          {/* Game Status Alert */}
          {gameState.lastAction && (
            <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 rounded-lg p-3 border border-blue-500/30 text-center">
              <p className="text-blue-100 text-sm">{gameState.lastAction}</p>
            </div>
          )}
          
          {/* Dealer Section */}
          {dealer && (
            <div className="bg-gradient-to-r from-yellow-900/60 to-amber-900/60 rounded-xl p-4 border border-yellow-500/30 shadow-md">
              <h3 className="text-lg font-medium mb-2 text-white">Dealer: {dealer.name}</h3>
              <p className="text-yellow-100 text-sm">
                The Dealer manages the game, tracks points, and verifies challenge completion.
              </p>
            </div>
          )}
          
          {/* Player Scoreboard */}
          <PlayerScoreboard 
            players={gameState.players}
            difficultyLevel={gameState.difficultyLevel}
            currentPlayerId={gameState.currentPlayerId}
            targetPlayerId={gameState.targetPlayerId}
            onStartDistribution={distributionMode ? undefined : handleStartDistribution}
            distributionInProgress={distributionMode}
            onPlayerSelect={isPlayerSelectionPhase ? handleSelectTargetPlayer : undefined}
            selectionPhase={isPlayerSelectionPhase || false}
          />
          
          {/* Game Flow Sections */}
          {/* 1. Player Selection Phase */}
          {isPlayerSelectionPhase && currentPlayer && !distributionMode && (
            <div className="bg-gradient-to-r from-indigo-900/60 to-blue-900/60 rounded-xl p-6 border border-indigo-500/30 shadow-md text-center">
              <h3 className="text-xl font-medium mb-4 text-center text-white">
                {currentPlayer.name}&apos;s Turn to Choose
              </h3>
              <p className="text-blue-100 mb-4">
                {currentPlayer.name} must select someone to challenge.
              </p>
              <p className="text-yellow-200 text-sm">
                Click on a player above to select them.
              </p>
            </div>
          )}
          
          {/* 2. Challenge Type Selection Phase */}
          {gameState.targetPlayerId && !gameState.selectedChallengeType && !distributionMode && targetPlayer && (
            <div className="bg-gradient-to-r from-indigo-900/60 to-violet-900/60 rounded-xl p-6 border border-indigo-500/30 shadow-md text-center">
              <h3 className="text-xl font-medium mb-4 text-center text-white">
                {currentPlayer?.name} is challenging {targetPlayer.name}
              </h3>
              
              <p className="text-blue-100 mb-4">
                Choose your challenge:
              </p>
              
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => handleSelectChallengeType('Truth')}
                  variant="primary"
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-500 challenge-btn"
                >
                  Truth (+{POINTS_FOR_TRUTH} point)
                </Button>
                <Button
                  onClick={() => handleSelectChallengeType('Dare')}
                  variant="secondary"
                  size="lg"
                  className="bg-pink-600 hover:bg-pink-500 challenge-btn"
                >
                  Dare (+{POINTS_FOR_DARE} points)
                </Button>
              </div>
            </div>
          )}
          
          {/* 3. Challenge Progress Phase */}
          {gameState.selectedChallengeType && gameState.roundInProgress && !distributionMode && targetPlayer && (
            <div className="bg-gradient-to-r from-indigo-900/60 to-blue-900/60 rounded-xl p-6 border border-indigo-500/30 shadow-md text-center">
              <h3 className="text-xl font-medium mb-2 text-white">
                {currentPlayer?.name} ➝ {targetPlayer.name}: {gameState.selectedChallengeType}
              </h3>
              
              <div className="bg-indigo-800/50 rounded-lg p-4 border border-indigo-500/30 mb-4">
                <p className="text-blue-100">
                  The Dealer should now ask {targetPlayer.name} a {gameState.selectedChallengeType?.toLowerCase()} question 
                  or assign a {gameState.selectedChallengeType?.toLowerCase()} challenge.
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handleChallengeComplete}
                  variant="primary"
                  size="lg"
                >
                  Completed!
                </Button>
                
                <Button
                  onClick={handleChallengePass}
                  variant="outline"
                  size="lg"
                >
                  {targetPlayer.passesRemaining > 0
                    ? `Pass (${targetPlayer.passesRemaining} left)` 
                    : `Skip (${getSkipPenalty(targetPlayer)} sips)`}
                </Button>
              </div>
            </div>
          )}
          
          {/* Distribution Mode */}
          {distributionMode && currentPlayer && (
            <div className="bg-gradient-to-r from-pink-900/60 to-red-900/60 rounded-xl p-6 border border-pink-500/30 shadow-md">
              <h3 className="text-xl font-medium mb-4 text-center text-white">
                {currentPlayer.name} is Distributing Sips
              </h3>
              
              <p className="text-pink-100 mb-4 text-center">
                Select a player to receive {distributionAmount} sips:
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {gameState.players
                  .filter(player => player.id !== currentPlayer.id && !player.isDealer)
                  .map((player) => (
                    <button
                      key={player.id}
                      onClick={() => setSelectedPlayerForDistribution(player.id)}
                      className={`
                        p-3 rounded-lg border transition-colors
                        ${selectedPlayerForDistribution === player.id
                          ? 'bg-pink-600 border-pink-300 shadow-md'
                          : 'bg-pink-800/40 border-pink-600/30 hover:bg-pink-700/50'}
                      `}
                    >
                      {player.name}
                    </button>
                  ))}
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handleCompleteDistribution}
                  disabled={!selectedPlayerForDistribution}
                  variant="secondary"
                  size="lg"
                >
                  Confirm
                </Button>
                
                <Button
                  onClick={handleCancelDistribution}
                  variant="outline"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {/* Game History */}
          {gameHistory.length > 0 && (
            <GameHistoryLog 
              history={gameHistory} 
              gameState={gameState} 
              maxEntries={5} 
            />
          )}
          
          {/* Current Game Status */}
          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
            <h4 className="font-medium mb-2 text-pink-200">Game Rules</h4>
            <ul className="space-y-1 text-sm text-white">
              <li>• Complete a Truth: +1 point</li>
              <li>• Complete a Dare: +2 points</li>
              <li>• Reach 5 points to distribute sips</li>
              <li>• Each player starts with 2 free passes</li>
              <li>• After passes are used, penalties increase by {DIFFICULTY_CONFIG[gameState.difficultyLevel].incrementSips} sip(s) each time</li>
            </ul>
          </div>
          
          {/* Ad Banner */}
          <AdBanner position="bottom" />
        </div>
      )}
    </div>
  );
}