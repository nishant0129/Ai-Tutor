import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../components/AuthContext";
import UserMenu from "../components/UserMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Tutor | Interview & English Coach",
  description:
    "Practice English and interview answers with an AI-powered coach built in Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <AuthProvider>
          <header className="border-b border-slate-200 bg-white/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
              <a href="/" className="text-lg font-bold">
                AI Tutor
              </a>
              <div>
                <UserMenu />
              </div>
            </div>
          </header>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
