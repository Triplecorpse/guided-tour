import { getT } from "@/i18n";
import { Header } from "./components/Header/Header";
import RouteBackground from "./components/RouteBackground/RouteBackground";

export default async function Layout({ children, params }: { children: React.ReactNode; params: { lng: string } }) {
  return (
    <RouteBackground>
      <Header />
      {children}
    </RouteBackground>
  );
} 