import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { AdminProvider } from '@/contexts/AdminContext';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buddhadeb Koner | FullStack Web Developer",
  description:
    "I am Buddhadeb Koner, a FullStack Web Developer specializing in the MERN stack and Next.js. I create and share great software, contribute to open-source, and build innovative web applications.",
  keywords: [
    "Buddhadeb Koner",
    "FullStack Developer",
    "MERN Stack",
    "Next.js",
    "Portfolio",
    "Web Developer",
    "Open Source",
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "Express.js",
    "Frontend",
    "Backend",
    "Software Engineer",
    "India",
    "Bardhaman"
  ],
  authors: [{ name: "Buddhadeb Koner", url: "https://buddhadebkoner.vercel.app/" }],
  creator: "Buddhadeb Koner",
  openGraph: {
    title: "Buddhadeb Koner | FullStack Web Developer",
    description:
      "FullStack Web Developer specializing in MERN stack and Next.js. Explore my projects, blogs, and professional journey.",
    url: "https://buddhadebkoner.vercel.app/",
    siteName: "Buddhadeb Koner Portfolio",
    images: [
      {
        url: "https://buddhadebkoner.vercel.app/avatar.png",
        width: 800,
        height: 800,
        alt: "Buddhadeb Koner Avatar"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Buddhadeb Koner | FullStack Web Developer",
    description:
      "FullStack Web Developer specializing in MERN stack and Next.js. Explore my projects, blogs, and professional journey.",
    creator: "@buddhadeb_koner",
    images: [
      "https://buddhadebkoner.vercel.app/avatar.png"
    ]
  },
  metadataBase: new URL("https://buddhadebkoner.vercel.app/"),
  alternates: {
    canonical: "https://buddhadebkoner.vercel.app/"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <AdminProvider>
        <html lang="en">
          <head>
            <link rel="canonical" href="https://buddhadebkoner.vercel.app/" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="manifest" href="/manifest.json" />
            <meta name="robots" content="index, follow" />
          </head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
          </body>
        </html>
      </AdminProvider>
    </ClerkProvider>
  );
}
