"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const routeBackgrounds: Record<string, string | null> = {
  authentication: "/images/pexels-frederic-hancke-113473984-27316080.jpg",
  default: "/images/pexels-pixabay-267104.jpg",
  personal: null,
};

function getBackgroundUrl(route: string): string | null {
  const arr = route.split("/").filter(Boolean);
  const bg = routeBackgrounds[arr[1]];
  if (bg === null) {
    return null;
  }
  return bg ?? routeBackgrounds.default;
}

export default function RouteBackground({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // You can do smarter matching (e.g. with regex)
  const background: string | null = getBackgroundUrl(pathname);
  let styleObject: {
    minHeight: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
  } = { minHeight: "100vh" };

  if (background) {
    styleObject = {
      ...styleObject,
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  return <div style={styleObject}>{children}</div>;
}
