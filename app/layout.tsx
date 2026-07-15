import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { initDatabase } from "@/db/init";

// Initialize database on app start
initDatabase().catch(console.error);

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Future Bright Ventures Ltd | Business Excellence, Sustainability, Strategy & Service",
  description:
    "Future Bright Ventures Ltd — Where Business Excellence meets Sustainability, Strategy & Service. A dynamic East African conglomerate with subsidiaries in consultancy, training, eco-farming, travel, real estate, hospitality, and CSR.",
  keywords: [
    "Future Bright Ventures",
    "Bright Elite",
    "Nairobi",
    "Kenya",
    "East Africa",
    "consultancy",
    "training",
    "eco-farming",
    "real estate",
    "tours",
    "travel",
    "corporate",
    "sustainability",
  ],
  authors: [{ name: "Future Bright Ventures Ltd" }],
  openGraph: {
    title: "Future Bright Ventures Ltd",
    description: "Where Business Excellence meets Sustainability, Strategy & Service",
    type: "website",
    locale: "en_KE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
