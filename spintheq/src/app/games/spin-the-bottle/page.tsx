// src/app/games/spin-the-bottle/page.tsx
'use client';

import { useEffect } from "react";
import AdBanner from "@/components/ui/AdBanner";
import SpinTheBottleGame from "@/components/games/SpinTheBottleGame";

export default function SpinTheBottlePage() {
  // Add a custom background color for this specific page
  useEffect(() => {
    // Add a custom gradient background to the body
    document.body.classList.add('spin-bottle-page');
    
    return () => {
      document.body.classList.remove('spin-bottle-page');
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">Spin the Bottle</h1>
      
      {/* Top Ad Banner */}
      <AdBanner position="top" className="mb-8" />
      
      {/* Game Component */}
      <SpinTheBottleGame />
      
      {/* Game Instructions */}
      <div className="w-full max-w-xl bg-gradient-to-r from-purple-900/50 to-red-900/50 backdrop-blur-sm rounded-xl p-6 mt-8 border border-purple-400/30 shadow-lg">
        <h2 className="text-xl font-semibold mb-2 text-white">How to Play</h2>
        <ol className="list-decimal pl-5 space-y-2 text-blue-50">
          <li>Add all players who are participating</li>
          <li>Select question categories you want to include</li>
          <li>Click the <strong>Start Game</strong> button to begin</li>
          <li>Spin the bottle to randomly select a player</li>
          <li>The selected player answers the question or completes the challenge</li>
          <li>Continue playing by spinning the bottle again for the next round</li>
        </ol>
      </div>
    </div>
  );
}