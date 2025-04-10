// src/app/games/truth-or-dare/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Truth or Dare - SpinTheQ",
  description: "Play the classic Truth or Dare game with a digital twist! Track points, manage passes, and distribute drinking penalties.",
  openGraph: {
    title: "Truth or Dare | SpinTheQ",
    description: "Play Truth or Dare online with friends - perfect for parties!",
    type: "website",
    url: "https://spintheq.com/games/truth-or-dare",
    images: [
      {
        url: "https://spintheq.com/images/truth-dare-preview.jpg", 
        width: 1200,
        height: 630,
        alt: "Truth or Dare game preview"
      }
    ]
  }
};

export default function TruthOrDareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}