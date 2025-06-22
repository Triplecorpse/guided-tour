"use client";

import { EmotionProvider } from "@/providers";

export default function PersonalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <EmotionProvider>{children}</EmotionProvider>;
}
