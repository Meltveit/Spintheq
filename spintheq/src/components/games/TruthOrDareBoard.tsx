// src/components/games/TruthOrDareBoard.tsx
'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import { 
  GameState, 
  Player, 
  ChallengeType,
  DIFFICULTY_CONFIG,
  POINTS_FOR_TRUTH,
  POINTS_FOR_DARE,
  POINTS_TO_DISTRIBUTE
} from '@/lib/models/truth-or-dare';

interface GameBoardProps {
  gameState: GameState;
  onSelectChallengeType: (type: ChallengeType) => void;
  onChallengeComplete: (playerId: string) => void;
  onChallengePass: (playerId: string) => void;
  onDistribute: (fromPlayerId: string, toPlayerId: string, points: number) => void;
}

export default function GameBoard({ 
  gameState, 
  onSelectChallengeType, 
  onChallengeComplete, 
  onChallengePass,
  onDistribute
}: GameBoardProps) {
  const [distributionMode, setDistributionMode] = useState(false);
  const [selectedPlayerForDistribution, setSelectedPlayerForDistribution] = useState<string | null>(null);
  const [distributionAmount, setDistributionAmount] = useState(0);
  
  // Get the current player
  const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId);
  
  // Get the dealer
  const dealer = gameState.players.find(p => p.id === gameState.dealerId);
  
  // Get the penalty for the current player if they pass
  const getCurrentPlayerPenalty = (): number => {
    if (!currentPlayer) return 0;
    
    // If they have passes remaining, no penalty
    if (currentPlayer.passesRemaining > 0) return 0;
    
    // Calculate penalty based on difficulty and how many times they've used penalties
    const config = DIFFICULTY_CONFIG[gameState.difficultyLevel];
    return config.startingSips + (currentPlayer.penaltiesUsed * config.incrementSips);
  };
  
  // Check if a player can distribute sips
  const canDistribute = (player: Player): boolean => {
    return player.points >= POINTS_TO_DISTRIBUTE;
  };
  
  // Handle starting distribution
  const handleStartDistribution = (playerId: string) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player || !canDistribute(player)) return;
    
    setDistributionMode(true);
    setDistributionAmount(DIFFICULTY_CONFIG[gameState.difficultyLevel].distributionMultiplier);
  };
  
  // Handle completing distribution
  const handleCompleteDistribution = () => {
    if (!currentPlayer || !selectedPlayerForDistribution) return;
    
    onDistribute(currentPlayer.id, selectedPlayerForDistribution, POINTS_TO_DISTRIBUTE);
    
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
  
  // Get color for challenge type button
  const getChallengeButtonStyle = (type: ChallengeType): string => {
    return type === 'Truth' 
      ? 'bg-blue-600 hover:bg-blue-500 challenge-btn' 
      : 'bg-pink-600 hover:bg-pink-500 challenge-btn';
  };
  
  return (
    <div className="space-y-6">
      {/* Dealer Section */}
      {dealer && (
        <div className="bg-gradient-to-r from-yellow-900/60 to-amber-900/60 rounded-xl p-4 border border-yellow-500/30 shadow-md">
          <h3 className="text-lg font-medium mb-2 text-white">Dealer: {dealer.name}</h3>
          <p className="text-yellow-100 text-sm">
            The Dealer manages the game, tracks points, and verifies challenge completion.
          </p>
        </div>
      )}
      
      {/* Player Stats */}
      <div className="bg-purple-900/50 rounded-xl p-4 border border-purple-500/30 shadow-md">
        <h3 className="text-lg font-medium mb-3 text-white">Players</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {gameState.players
            .filter(player => !player.isDealer) // Don't show dealer in the player list
            .map((player) => (
              <div 
                key={player.id} 
                className={`
                  p-3 rounded-lg border 
                  ${player.id === gameState.currentPlayerId 
                    ? 'bg-purple-600/70 border-purple-300 shadow-md animate-pulse' 
                    : 'bg-purple-800/40 border-purple-600/30'}
                `}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{player.name}</h4>
                  <div className="flex space-x-2">
                    {/* Points badge */}
                    <span className="px-2 py-0.5 bg-blue-600 text-xs rounded-full text-white font-medium">
                      {player.points} pts
                    </span>
                    {/* Passes badge */}
                    <span className="px-2 py-0.5 bg-green-600 text-xs rounded-full text-white font-medium">
                      {player.passesRemaining} passes
                    </span>
                  </div>
                </div>
                
                {/* Distribution button (only shown when a player has enough points) */}
                {canDistribute(player) && (
                  <button
                    onClick={() => handleStartDistribution(player.id)}
                    className="mt-2 w-full text-sm py-1 px-2 bg-pink-600 hover:bg-pink-500 transition-colors rounded text-white font-medium"
                    disabled={distributionMode}
                  >
                    Distribute {DIFFICULTY_CONFIG[gameState.difficultyLevel].distributionMultiplier} Sips
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
      
      {/* Current Player Challenge Section */}
      {currentPlayer && !distributionMode && (
        <div className="bg-gradient-to-r from-indigo-900/60 to-blue-900/60 rounded-xl p-6 border border-indigo-500/30 shadow-md text-center">
          <h3 className="text-xl font-medium mb-4 text-center text-white">
            {currentPlayer.name}&apos;s Turn
          </h3>
          
          {!gameState.roundInProgress ? (
            // Challenge Type Selection
            <div className="space-y-4">
              <p className="text-blue-100">Choose your challenge:</p>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => onSelectChallengeType('Truth')}
                  variant="primary"
                  size="lg"
                  className={getChallengeButtonStyle('Truth')}
                >
                  Truth (+{POINTS_FOR_TRUTH} point)
                </Button>
                <Button
                  onClick={() => onSelectChallengeType('Dare')}
                  variant="secondary"
                  size="lg"
                  className={getChallengeButtonStyle('Dare')}
                >
                  Dare (+{POINTS_FOR_DARE} points)
                </Button>
              </div>
            </div>
          ) : (
            // Challenge in Progress
            <div className="space-y-6">
              <div className="bg-indigo-800/50 rounded-lg p-4 border border-indigo-500/30">
                <h4 className="text-lg font-medium mb-2 text-white">
                  {gameState.selectedChallengeType || ''}
                </h4>
                <p className="text-blue-100">
                  The Dealer should now ask a {gameState.selectedChallengeType?.toLowerCase()} question 
                  or assign a {gameState.selectedChallengeType?.toLowerCase()} challenge.
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => onChallengeComplete(currentPlayer.id)}
                  variant="primary"
                  size="lg"
                >
                  Completed!
                </Button>
                
                <Button
                  onClick={() => onChallengePass(currentPlayer.id)}
                  variant="outline"
                  size="lg"
                >
                  {currentPlayer.passesRemaining > 0 
                    ? `Pass (${currentPlayer.passesRemaining} left)` 
                    : `Skip (${getCurrentPlayerPenalty()} sips)`}
                </Button>
              </div>
            </div>
          )}
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
      
      {/* Game Rules Reminder */}
      <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
        <h4 className="font-medium mb-2 text-pink-200">Game Rules</h4>
        <ul className="space-y-1 text-sm text-white">
          <li>• Complete a Truth: +1 point</li>
          <li>• Complete a Dare: +2 points</li>
          <li>• Reach 5 points to distribute sips</li>
          <li>• Each player starts with 2 free passes</li>
          <li>• After passes are used, rejections cost sips</li>
        </ul>
      </div>
    </div>
  );
}