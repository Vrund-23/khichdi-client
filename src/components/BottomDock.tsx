import { Home, Search, Heart, MapPin } from "lucide-react";

type Tab = "home" | "search" | "favorites" | "map";

interface BottomDockProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; icon: typeof Home; label: string }[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "search", icon: Search, label: "Search" },
  { id: "favorites", icon: Heart, label: "Favorites" },
  { id: "map", icon: MapPin, label: "Map" },
];

const BottomDock = ({ activeTab, onTabChange }: BottomDockProps) => {
  return (
    <nav
      className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[88%] max-w-sm shadow-2xl rounded-full px-6 py-3.5 flex justify-between items-center z-40 md:hidden animate-slide-up"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(22,163,74,0.15)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(22,163,74,0.08)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-0.5 btn-squishy transition-colors duration-200"
            style={{ color: isActive ? "#16a34a" : "#a8a29e" }}
            aria-label={tab.label}
          >
            <tab.icon className={`size-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
            <span className={`text-[10px] ${isActive ? "font-bold" : "font-semibold"}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomDock;
