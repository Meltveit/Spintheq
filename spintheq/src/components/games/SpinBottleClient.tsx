// src/components/games/SpinBottleClient.tsx
'use client';

import { useState, useEffect } from 'react';
import SpinBottle from './SpinBottle';
import { CategoryKey } from '../../lib/content/spin-the-bottle';

interface SpinBottleClientProps {
  players: string[];
  onPlayerSelected: (player: string) => void;
  onSpinStart: () => void;
  category: CategoryKey;
}

export default function SpinBottleClient({ players, onPlayerSelected, onSpinStart, category }: SpinBottleClientProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <div className="text-center p-4">Loading spinner...</div>;
  }
  
  return <SpinBottle 
    players={players} 
    onPlayerSelected={onPlayerSelected} 
    onSpinStart={onSpinStart}
    category={category}
  />;
}