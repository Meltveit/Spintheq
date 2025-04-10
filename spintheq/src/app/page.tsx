import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-500 to-blue-700">
      {/* Navbar placeholder - will be replaced with component */}
      <header className="w-full p-4 bg-blue-800 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">SpinTheQ</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/about" className="hover:text-blue-200">About</Link></li>
            <li><Link href="/more-games" className="hover:text-blue-200">More Games</Link></li>
          </ul>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">
          SpinTheQ
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-center max-w-2xl">
          Ultimate Party Games Platform
        </p>

        {/* Ad placement - top of content */}
        <div className="w-full max-w-4xl mb-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg text-center">
          <p className="text-sm text-white/80">Advertisement</p>
          <div className="h-16 md:h-24 bg-gray-200/20 flex items-center justify-center">
            {/* AdSense code will go here */}
            <p className="text-white/50">Ad Space</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {/* Game Card - Spin the Bottle */}
          <Link href="/games/spin-the-bottle" className="group">
            <div className="bg-blue-600 hover:bg-blue-500 transition-all duration-300 p-6 rounded-xl shadow-lg hover:shadow-xl flex flex-col items-center text-center h-full">
              <div className="w-24 h-24 mb-4 bg-blue-400 rounded-full flex items-center justify-center">
                <span className="text-3xl">🔄</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Spin the Bottle</h2>
              <p className="text-blue-100">Random questions with a twist!</p>
            </div>
          </Link>

          {/* Game Card - Truth or Dare */}
          <Link href="/games/truth-or-dare" className="group">
            <div className="bg-purple-600 hover:bg-purple-500 transition-all duration-300 p-6 rounded-xl shadow-lg hover:shadow-xl flex flex-col items-center text-center h-full">
              <div className="w-24 h-24 mb-4 bg-purple-400 rounded-full flex items-center justify-center">
                <span className="text-3xl">❓</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Truth or Dare</h2>
              <p className="text-purple-100">Classic party game with a digital twist!</p>
            </div>
          </Link>

          {/* Game Card - Party Challenges */}
          <Link href="/games/party-challenge" className="group">
            <div className="bg-green-600 hover:bg-green-500 transition-all duration-300 p-6 rounded-xl shadow-lg hover:shadow-xl flex flex-col items-center text-center h-full">
              <div className="w-24 h-24 mb-4 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎮</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Party Challenges</h2>
              <p className="text-green-100">Fun challenges for groups!</p>
            </div>
          </Link>
        </div>

        {/* Ad placement - bottom of content */}
        <div className="w-full max-w-4xl mt-12 p-4 bg-white/10 backdrop-blur-sm rounded-lg text-center">
          <p className="text-sm text-white/80">Advertisement</p>
          <div className="h-16 md:h-24 bg-gray-200/20 flex items-center justify-center">
            {/* AdSense code will go here */}
            <p className="text-white/50">Ad Space</p>
          </div>
        </div>
      </main>

      {/* Footer placeholder - will be replaced with component */}
      <footer className="w-full p-4 bg-blue-900 text-white text-center">
        <p className="text-sm">© {new Date().getFullYear()} SpinTheQ. All rights reserved.</p>
      </footer>
    </div>
  );
}