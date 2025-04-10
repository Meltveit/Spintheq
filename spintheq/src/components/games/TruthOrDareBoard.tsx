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

interface TruthOrDareBoardProps {
  gameState: GameState;
  onSelectChallengeType: (type: ChallengeType) => void;
  onChallengeComplete: (playerId: string) => void;
  onChallengePass: (playerId: string) => void;
  onSelectTargetPlayer: (playerId: string) => void;
  onDistribute: (fromPlayerId: string, toPlayerId: string, sips: number) => void;
}

export default function TruthOrDareBoard({ 
  gameState, 
  onSelectChallengeType, 
  onChallengeComplete, 
  onChallengePass,
  onSelectTargetPlayer,
  onDistribute
}: TruthOrDareBoardProps) {
  const [distributionMode, setDistributionMode] = useState(false);
  const [selectedPlayerForDistribution, setSelectedPlayerForDistribution] = useState<string | null>(null);
  const [distributionAmount, setDistributionAmount] = useState(0);
  
  // Get the current player
  const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId);
  
  // Get the target player
  const targetPlayer = gameState.players.find(p => p.id === gameState.targetPlayerId);
  
  // Get the dealer
  const dealer = gameState.players.find(p => p.id === gameState.dealerId);
  
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
    
    onDistribute(currentPlayer.id, selectedPlayerForDistribution, distributionAmount);
    
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

  // Determine if we're in the player selection phase
  const isPlayerSelectionPhase = !gameState.targetPlayerId && gameState.currentPlayerId && !gameState.roundInProgress;
  
  // Determine if we're in the challenge type selection phase
  const isChallengeSelectionPhase = gameState.targetPlayerId && !gameState.selectedChallengeType;
  
  // Determine if we're in the challenge progress phase
  const isChallengeProgressPhase = gameState.selectedChallengeType && gameState.roundInProgress;
  
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
                    : player.id === gameState.targetPlayerId
                    ? 'bg-pink-600/70 border-pink-300 shadow-md'
                    : 'bg-purple-800/40 border-purple-600/30'}
                  ${isPlayerSelectionPhase && player.id !== gameState.currentPlayerId 
                    ? 'cursor-pointer hover:bg-purple-700/60 transition-colors'
                    : ''}
                `}
                onClick={() => {
                  // Only allow selecting players during the player selection phase
                  if (isPlayerSelectionPhase && player.id !== gameState.currentPlayerId) {
                    onSelectTargetPlayer(player.id);
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium flex items-center gap-2">
                    {player.name}
                    {player.id === gameState.currentPlayerId && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                    {player.id === gameState.targetPlayerId && (
                      <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Target
                      </span>
                    )}
                  </h4>
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
                
                {/* Show penalty info if player has no passes left */}
                {player.passesRemaining === 0 && player.penaltiesUsed > 0 && (
                  <div className="mt-1 text-xs text-yellow-200">
                    Next pass: {DIFFICULTY_CONFIG[gameState.difficultyLevel].startingSips + 
                     (player.penaltiesUsed * DIFFICULTY_CONFIG[gameState.difficultyLevel].incrementSips)} sips
                  </div>
                )}
                
                {/* Distribution button (only shown when a player has enough points) */}
                {canDistribute(player) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartDistribution(player.id);
                    }}
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
      
      {/* Game Flow Section */}
      {/* 1. Player Selection Phase */}
      {isPlayerSelectionPhase && currentPlayer && (
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
      {isChallengeSelectionPhase && currentPlayer && targetPlayer && (
        <div className="bg-gradient-to-r from-indigo-900/60 to-violet-900/60 rounded-xl p-6 border border-indigo-500/30 shadow-md text-center">
          <h3 className="text-xl font-medium mb-4 text-center text-white">
            {currentPlayer.name} is challenging {targetPlayer.name}
          </h3>
          
          <p className="text-blue-100 mb-4">
            {targetPlayer.name} must choose:
          </p>
          
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
      )}
      
      {/* 3. Challenge Progress Phase */}
      {isChallengeProgressPhase && currentPlayer && targetPlayer && (
        <div className="bg-gradient-to-r from-indigo-900/60 to-blue-900/60 rounded-xl p-6 border border-indigo-500/30 shadow-md text-center">
          <h3 className="text-xl font-medium mb-2 text-white">
            {currentPlayer.name} ➝ {targetPlayer.name}: {gameState.selectedChallengeType}
          </h3>
          
          <div className="bg-indigo-800/50 rounded-lg p-4 border border-indigo-500/30 mb-4">
            <p className="text-blue-100">
              The Dealer should now ask {targetPlayer.name} a {gameState.selectedChallengeType?.toLowerCase()} question 
              or assign a {gameState.selectedChallengeType?.toLowerCase()} challenge.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => onChallengeComplete(targetPlayer.id)}
              variant="primary"
              size="lg"
            >
              Completed!
            </Button>
            
            <Button
              onClick={() => onChallengePass(targetPlayer.id)}
              variant="outline"
              size="lg"
            >
              {targetPlayer.passesRemaining > 0 
                ? `Pass (${targetPlayer.passesRemaining} left)` 
                : `Skip (${DIFFICULTY_CONFIG[gameState.difficultyLevel].startingSips + 
                   (targetPlayer.penaltiesUsed * DIFFICULTY_CONFIG[gameState.difficultyLevel].incrementSips)} sips)`}
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
      
      {/* Current Game Status */}
      <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
        <h4 className="font-medium mb-2 text-pink-200">Game Status</h4>
        <ul className="space-y-1 text-sm text-white">
          <li>• Current Turn: {currentPlayer?.name || 'None'}</li>
          <li>• Target Player: {targetPlayer?.name || 'Not selected yet'}</li>
          <li>• Difficulty: {gameState.difficultyLevel}</li>
          <li>• Challenge: {gameState.selectedChallengeType || 'Not selected yet'}</li>
        </ul>
      </div>
      
      {/* Game Rules Reminder */}
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
    </div>
  );
}