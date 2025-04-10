'use client';

import { useState } from 'react';

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
      <h3 className="text-lg font-medium mb-3">Players</h3>
      
      {/* Add player form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter player name"
          className="flex-1 p-2 rounded bg-blue-800 border border-blue-500 text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          maxLength={20}
        />
        <button 
          type="submit"
          className="bg-blue-500 hover:bg-blue-400 py-2 px-4 rounded font-medium transition-colors"
          disabled={!playerName.trim()}
        >
          Add
        </button>
      </form>
      
      {/* Player list */}
      {players.length === 0 ? (
        <p className="text-blue-300 text-center py-4">Add at least 2 players to start the game</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {players.map((player, index) => (
            <div 
              key={index} 
              className="bg-blue-500 py-1 px-3 rounded-full flex items-center"
            >
              <span className="mr-2">{player}</span>
              <button 
                onClick={() => onRemovePlayer(index)}
                className="text-blue-300 hover:text-white transition-colors"
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
        <p className="text-blue-200 text-sm mt-4">
          {players.length} player{players.length !== 1 ? 's' : ''} added
        </p>
      )}
    </div>
  );
}