import SpinTheBottleGame from "../../../components/games/SpinTheBottleGame";
import AdBanner from "../../../components/ui/AdBanner";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";

export default function SpinTheBottlePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-600 to-blue-800 text-white">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1 flex flex-col items-center p-4 md:p-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Spin the Bottle</h1>
        
        {/* Top Ad Banner */}
        <AdBanner position="top" className="mb-8" />
        
        {/* Game Component */}
        <SpinTheBottleGame />
        
        {/* Game Instructions */}
        <div className="w-full max-w-xl bg-blue-700/50 backdrop-blur-sm rounded-xl p-6 mt-8">
          <h2 className="text-xl font-semibold mb-2">How to Play</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Add all players who are participating</li>
            <li>Select question categories you want to include</li>
            <li>Press "Start Game" to begin</li>
            <li>The app will randomly select a player and question</li>
            <li>The selected player answers the question or completes the challenge</li>
            <li>Continue playing by pressing "Next Question" after each round</li>
          </ol>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}