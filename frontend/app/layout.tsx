import { languages } from "@/i18n/settings";
import { getT } from "@/i18n";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { EmotionProvider } from "@/providets";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export async function generateMetadata() {
  const { t } = await getT("second-page");
  return {
    title: t("title"),
  };
}

export default async function Layout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <EmotionProvider>{children}</EmotionProvider>
      </body>
    </html>
  );
}
