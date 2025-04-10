// src/app/games/truth-or-dare/page.tsx
'use client';

import { useEffect } from "react";
import AdBanner from "@/components/ui/AdBanner";
import TruthOrDareGame from "@/components/games/TruthOrDareGame";

export default function TruthOrDarePage() {
  // Add a custom background color for this specific page
  useEffect(() => {
    // Add a custom gradient background to the body
    document.body.classList.add('truth-dare-page');
    
    return () => {
      document.body.classList.remove('truth-dare-page');
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">Truth or Dare</h1>
      
      {/* Top Ad Banner */}
      <AdBanner position="top" className="mb-8" />
      
      {/* Game Component */}
      <TruthOrDareGame />
      
      {/* Game Instructions */}
      <div className="w-full max-w-xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-xl p-6 mt-8 border border-purple-400/30 shadow-lg">
        <h2 className="text-xl font-semibold mb-2 text-white">How to Play</h2>
        <ol className="list-decimal pl-5 space-y-2 text-purple-50">
          <li>Add all players who are participating, including a Dealer</li>
          <li>Select the drinking difficulty level based on your group</li>
          <li>Each player gets 2 free passes to skip a Truth or Dare</li>
          <li>After using passes, rejections result in drinking penalties</li>
          <li>Earn 1 point for completing a Truth, 2 points for a Dare</li>
          <li>When a player reaches 5 points, they can distribute sips to others</li>
          <li>The Dealer tracks points, passes, and manages the game</li>
        </ol>
      </div>
    </div>
  );
}