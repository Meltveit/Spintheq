// src/components/games/SpinTheBottleGame.tsx
'use client';

import { useState } from 'react';
import SpinBottleClient from './SpinBottleClient';
import QuestionDisplay from './QuestionDisplay';
import PlayerList from './PlayerList';
import Button from '../ui/Button';
import AdBanner from '../ui/AdBanner';
import { CategoryKey } from '../../lib/content/spin-the-bottle';

export default function SpinTheBottleGame() {
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>(['Casual']);
  
  const availableCategories: CategoryKey[] = ['Casual', 'Spicy', 'Couples'];
  
  // Add a player to the game
  const handleAddPlayer = (name: string) => {
    if (!players.includes(name)) {
      setPlayers([...players, name]);
    }
  };
  
  // Remove a player from the game
  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };
  
  // Handle the bottle pointing to a player
  const handlePlayerSelected = (player: string) => {
    setSelectedPlayer(player);
  };
  
  // Handle next question (reset the selected player)
  const handleNextQuestion = () => {
    setSelectedPlayer(null);
  };
  
  // Toggle category selection
  const toggleCategory = (category: CategoryKey) => {
    if (selectedCategories.includes(category)) {
      // Don't allow removing the last category
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== category));
      }
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Start the game
  const startGame = () => {
    if (players.length >= 2) {
      setGameStarted(true);
      setSelectedPlayer(null);
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setGameStarted(false);
    setSelectedPlayer(null);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {!gameStarted ? (
        // Game setup screen
        <div className="space-y-8">
          {/* Player Input */}
          <div className="bg-blue-700/50 backdrop-blur-sm rounded-xl p-6">
            <PlayerList 
              players={players} 
              onAddPlayer={handleAddPlayer} 
              onRemovePlayer={handleRemovePlayer} 
            />
          </div>
          
          {/* Ad Banner */}
          <AdBanner position="middle" />
          
          {/* Category Selection */}
          <div className="bg-blue-700/50 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-lg font-medium mb-3">Choose Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableCategories.map(category => (
                <button 
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`p-2 rounded-lg transition-colors text-center ${
                    selectedCategories.includes(category)
                      ? getCategoryButtonColor(category)
                      : 'bg-blue-800 border-2 border-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Start Game Button */}
          <Button 
            onClick={startGame} 
            disabled={players.length < 2}
            variant="primary"
            size="lg"
            fullWidth
          >
            Start Game
          </Button>
          
          {players.length < 2 && (
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
            <div className="px-3 py-1 bg-blue-600 rounded-full text-sm">
              <span className="font-medium">{players.length}</span> Players
            </div>
          </div>
          
          {/* Bottle Spinner */}
          <SpinBottleClient 
            players={players} 
            onPlayerSelected={handlePlayerSelected} 
          />
          
          {/* Question Display */}
          <QuestionDisplay 
            selectedPlayer={selectedPlayer}
            categories={selectedCategories}
            onNextQuestion={handleNextQuestion}
          />
          
          {/* Ad Banner */}
          <AdBanner position="bottom" />
        </div>
      )}
    </div>
  );
  
  // Helper function for category button colors
  function getCategoryButtonColor(category: CategoryKey) {
    switch(category) {
      case 'Casual': return 'bg-blue-500 border-2 border-blue-300';
      case 'Spicy': return 'bg-pink-500 border-2 border-pink-300';
      case 'Couples': return 'bg-purple-500 border-2 border-purple-300';
      default: return 'bg-blue-500 border-2 border-blue-300';
    }
  }
}