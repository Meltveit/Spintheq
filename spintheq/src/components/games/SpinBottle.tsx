import { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';

interface SpinBottleProps {
  players: string[];
  onPlayerSelected: (player: string) => void;
}

export default function SpinBottle({ players, onPlayerSelected }: SpinBottleProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
    };
  }, []);

  const spinBottle = () => {
    // Don't allow spinning if already spinning or if no players
    if (isSpinning || players.length < 2) return;
    
    setIsSpinning(true);
    
    // Reset selected player
    setSelectedPlayerIndex(null);
    
    // Calculate a random number of rotations (between 2 and 5 full rotations)
    const spinAmount = 720 + Math.floor(Math.random() * 1080);
    
    // Update rotation state to make the bottle spin
    setRotation(prevRotation => prevRotation + spinAmount);
    
    // Determine which player is selected after the spin
    const normalizedDegrees = spinAmount % 360;
    const degreesPerPlayer = 360 / players.length;
    
    // Calculate which player the bottle points to
    // The bottle points to the right (0 degrees), so we offset by 90 degrees
    const playerIndex = Math.floor(((normalizedDegrees + 90) % 360) / degreesPerPlayer);
    const selectedIndex = players.length - 1 - playerIndex;
    
    // Wait for the animation to complete before calling the callback
    spinTimeoutRef.current = setTimeout(() => {
      setIsSpinning(false);
      setSelectedPlayerIndex(selectedIndex);
      onPlayerSelected(players[selectedIndex]);
    }, 3000); // This should match the transition duration in CSS
  };

  return (
    <div className="flex flex-col items-center">
      {/* Player Circle */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-blue-400 bg-blue-800/50 backdrop-blur-sm mb-6">
        {/* Place players around the circle */}
        {players.map((player, index) => {
          // Calculate the position on the circle
          const angle = (index * (360 / players.length)) * (Math.PI / 180);
          const radius = players.length > 6 ? 105 : 115; // Adjust radius based on number of players
          const left = 50 + Math.cos(angle) * radius;
          const top = 50 + Math.sin(angle) * radius;
          
          return (
            <div
              key={index}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 px-3 py-1 rounded-full text-white text-sm ${
                selectedPlayerIndex === index ? 'ring-2 ring-yellow-300 animate-pulse' : ''
              }`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                zIndex: selectedPlayerIndex === index ? 10 : 1
              }}
            >
              {player}
            </div>
          );
        })}
        
        {/* Bottle */}
        <div 
          className="absolute top-1/2 left-1/2 w-2 h-32 bg-amber-800 origin-top transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-3000 ease-out"
          style={{ 
            transform: `translate(-50%, 0) rotate(${rotation}deg)`,
            borderRadius: '0 0 4px 4px'
          }}
        >
          {/* Bottle neck */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-700 rounded-full"></div>
          
          {/* Bottle bottom */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-16 bg-amber-800 rounded-md"></div>
        </div>
      </div>
      
      {/* Spin Button */}
      <Button
        onClick={spinBottle}
        disabled={isSpinning || players.length < 2}
        variant="primary"
        size="lg"
        isLoading={isSpinning}
      >
        {isSpinning ? 'Spinning...' : 'Spin the Bottle'}
      </Button>
      
      {players.length < 2 && (
        <p className="text-yellow-300 text-sm mt-2">
          Add at least 2 players to spin
        </p>
      )}
    </div>
  );
}