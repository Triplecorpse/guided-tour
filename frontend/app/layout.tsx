import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { EmotionProvider } from "@/providers";
import StoreProvider from "@/StoreProvider";
import AuthInitializer from "@/[lng]/components/AuthInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>
          <EmotionProvider>
            <StoreProvider>
              <AuthInitializer></AuthInitializer>
              {children}
            </StoreProvider>
          </EmotionProvider>
        </main>
      </body>
    </html>
  );
}
