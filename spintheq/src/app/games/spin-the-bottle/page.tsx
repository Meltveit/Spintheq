import Link from "next/link";

export default function SpinTheBottlePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-600 to-blue-800 text-white">
      {/* Navbar placeholder - will be replaced with component */}
      <header className="w-full p-4 bg-blue-900 text-white flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">SpinTheQ</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/about" className="hover:text-blue-200">About</Link></li>
            <li><Link href="/more-games" className="hover:text-blue-200">More Games</Link></li>
          </ul>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 md:p-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Spin the Bottle</h1>
        
        {/* Setup Container */}
        <div className="w-full max-w-xl bg-blue-700/50 backdrop-blur-sm rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Game Setup</h2>
          
          {/* Player Input */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Add Players</label>
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                placeholder="Enter player name" 
                className="flex-1 p-2 rounded bg-blue-800 border border-blue-500 text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <button className="bg-blue-500 hover:bg-blue-400 py-2 px-4 rounded font-medium transition-colors">
                Add
              </button>
            </div>
            
            {/* Player List - Will be dynamically generated */}
            <div className="mt-4">
              <h3 className="text-lg mb-2">Players:</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-500 py-1 px-3 rounded-full flex items-center">
                  Player 1
                  <button className="ml-2 text-sm text-blue-300 hover:text-white">✕</button>
                </span>
                <span className="bg-blue-500 py-1 px-3 rounded-full flex items-center">
                  Player 2
                  <button className="ml-2 text-sm text-blue-300 hover:text-white">✕</button>
                </span>
              </div>
            </div>
          </div>
          
          {/* Category Selection */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Select Question Categories</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button className="bg-blue-800 border-2 border-blue-400 hover:bg-blue-600 p-2 rounded-lg transition-colors text-center">
                Casual
              </button>
              <button className="bg-blue-800 border-2 border-blue-400 hover:bg-blue-600 p-2 rounded-lg transition-colors text-center">
                Spicy
              </button>
              <button className="bg-blue-800 border-2 border-blue-400 hover:bg-blue-600 p-2 rounded-lg transition-colors text-center">
                Couples
              </button>
              <button className="bg-blue-800 border-2 border-blue-400 hover:bg-blue-600 p-2 rounded-lg transition-colors text-center">
                Boys Night
              </button>
              <button className="bg-blue-800 border-2 border-blue-400 hover:bg-blue-600 p-2 rounded-lg transition-colors text-center">
                Girls Night
              </button>
              <button className="bg-blue-800 border-2 border-blue-400 hover:bg-blue-600 p-2 rounded-lg transition-colors text-center">
                Friendship
              </button>
            </div>
          </div>
          
          {/* Start Button */}
          <button className="w-full bg-blue-500 hover:bg-blue-400 py-3 rounded-lg font-bold text-lg transition-colors">
            Start Game
          </button>
        </div>
        
        {/* Ad placement - middle of content */}
        <div className="w-full max-w-xl p-4 bg-white/10 backdrop-blur-sm rounded-lg text-center mb-8">
          <p className="text-sm text-white/80">Advertisement</p>
          <div className="h-16 md:h-24 bg-gray-200/20 flex items-center justify-center">
            {/* AdSense code will go here */}
            <p className="text-white/50">Ad Space</p>
          </div>
        </div>
        
        {/* Game Instructions */}
        <div className="w-full max-w-xl bg-blue-700/50 backdrop-blur-sm rounded-xl p-6">
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
      
      {/* Footer placeholder - will be replaced with component */}
      <footer className="w-full p-4 bg-blue-900 text-white text-center">
        <p className="text-sm">© {new Date().getFullYear()} SpinTheQ. All rights reserved.</p>
      </footer>
    </div>
  );
}