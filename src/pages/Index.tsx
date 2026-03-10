import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import MasonryGrid from "@/components/MasonryGrid";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeroSection onSearch={setSearchQuery} />
      <div className="flex-1 w-full">
        <MasonryGrid searchQuery={searchQuery} />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
