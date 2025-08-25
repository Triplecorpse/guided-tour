import { Header } from "./components/Header/Header";
import RouteBackground from "./components/RouteBackground/RouteBackground";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RouteBackground>
      <Header />
      {children}
    </RouteBackground>
  );
}
