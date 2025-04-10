import { useState, useEffect, useRef } from 'react';

interface SpinBottleProps {
  players: string[];
  onPlayerSelected: (player: string) => void;
}

export default function SpinBottle({ players, onPlayerSelected }: SpinBottleProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const bottleRef = useRef<HTMLDivElement>(null);

  const spinBottle = () => {
    if (isSpinning || players.length < 2) return;
    
    setIsSpinning(true);
    setSelectedPlayer(null);
    
    // Random rotation between 720 and 1080 degrees (2-3 full spins) plus offset
    const minRotation = 720;
    const maxRotation = 1080;
    const newRotation = rotation + Math.floor(Math.random() * (maxRotation - minRotation + 1)) + minRotation;
    
    setRotation(newRotation);
    
    // Calculate which player is selected based on final rotation
    setTimeout(() => {
      const finalRotationNormalized = newRotation % 360;
      const degreesPerPlayer = 360 / players.length;
      const selectedIndex = Math.floor(finalRotationNormalized / degreesPerPlayer);
      const selected = players[selectedIndex % players.length];
      
      setSelectedPlayer(selected);
      setIsSpinning(false);
      onPlayerSelected(selected);
    }, 3000); // Match this with the CSS transition duration
  };

  // Add "player markers" around the bottle
  const renderPlayerMarkers = () => {
    return players.map((player, index) => {
      const angle = (index * 360) / players.length;
      const markerStyle = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: `rotate(${angle}deg) translate(160px) rotate(-${angle}deg)`,
        transformOrigin: '0 0',
      };
      
      return (
        <div
          key={index}
          className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm absolute"
          style={markerStyle}
        >
          {player}
        </div>
      );
    });
  };

  return (
    <div className="relative w-full h-80 flex items-center justify-center">
      {/* Circle backdrop */}
      <div className="w-64 h-64 rounded-full bg-blue-800/50 absolute"></div>
      
      {/* Player markers positioned around the circle */}
      {renderPlayerMarkers()}
      
      {/* Bottle */}
      <div
        ref={bottleRef}
        className="w-8 h-40 bg-amber-600 rounded-full relative transform origin-center transition-transform duration-3000 ease-out"
        style={{
          transformOrigin: 'center 50%',
          transform: `translateY(-20px) rotate(${rotation}deg)`,
        }}
      >
        {/* Bottle neck */}
        <div className="w-4 h-20 bg-amber-700 absolute top-0 left-1/2 -ml-2 rounded-t-full"></div>
        
        {/* Bottle cap */}
        <div className="w-6 h-6 bg-gray-300 absolute top-0 left-1/2 -ml-3 -mt-3 rounded-full border-2 border-gray-400"></div>
        
        {/* Bottle point indicator */}
        <div className="w-4 h-4 bg-red-500 absolute top-0 left-1/2 -ml-2 -mt-2 rounded-full"></div>
      </div>
      
      {/* Spin button */}
      <button
        onClick={spinBottle}
        disabled={isSpinning || players.length < 2}
        className={`absolute bottom-0 px-6 py-3 rounded-full text-white font-bold transition-colors ${
          isSpinning || players.length < 2
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-400'
        }`}
      >
        {isSpinning ? 'Spinning...' : 'Spin Bottle'}
      </button>
      
      {/* Selected player announcement */}
      {selectedPlayer && (
        <div className="absolute top-0 left-0 right-0 bg-blue-500 py-2 text-center text-white font-bold rounded-lg">
          The bottle points to: {selectedPlayer}
        </div>
      )}
    </div>
  );
}