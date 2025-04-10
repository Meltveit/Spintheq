import dynamic from "next/dynamic";
import AdBanner from "@/components/ui/AdBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spin the Bottle - SpinTheQ",
  description: "Play the classic Spin the Bottle game with a digital twist!",
};

// Dynamically import the correct game component (SpinTheBottleGame, not SpinBottle)
// The SpinBottleGame component will handle all the game logic including the bottle spinner
const SpinBottle = dynamic(() => import("@/components/games/SpinBottle"), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading game...</div>
});

export default function SpinTheBottlePage() {
  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Spin the Bottle</h1>
      
      {/* Top Ad Banner */}
      <AdBanner position="top" className="mb-8" />
      
      {/* Game Component */}
      <SpinBottle 
        players={[]} 
        onPlayerSelected={(player) => console.log("Selected player:", player)} 
      />
      
      {/* Game Instructions */}
      <div className="w-full max-w-xl bg-blue-700/50 backdrop-blur-sm rounded-xl p-6 mt-8">
        <h2 className="text-xl font-semibold mb-2">How to Play</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Add all players who are participating</li>
          <li>Select question categories you want to include</li>
          <li>Click the <strong>Start Game</strong> button to begin</li>
          <li>The app will randomly select a player and question</li>
          <li>The selected player answers the question or completes the challenge</li>
          <li>Continue playing by clicking the <strong>Next Question</strong> button after each round</li>
        </ol>
      </div>
    </div>
  );
}