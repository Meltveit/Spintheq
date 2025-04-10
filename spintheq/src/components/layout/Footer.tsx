import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-blue-900 text-white shadow-inner">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and tagline */}
          <div>
            <Link href="/" className="text-xl font-bold">
              SpinTheQ
            </Link>
            <p className="mt-2 text-sm text-blue-200">
              Ultimate Party Games Platform
            </p>
          </div>
          
          {/* Games */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Our Games
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/games/spin-the-bottle" className="text-blue-200 hover:text-white transition-colors">
                  Spin the Bottle
                </Link>
              </li>
              <li>
                <Link href="/games/truth-or-dare" className="text-blue-200 hover:text-white transition-colors">
                  Truth or Dare
                </Link>
              </li>
              <li>
                <Link href="/games/party-challenge" className="text-blue-200 hover:text-white transition-colors">
                  Party Challenges
                </Link>
              </li>
              <li>
                <Link href="/more-games" className="text-blue-200 hover:text-white transition-colors">
                  More Games
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-blue-200 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-blue-200 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-blue-200 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-blue-800 text-center">
          <p className="text-sm">
            © {currentYear} SpinTheQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}