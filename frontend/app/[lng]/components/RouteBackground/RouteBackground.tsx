"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const routeBackgrounds: Record<string, string> = {
  authentication: "/images/pexels-frederic-hancke-113473984-27316080.jpg",
  default: "/images/pexels-pixabay-267104.jpg",
};

function getBackgroundUrl(route: string): string {
  const arr = route.split("/").filter(Boolean);
  return routeBackgrounds[arr[1]] ?? routeBackgrounds.default;
}

export default function RouteBackground({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // You can do smarter matching (e.g. with regex)
  const background = getBackgroundUrl(pathname);

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}
