// Reset the game
const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: false,
      roundInProgress: false,
      currentPlayerId: null,
      selectedChallengeType: null
    }));
  };// Import the components properly here
import DifficultySelector from './DifficultySelector';
import TruthOrDareBoard from './TruthOrDareBoard';// src/components/games/TruthOrDareGame.tsx
'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import AdBanner from '../ui/AdBanner';
import { 
  DifficultyLevel, 
  GameState, 
  Player,
  STARTING_PASSES 
} from '@/lib/models/truth-or-dare';
import { v4 as uuidv4 } from '@/lib/utils/uuid';

export default function TruthOrDareGame() {
  // Initialize game state
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    difficultyLevel: 'Light',
    currentPlayerId: null,
    selectedChallengeType: null,
    gameStarted: false,
    roundInProgress: false,
    dealerId: null
  });
  
  // Additional UI state
  const [playerName, setPlayerName] = useState('');
  const [isDealer, setIsDealer] = useState(false);
  
  // Add a player to the game
  const handleAddPlayer = () => {
    if (playerName.trim()) {
      const newPlayer: Player = {
        id: uuidv4(),
        name: playerName.trim(),
        isDealer: isDealer,
        passesRemaining: STARTING_PASSES,
        points: 0,
        penaltiesUsed: 0
      };
      
      // If this is a dealer, remove dealer status from any existing dealers
      let updatedPlayers = gameState.players;
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
    
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      // Select a random non-dealer player to start
      currentPlayerId: getRandomPlayerExcept(gameState.dealerId)
    }));
  };
  
  // Get a random player ID except for the specified one
  const getRandomPlayerExcept = (exceptId: string): string => {
    const eligiblePlayers = gameState.players.filter(p => p.id !== exceptId);
    if (eligiblePlayers.length === 0) return gameState.players[0].id;
    
    const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
    return eligiblePlayers[randomIndex].id;
  };
  
  // Select a challenge type (Truth or Dare)
  const selectChallengeType = (type: 'Truth' | 'Dare') => {
    setGameState(prev => ({
      ...prev,
      selectedChallengeType: type,
      roundInProgress: true
    }));
  };
  
  // Handle when a player completes a challenge
  const handleChallengeComplete = (playerId: string) => {
    const pointsEarned = gameState.selectedChallengeType === 'Truth' ? 1 : 2;
    
    // Update player points
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => 
        player.id === playerId 
          ? { ...player, points: player.points + pointsEarned }
          : player
      ),
      roundInProgress: false,
      selectedChallengeType: null
    }));
    
    // Select next player
    selectNextPlayer();
  };
  
  // Handle when a player passes on a challenge
  const handleChallengePass = (playerId: string) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;
    
    if (player.passesRemaining > 0) {
      // Use a free pass
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(p => 
          p.id === playerId 
            ? { ...p, passesRemaining: p.passesRemaining - 1 }
            : p
        ),
        roundInProgress: false,
        selectedChallengeType: null
      }));
    } else {
      // Use a penalty
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(p => 
          p.id === playerId 
            ? { ...p, penaltiesUsed: p.penaltiesUsed + 1 }
            : p
        ),
        roundInProgress: false,
        selectedChallengeType: null
      }));
    }
    
    // Select next player
    selectNextPlayer();
  };
  
  // Handle distributing points/sips
  const handleDistribute = (fromPlayerId: string, toPlayerId: string, points: number) => {
    if (points <= 0 || !fromPlayerId || !toPlayerId) return;
    
    // Update player points (subtract from distributing player)
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => 
        player.id === fromPlayerId 
          ? { ...player, points: Math.max(0, player.points - points) }
          : player
      )
    }));
  };
  
  // Select the next player for a challenge
  const selectNextPlayer = () => {
    // Get all non-dealer players
    const nonDealerPlayers = gameState.players.filter(p => !p.isDealer);
    if (nonDealerPlayers.length === 0) return;
    
    // Get current player index
    const currentIndex = nonDealerPlayers.findIndex(p => p.id === gameState.currentPlayerId);
    
    // Get next player (circular)
    const nextIndex = (currentIndex + 1) % nonDealerPlayers.length;
    const nextPlayerId = nonDealerPlayers[nextIndex].id;
    
    setGameState(prev => ({
      ...prev,
      currentPlayerId: nextPlayerId,
    }));
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
              <span>{gameState.players.length - 1}</span> Players | <span>{gameState.difficultyLevel}</span> Mode
            </div>
          </div>
          
          {/* Game Board */}
          <TruthOrDareBoard
            gameState={gameState}
            onSelectChallengeType={selectChallengeType}
            onChallengeComplete={handleChallengeComplete}
            onChallengePass={handleChallengePass}
            onDistribute={handleDistribute}
          />
          
          {/* Ad Banner */}
          <AdBanner position="bottom" />
        </div>
      )}
    </div>
  );
}