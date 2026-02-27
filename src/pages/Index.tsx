import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import MasonryGrid from "@/components/MasonryGrid";
import BottomDock from "@/components/BottomDock";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"home" | "search" | "favorites" | "map">("home");

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onSearch={setSearchQuery} />
      <MasonryGrid searchQuery={searchQuery} />
      <BottomDock activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
