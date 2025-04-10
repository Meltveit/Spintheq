// src/components/games/SpinBottleClient.tsx
'use client';

import { useState, useEffect } from 'react';
import SpinBottle from './SpinBottle';

interface SpinBottleClientProps {
  players: string[];
  onPlayerSelected: (player: string) => void;
}

export default function SpinBottleClient({ players, onPlayerSelected }: SpinBottleClientProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <div className="text-center p-4">Loading spinner...</div>;
  }
  
  return <SpinBottle players={players} onPlayerSelected={onPlayerSelected} />;
}