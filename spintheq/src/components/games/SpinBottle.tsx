// src/components/games/SpinBottle.tsx
import { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';

// Color palette for player tags - party-themed colors
const playerColors = [
  'bg-pink-500 border-pink-300',
  'bg-purple-500 border-purple-300',
  'bg-red-500 border-red-300',
  'bg-orange-500 border-orange-300',
  'bg-amber-500 border-amber-300',
  'bg-emerald-500 border-emerald-300',
  'bg-teal-500 border-teal-300',
  'bg-cyan-500 border-cyan-300',
  'bg-indigo-500 border-indigo-300',
  'bg-fuchsia-500 border-fuchsia-300',
  'bg-rose-500 border-rose-300',
  'bg-yellow-500 border-yellow-300',
];

interface SpinBottleProps {
  players: string[];
  onPlayerSelected: (player: string) => void;
  onSpinStart: () => void;
  category: string;
}

export default function SpinBottle({ players, onPlayerSelected, onSpinStart, category }: SpinBottleProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [playerColorMap] = useState<{[key: string]: string}>(() => {
    // Assign a random color to each player when component mounts
    const colorMap: {[key: string]: string} = {};
    players.forEach((player, index) => {
      colorMap[player] = playerColors[index % playerColors.length];
    });
    return colorMap;
  });

  // Update player colors when player list changes
  useEffect(() => {
    // For any new players, assign a color
    players.forEach((player) => {
      if (!playerColorMap[player]) {
        const unusedColors = playerColors.filter(color => !Object.values(playerColorMap).includes(color));
        playerColorMap[player] = unusedColors.length > 0 
          ? unusedColors[0] 
          : playerColors[Object.keys(playerColorMap).length % playerColors.length];
      }
    });
  }, [players, playerColorMap]);

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
    };
  }, []);

  // Get the border color based on category
  const getBorderColor = () => {
    switch(category) {
      case 'Casual': return 'border-blue-400';
      case 'Spicy': return 'border-pink-400';
      case 'Couples': return 'border-purple-400';
      default: return 'border-amber-400';
    }
  };

  // Get the background color based on category
  const getBackgroundColor = () => {
    switch(category) {
      case 'Casual': return 'bg-blue-900/50';
      case 'Spicy': return 'bg-pink-900/50';
      case 'Couples': return 'bg-purple-900/50';
      default: return 'bg-indigo-900/50';
    }
  };

  // Get the glow color based on category
  const getGlowColor = () => {
    switch(category) {
      case 'Casual': return 'shadow-[0_0_25px_rgba(59,130,246,0.3)]';
      case 'Spicy': return 'shadow-[0_0_25px_rgba(236,72,153,0.3)]';
      case 'Couples': return 'shadow-[0_0_25px_rgba(147,51,234,0.3)]';
      default: return 'shadow-[0_0_25px_rgba(99,102,241,0.3)]';
    }
  };

  const spinBottle = () => {
    // Don't allow spinning if already spinning or if no players
    if (isSpinning || players.length < 2) return;
    
    // Notify parent that spinning has started
    onSpinStart();
    
    setIsSpinning(true);
    
    // Reset selected player
    setSelectedPlayerIndex(null);
    
    // Calculate a random number of rotations (between 2 and 5 full rotations)
    const spinAmount = 720 + Math.floor(Math.random() * 1080);
    
    // Calculate new final position
    const newRotation = rotation + spinAmount;
    
    // Update rotation state to make the bottle spin
    setRotation(newRotation);
    
    // Wait for the animation to complete before selecting the closest player
    spinTimeoutRef.current = setTimeout(() => {
      // Calculate closest player based on the normalized final angle
      const finalAngle = newRotation % 360;
      const closestPlayer = findClosestPlayer(finalAngle);
      
      setIsSpinning(false);
      setSelectedPlayerIndex(closestPlayer);
      onPlayerSelected(players[closestPlayer]);
    }, 3000); // This should match the transition duration in CSS
  };
  
  // Find the closest player based on the bottle's final angle
  const findClosestPlayer = (finalAngle: number): number => {
    let closestPlayerIndex = 0;
    let smallestAngleDifference = 360;
    
    players.forEach((_, index) => {
      // Calculate the position of this player in degrees (0 degrees is at the top, moving clockwise)
      const playerAngle = (index * (360 / players.length)) % 360;
      
      // Calculate the difference between the bottle's angle and the player's angle
      let angleDifference = Math.abs(finalAngle - playerAngle);
      
      // Consider the shorter arc
      if (angleDifference > 180) {
        angleDifference = 360 - angleDifference;
      }
      
      // Update closest player if this one is closer
      if (angleDifference < smallestAngleDifference) {
        smallestAngleDifference = angleDifference;
        closestPlayerIndex = index;
      }
    });
    
    return closestPlayerIndex;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Player Circle */}
      <div className={`relative w-72 h-72 md:w-96 md:h-96 rounded-full border-4 ${getBorderColor()} ${getBackgroundColor()} backdrop-blur-sm mb-6 ${getGlowColor()}`}>
        {/* Place players around the circle */}
        {players.map((player, index) => {
          // Calculate the position on the circle
          const angle = (index * (360 / players.length)) * (Math.PI / 180);
          // Set radius to move players closer to bottle but not too close
          const radius = players.length > 6 ? 70 : 80; 
          const left = 50 + Math.cos(angle) * radius;
          const top = 50 + Math.sin(angle) * radius;
          
          return (
            <div
              key={index}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${playerColorMap[player]} px-4 py-2 rounded-full text-white text-md font-bold border-2 shadow-lg ${
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
        
        {/* Enhanced Bottle */}
        <div 
          className="absolute top-1/2 left-1/2 origin-top transform -translate-x-1/2 -translate-y-0 transition-transform duration-3000 ease-out"
          style={{ 
            transform: `translate(-50%, 0) rotate(${rotation}deg)`,
            height: '55%',
            width: '16%'
          }}
        >
          {/* Bottle body */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-3/4 bg-gradient-to-b from-amber-700 to-amber-900 rounded-md overflow-hidden">
            {/* Bottle shine */}
            <div className="absolute top-0 left-1/4 w-1/4 h-full bg-amber-600/20 rounded-full"></div>
            
            {/* Bottle label */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-4/5 h-1/2 bg-white/90 rounded flex items-center justify-center">
              <div className="text-amber-800 font-bold text-xs transform rotate-90">SpinTheQ</div>
            </div>
          </div>
          
          {/* Bottle neck */}
          <div className="absolute bottom-[75%] left-1/2 transform -translate-x-1/2 w-1/2 h-1/6 bg-amber-800 rounded-sm"></div>
          
          {/* Bottle cap */}
          <div className="absolute bottom-[91%] left-1/2 transform -translate-x-1/2 w-2/3 h-[8%] bg-amber-600 rounded-full"></div>
        </div>
      </div>
      
      {/* Spin Button */}
      <Button
        onClick={spinBottle}
        disabled={isSpinning || players.length < 2}
        variant={category === 'Casual' ? 'primary' : (category === 'Spicy' ? 'secondary' : 'outline')}
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