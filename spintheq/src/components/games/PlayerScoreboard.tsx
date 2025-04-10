// src/components/games/PlayerScoreboard.tsx
'use client';

import { useState } from 'react';
import { Player, DifficultyLevel, DIFFICULTY_CONFIG } from '@/lib/models/truth-or-dare';

interface PlayerScoreboardProps {
  players: Player[];
  difficultyLevel: DifficultyLevel;
  currentPlayerId: string | null;
  targetPlayerId: string | null;
  onStartDistribution?: (playerId: string) => void;
  distributionInProgress: boolean;
  onPlayerSelect?: (playerId: string) => void;
  selectionPhase: boolean;
}

export default function PlayerScoreboard({
  players,
  difficultyLevel,
  currentPlayerId,
  targetPlayerId,
  onStartDistribution,
  distributionInProgress,
  onPlayerSelect,
  selectionPhase
}: PlayerScoreboardProps) {
  const [sortBy, setSortBy] = useState<'name' | 'points' | 'passes'>('name');
  
  // Filter out dealer
  const gamePlayers = players.filter(player => !player.isDealer);
  
  // Sort players based on the selected criteria
  const sortedPlayers = [...gamePlayers].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'points') return b.points - a.points;
    if (sortBy === 'passes') return b.passesRemaining - a.passesRemaining;
    return 0;
  });
  
  // Check if a player can distribute sips
  const canDistribute = (player: Player): boolean => {
    return player.points >= 5;
  };
  
  return (
    <div className="bg-purple-900/50 rounded-xl p-4 border border-purple-500/30 shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-white">Players</h3>
        
        <div className="flex text-xs space-x-2">
          <button 
            onClick={() => setSortBy('name')}
            className={`px-2 py-1 rounded ${sortBy === 'name' ? 'bg-purple-600 text-white' : 'bg-purple-800/50 text-purple-200'}`}
          >
            Name
          </button>
          <button 
            onClick={() => setSortBy('points')}
            className={`px-2 py-1 rounded ${sortBy === 'points' ? 'bg-purple-600 text-white' : 'bg-purple-800/50 text-purple-200'}`}
          >
            Points
          </button>
          <button 
            onClick={() => setSortBy('passes')}
            className={`px-2 py-1 rounded ${sortBy === 'passes' ? 'bg-purple-600 text-white' : 'bg-purple-800/50 text-purple-200'}`}
          >
            Passes
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {sortedPlayers.map((player) => (
          <div 
            key={player.id} 
            className={`
              p-3 rounded-lg border transition-colors
              ${player.id === currentPlayerId 
                ? 'bg-purple-600/70 border-purple-300 shadow-md animate-pulse' 
                : player.id === targetPlayerId
                ? 'bg-pink-600/70 border-pink-300 shadow-md'
                : 'bg-purple-800/40 border-purple-600/30'}
              ${selectionPhase && player.id !== currentPlayerId 
                ? 'cursor-pointer hover:bg-purple-700/60'
                : ''}
            `}
            onClick={() => {
              // Only allow selecting players during the player selection phase
              if (selectionPhase && player.id !== currentPlayerId && onPlayerSelect) {
                onPlayerSelect(player.id);
              }
            }}
          >
            <div className="flex justify-between items-center">
              <h4 className="font-medium flex items-center gap-2">
                {player.name}
                {player.id === currentPlayerId && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
                {player.id === targetPlayerId && (
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
                Next pass: {DIFFICULTY_CONFIG[difficultyLevel].startingSips + 
                 (player.penaltiesUsed * DIFFICULTY_CONFIG[difficultyLevel].incrementSips)} sips
              </div>
            )}
            
            {/* Show stats */}
            <div className="mt-1 text-xs text-purple-200 flex justify-between">
              <span>Completed: {player.challengesCompleted}</span>
              <span>Failed: {player.challengesFailed}</span>
            </div>
            
            {/* Distribution button (only shown when a player has enough points) */}
            {canDistribute(player) && onStartDistribution && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartDistribution(player.id);
                }}
                className="mt-2 w-full text-sm py-1 px-2 bg-pink-600 hover:bg-pink-500 transition-colors rounded text-white font-medium"
                disabled={distributionInProgress}
              >
                Distribute {DIFFICULTY_CONFIG[difficultyLevel].distributionMultiplier} Sips
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}