import Link from "next/link";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AdBanner from "../components/ui/AdBanner";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-500 to-blue-700 text-white">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">
          SpinTheQ
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-center max-w-2xl">
          Ultimate Party Games Platform
        </p>

        {/* Ad placement - top of content */}
        <AdBanner position="top" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mt-8">
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
        <AdBanner position="bottom" className="mt-12" />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}