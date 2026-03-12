import { useState } from "react";
import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/HeroSection";
import MasonryGrid from "@/components/MasonryGrid";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Helmet>
        <title>Khichdi - Your Daily Menu Guide in Vidyanagar</title>
        <meta name="description" content="Discover today's menus for tiffin services, hostels, and restaurants in Vallabh Vidyanagar. Find out what's currently being served and make your dining decisions easy." />
        <meta name="keywords" content="khichdi, vidyanagar food, vallabh vidyanagar tiffin, anand hostel menu, vvnagar restaurant menu" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.khichdi.co.in/" />
        <meta property="og:title" content="Khichdi - Your Daily Menu Guide in Vidyanagar" />
        <meta property="og:description" content="Discover today's menus for tiffin services, hostels, and restaurants in Vallabh Vidyanagar." />
        <meta property="og:image" content="https://www.khichdi.co.in/Gemini_Generated_Image_su8l5hsu8l5hsu8l.png" />
        <meta property="og:site_name" content="Khichdi" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.khichdi.co.in/" />
        <meta name="twitter:title" content="Khichdi - Your Daily Menu Guide in Vidyanagar" />
        <meta name="twitter:description" content="Discover today's menus for tiffin services, hostels, and restaurants in Vallabh Vidyanagar." />
        <meta name="twitter:image" content="https://www.khichdi.co.in/Gemini_Generated_Image_su8l5hsu8l5hsu8l.png" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Khichdi",
              "url": "https://www.khichdi.co.in/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.khichdi.co.in/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          `}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <HeroSection onSearch={setSearchQuery} />
        <div className="flex-1 w-full">
          <MasonryGrid searchQuery={searchQuery} />
        </div>

      <Footer />
    </div>
    </>
  );
};

export default Index;
