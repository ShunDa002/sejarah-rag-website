import type { Metadata } from "next";
import { Inter, Roboto, Roboto_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ChatProvider } from "@/context/ChatContext";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Sejarah RAG Chat",
  description: "Explore Malaysian history through AI-powered conversation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${roboto.variable} ${robotoMono.variable}`}
      >
        <SessionProvider>
          <ThemeProvider>
            <ChatProvider>
              <div className="flex h-screen overflow-hidden bg-background text-foreground">
                <Sidebar />
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <Header />
                  <main className="flex-1 overflow-hidden relative">
                    {children}
                  </main>
                </div>
              </div>
            </ChatProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
