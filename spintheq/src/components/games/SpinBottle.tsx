import { useState, useRef } from 'react';

type SpinBottleProps = {
  players: string[];
  onPlayerSelected: (playerName: string) => void;
};

export default function SpinBottle(props: SpinBottleProps) {
  const { players, onPlayerSelected } = props;
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const bottleRef = useRef<HTMLDivElement>(null);

  // Calculate positions for players in a circle
  const getPlayerPositions = () => {
    if (players.length === 0) return [];
    
    const positions = players.map((player, index) => {
      const angle = (index / players.length) * 2 * Math.PI;
      const x = Math.cos(angle) * 40 + 50; // 50% is center, 40% is radius
      const y = Math.sin(angle) * 40 + 50; // 50% is center, 40% is radius
      return { name: player, x, y, angle: angle * (180 / Math.PI) };
    });
    
    return positions;
  };

  const playerPositions = getPlayerPositions();

  // Spin the bottle
  const spinBottle = () => {
    if (isSpinning || players.length < 2) return;
    
    setIsSpinning(true);
    setSelectedPlayerIndex(null);
    
    // Random number of rotations (3-6 full rotations + random ending)
    const minRotations = 3;
    const maxRotations = 6;
    const fullRotations = Math.random() * (maxRotations - minRotations) + minRotations;
    
    // Random player selection
    const randomPlayerIndex = Math.floor(Math.random() * players.length);
    const targetAngle = playerPositions[randomPlayerIndex].angle;
    
    // Calculate final rotation
    // Adjust by 90 degrees so the bottle points upward at 0 degrees
    const newRotation = fullRotations * 360 + targetAngle + 90;
    
    setRotation(newRotation);
    
    // After animation completes, update state
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedPlayerIndex(randomPlayerIndex);
      onPlayerSelected(players[randomPlayerIndex]);
    }, 3000); // Match this to CSS transition duration
  };

  return (
    <div className="w-full relative aspect-square max-w-md mx-auto bg-blue-700/50 backdrop-blur-sm rounded-full">
      {/* Players positioned around the circle */}
      {playerPositions.map((player, index) => (
        <div 
          key={index}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center
            ${selectedPlayerIndex === index ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-blue-800' : ''}`}
          style={{
            left: `${player.x}%`,
            top: `${player.y}%`,
          }}
        >
          <span className="text-xs font-medium text-center">{player.name}</span>
        </div>
      ))}
      
      {/* The bottle */}
      <div 
        ref={bottleRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/6 transition-transform duration-3000 ease-out"
        style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="bg-amber-800/70 w-full h-3 rounded-full"></div>
          <div className="absolute w-4 h-4 bg-amber-700 rounded-full"></div>
          <div className="absolute right-0 w-0 h-0 
            border-t-[8px] border-t-transparent
            border-l-[16px] border-l-amber-800
            border-b-[8px] border-b-transparent"></div>
        </div>
      </div>
      
      {/* Spin button - positioned in the center */}
      <button
        onClick={spinBottle}
        disabled={isSpinning || players.length < 2}
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-sm
          ${isSpinning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500'}
          ${players.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isSpinning ? "Spinning..." : "SPIN"}
      </button>
      
      {/* No players message */}
      {players.length < 2 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white text-sm bg-blue-800/70 px-3 py-1 rounded-full">
          Add at least 2 players to start
        </div>
      )}
      
      <style jsx>{`
        .duration-3000 {
          transition-duration: 3000ms;
        }
      `}</style>
    </div>
  );
}