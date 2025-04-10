// src/components/games/GameHistoryLog.tsx
'use client';

import { GameActionHistory, GameState } from '@/lib/models/truth-or-dare';

interface GameHistoryLogProps {
  history: GameActionHistory[];
  gameState: GameState;
  maxEntries?: number;
}

export default function GameHistoryLog({ 
  history, 
  gameState, 
  maxEntries = 5 
}: GameHistoryLogProps) {
  if (history.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-r from-indigo-900/50 to-blue-900/50 rounded-xl p-4 border border-indigo-500/30 shadow-md">
      <h3 className="text-lg font-medium mb-3 text-white">Recent Actions</h3>
      <div className="max-h-40 overflow-y-auto pr-2">
        <ul className="space-y-2">
          {history.slice(-maxEntries).reverse().map((action, index) => {
            const challenger = gameState.players.find(p => p.id === action.challengerId);
            const target = gameState.players.find(p => p.id === action.targetId);
            
            let actionText = '';
            switch (action.result) {
              case 'completed':
                actionText = `${target?.name} completed ${challenger?.name}'s ${action.challengeType} (+${action.points} pts)`;
                break;
              case 'passed':
                actionText = `${target?.name} passed on ${challenger?.name}'s ${action.challengeType} (free pass)`;
                break;
              case 'penalty':
                actionText = `${target?.name} skipped ${challenger?.name}'s ${action.challengeType} (${action.sips} sips)`;
                break;
              case 'distribution':
                actionText = `${challenger?.name} gave ${target?.name} ${action.sips} sips`;
                break;
            }
            
            return (
              <li key={index} className="text-sm text-white py-1 border-b border-indigo-700/30 last:border-b-0">
                <span className="text-xs text-blue-300 mr-1">Round {action.round}:</span> {actionText}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}