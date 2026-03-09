import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import MasonryGrid from "@/components/MasonryGrid";
import BottomDock from "@/components/BottomDock";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"home" | "search" | "favorites" | "map">("home");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeroSection onSearch={setSearchQuery} />
      <div className="flex-1 w-full">
        <MasonryGrid searchQuery={searchQuery} />
      </div>
      <Footer />
      <BottomDock activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
