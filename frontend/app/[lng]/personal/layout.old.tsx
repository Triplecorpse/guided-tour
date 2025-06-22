"use client";

import { EmotionProvider } from "@/providets";

export default function PersonalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <EmotionProvider>{children}</EmotionProvider>;
}
