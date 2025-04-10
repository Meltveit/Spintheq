// src/components/games/PlayerList.tsx
'use client';

import { useState } from 'react';

// Color palette for the player list items
const playerListColors = [
  'bg-pink-500',
  'bg-purple-500',
  'bg-indigo-500',
  'bg-blue-500',
  'bg-teal-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-amber-500',
];

interface PlayerListProps {
  players: string[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (index: number) => void;
}

export default function PlayerList({ players, onAddPlayer, onRemovePlayer }: PlayerListProps) {
  const [playerName, setPlayerName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onAddPlayer(playerName.trim());
      setPlayerName('');
    }
  };
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-3 text-white">Players</h3>
      
      {/* Add player form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter player name"
          className="flex-1 p-2 rounded bg-indigo-800/70 border border-indigo-400 text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          maxLength={20}
        />
        <button 
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 py-2 px-4 rounded font-medium transition-colors text-white shadow-md"
          disabled={!playerName.trim()}
        >
          Add
        </button>
      </form>
      
      {/* Player list */}
      {players.length === 0 ? (
        <p className="text-indigo-100 text-center py-4">Add at least 2 players to start the game</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {players.map((player, index) => (
            <div 
              key={index} 
              className={`${playerListColors[index % playerListColors.length]} py-1 px-3 rounded-full flex items-center shadow-md border border-white/20`}
            >
              <span className="mr-2 text-white font-medium">{player}</span>
              <button 
                onClick={() => onRemovePlayer(index)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label={`Remove ${player}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Display error message if there are less than 2 players */}
      {players.length > 0 && players.length < 2 && (
        <p className="text-yellow-300 text-sm mt-2">Add at least one more player to start the game</p>
      )}
      
      {/* Player count */}
      {players.length > 0 && (
        <p className="text-indigo-100 text-sm mt-4">
          {players.length} player{players.length !== 1 ? 's' : ''} added
        </p>
      )}
    </div>
  );
}