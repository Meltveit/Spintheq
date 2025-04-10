import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpinTheQ - Games",
  description: "Play interactive party games - Spin the Bottle, Truth or Dare, and more",
};

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-600 to-blue-800 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Page content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}