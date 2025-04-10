import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spin the Bottle - SpinTheQ",
  description: "Play the classic Spin the Bottle game with a digital twist! Add players, choose categories, and have fun.",
  openGraph: {
    title: "Spin the Bottle | SpinTheQ",
    description: "Play Spin the Bottle online with friends - perfect for parties!",
    type: "website",
    url: "https://spintheq.com/games/spin-the-bottle",
    images: [
      {
        url: "https://spintheq.com/images/spin-bottle-preview.jpg", 
        width: 1200,
        height: 630,
        alt: "Spin the Bottle game preview"
      }
    ]
  }
};

export default function SpinTheBottleLayout({
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