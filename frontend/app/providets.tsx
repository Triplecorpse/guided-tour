"use client";

import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "./createEmotionCache"; // You create this
import { PropsWithChildren } from "react";

const clientSideEmotionCache: EmotionCache = createEmotionCache();

export function EmotionProvider({ children }: PropsWithChildren) {
  return (
    <CacheProvider value={clientSideEmotionCache}>{children}</CacheProvider>
  );
}
