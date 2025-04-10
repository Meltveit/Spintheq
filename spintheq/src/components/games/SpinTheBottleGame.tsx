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
  const [currentCategory, setCurrentCategory] = useState<CategoryKey>('Casual');
  
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
  
  // Handle when spinning starts - clear the selected player
  const handleSpinStart = () => {
    setSelectedPlayer(null);
  };
  
  // Handle the bottle pointing to a player
  const handlePlayerSelected = (player: string) => {
    // Select a random category from the enabled categories
    const randomCategory = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
    setCurrentCategory(randomCategory);
    setSelectedPlayer(player);
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
  
  // Get the background color based on category
  const getBackgroundColor = (cat: CategoryKey) => {
    switch(cat) {
      case 'Casual': return 'from-blue-900/60 to-indigo-900/60 border-blue-500/20';
      case 'Spicy': return 'from-pink-900/60 to-red-900/60 border-pink-500/20';
      case 'Couples': return 'from-purple-900/60 to-fuchsia-900/60 border-purple-500/20';
      default: return 'from-indigo-900/60 to-blue-900/60 border-indigo-500/20';
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
          <div className="bg-gradient-to-r from-purple-900 to-fuchsia-900 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-400/30">
            <PlayerList 
              players={players} 
              onAddPlayer={handleAddPlayer} 
              onRemovePlayer={handleRemovePlayer} 
            />
          </div>
          
          {/* Ad Banner */}
          <AdBanner position="middle" />
          
          {/* Category Selection */}
          <div className="bg-gradient-to-r from-red-900 to-amber-900 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-red-400/30">
            <h3 className="text-lg font-medium mb-3 text-white">Choose Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableCategories.map(category => (
                <button 
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`p-2 rounded-lg transition-colors text-center text-white ${
                    selectedCategories.includes(category)
                      ? getCategoryButtonColor(category)
                      : 'bg-slate-900/60 border-2 border-slate-700 hover:bg-slate-800'
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
            <div className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-amber-600 rounded-full text-sm font-medium shadow-md">
              <span>{players.length}</span> Players
            </div>
          </div>
          
          {/* Bottle Spinner */}
          <div className={`bg-gradient-to-b ${getBackgroundColor(currentCategory)} rounded-xl p-6 backdrop-blur-sm shadow-lg border`}>
            <SpinBottleClient 
              players={players} 
              onPlayerSelected={handlePlayerSelected}
              onSpinStart={handleSpinStart}
              category={currentCategory}
            />
          </div>
          
          {/* Question Display */}
          <QuestionDisplay 
            selectedPlayer={selectedPlayer}
            categories={[currentCategory]}
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
      case 'Casual': return 'bg-blue-600 border-2 border-blue-400 shadow-md';
      case 'Spicy': return 'bg-pink-600 border-2 border-pink-400 shadow-md';
      case 'Couples': return 'bg-purple-600 border-2 border-purple-400 shadow-md';
      default: return 'bg-blue-600 border-2 border-blue-400 shadow-md';
    }
  }
}