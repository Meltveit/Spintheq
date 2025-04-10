'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import the SpinBottle component with ssr disabled
const DynamicSpinBottle = dynamic(() => import('./SpinBottle'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading spinner...</div>
});

interface SpinBottleClientProps {
  players: string[];
  onPlayerSelected: (player: string) => void;
}

export default function SpinBottleClient({ players, onPlayerSelected }: SpinBottleClientProps) {
  return <DynamicSpinBottle players={players} onPlayerSelected={onPlayerSelected} />;
}