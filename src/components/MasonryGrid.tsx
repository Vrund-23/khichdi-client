import { useState, useEffect, useMemo, useRef } from "react";
import MenuCard from "./MenuCard";
import useSWR, { useSWRConfig } from 'swr';
import { fetchAllHotelsWithTodayMenu } from "@/lib/api";

// Fallback static assets (used when backend is unreachable)
import menu1 from "@/assets/menu-1.jpg";
import menu2 from "@/assets/menu-2.jpg";
import menu3 from "@/assets/menu-3.jpg";
import menu4 from "@/assets/menu-4.jpg";
import menu5 from "@/assets/menu-5.jpg";
import menu6 from "@/assets/menu-6.jpg";

// Static fallback data when backend is completely unreachable
const fallbackData: DisplayMenu[] = [
  { id: "f1", image: menu1, messName: "Somnath", price: 70, isOpen: true, distance: "0.3 km", menuPostedToday: true },
  { id: "f2", image: menu2, messName: "Mahadev", price: 85, isOpen: true, distance: "0.5 km", menuPostedToday: true },
  { id: "f3", image: menu3, messName: "Gayatri", price: 60, isOpen: false, distance: "0.8 km", menuPostedToday: true },
  { id: "f4", image: menu4, messName: "Nutan-Club", price: 90, isOpen: true, distance: "1.2 km", menuPostedToday: true },
  { id: "f5", image: menu5, messName: "Gujrat-Club", price: 55, isOpen: true, distance: "0.1 km", menuPostedToday: true },
  { id: "f6", image: menu6, messName: "A.M.Naik", price: 75, isOpen: true, distance: "0.6 km", menuPostedToday: true },
];

interface BackendHotel {
  _id: string;
  hotelName?: string;
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  imageUrl?: string;
  photos?: string[];
  hotelType?: string;
  todayMenu: {
    _id: string;
    imageUrl: string;
    date: string;
    note?: string;
  } | null;
}

interface DisplayMenu {
  id: string;
  image: string;
  messName: string;
  price: number;
  isOpen: boolean;
  distance: string;
  uploadedAt?: string;
  note?: string;
  hotelId?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  hotelImage?: string;
  hotelPhotos?: string[];
  menuPostedToday: boolean; // false → show "not uploaded yet" placeholder
  hotelType?: string;
}



// Helper — is this hotel marked as favourite in localStorage?
const isFavourite = (hotelId?: string) =>
  hotelId ? localStorage.getItem(`liked_${hotelId}`) === 'true' : false;

const MasonryGrid = ({ searchQuery }: { searchQuery: string }) => {
  const [selectedType, setSelectedType] = useState<"dynamic" | "fixed">("dynamic");
  // Bump this counter whenever a like changes so the sort re-runs
  const [likeVersion, setLikeVersion] = useState(0);

  const fetcher = async () => {
    const hotels = await fetchAllHotelsWithTodayMenu();
    if (hotels && hotels.length > 0) {
      return (hotels as BackendHotel[]).map((h) => {
        const hotelName = h.hotelName || h.name || "Unknown Mess";
        const hType = h.hotelType || "dynamic";
        const isFixed = hType === "fixed";
        const hasMenu = h.todayMenu !== null && h.todayMenu !== undefined;
        // For fixed menu, the hotel image itself acts as the fixed menu and is always "posted"
        const isMenuAvailable = isFixed || hasMenu;
        return {
          id: h._id,
          image: hasMenu ? h.todayMenu!.imageUrl : (isFixed ? (h.imageUrl || "") : ""),
          messName: hotelName,
          price: h.price || 0,
          isOpen: true,
          distance: "",
          uploadedAt: hasMenu && !isFixed ? h.todayMenu!.date : undefined,
          note: hasMenu && !isFixed ? (h.todayMenu!.note || "") : "",
          hotelId: h._id,
          address: h.address || "",
          latitude: h.latitude,
          longitude: h.longitude,
          hotelImage: h.imageUrl || "",
          hotelPhotos: h.photos || [],
          menuPostedToday: isMenuAvailable,
          hotelType: hType,
        };
      });
    } else if (hotels !== null) {
      return []; // Backend reachable but empty
    } else {
      throw new Error("Network Error");
    }
  };

  const { data: swrMenus, isLoading: loading } = useSWR('masonryGridHotels', fetcher, {
    revalidateOnFocus: true,     // Issue #12: Refetch when switching back to tab
    errorRetryCount: 3,          // Try 3 times on network failure
    errorRetryInterval: 3000,
    dedupingInterval: 5000,      // Prevent identical duplicate requests inside 5s 
  });

  const menus = useMemo(() => {
    if (swrMenus) return swrMenus;
    if (!loading && !swrMenus) return fallbackData;
    return [];
  }, [swrMenus, loading]);

  const usingBackend = !!swrMenus || (menus.length === 0 && !loading && swrMenus !== undefined);


  const { mutate } = useSWRConfig();

  useEffect(() => {
    const handleRefresh = () => mutate('masonryGridHotels');
    window.addEventListener("refreshMenus", handleRefresh);

    // Re-sort whenever the user taps the heart icon on any card
    const handleStorageChange = () => setLikeVersion((v) => v + 1);
    window.addEventListener("storage", handleStorageChange);
    // Also listen to a custom event fired by MenuCard after toggling like
    window.addEventListener("likeChanged", handleStorageChange);

    return () => {
      window.removeEventListener("refreshMenus", handleRefresh);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("likeChanged", handleStorageChange);
    };
  }, [mutate]);

  const { filtered, sorted } = useMemo(() => {
    const f: DisplayMenu[] = (menus as DisplayMenu[]).filter((m) =>
      m.messName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (m.hotelType || "dynamic") === selectedType
    );

    const s = [...f].sort((a, b) => {
      const aFav = isFavourite(a.hotelId);
      const bFav = isFavourite(b.hotelId);

      // Tier 1 — favourites always come first
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;

      // Both are favourites (or both are non-favourites): apply sub-sort
      // Sub-sort: posted menu → no menu
      if (a.menuPostedToday && !b.menuPostedToday) return -1;
      if (!a.menuPostedToday && b.menuPostedToday) return 1;

      // Both posted menu today → earliest post first
      if (a.menuPostedToday && b.menuPostedToday && a.uploadedAt && b.uploadedAt) {
        return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      }

      return 0;
    });

    return { filtered: f, sorted: s };
  }, [menus, searchQuery, selectedType, likeVersion]);

  // Count how many have today's menu uploaded (for the header counter)
  const uploadedCount = filtered.filter((m) => m.menuPostedToday).length;

  // Suppress the linter warning — likeVersion IS used as a sort trigger
  void likeVersion;

  const [renderLimit, setRenderLimit] = useState(12);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRenderLimit((prev) => prev + 12);
      }
    }, { rootMargin: '400px' });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [sorted]);

  // Reset rendering limit if search query drastically changes
  useEffect(() => {
    setRenderLimit(12);
  }, [searchQuery]);

  return (
    <div
      className="w-full max-w-6xl mx-auto px-4 py-6 pb-28 md:pb-8"
      style={{ background: "linear-gradient(to bottom, #f0fdf4, #fafaf8)" }}
    >
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
        <h2 className="text-xl font-bold flex items-center gap-4" style={{ color: "#166534" }}>
          <span>🍽️ {selectedType === "fixed" ? "Fixed Menus" : "Today's Menus"}</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as "dynamic" | "fixed")}
            className="text-sm border border-green-200 bg-white text-green-800 rounded-md px-2 py-1 outline-none cursor-pointer hidden md:block"
          >
            <option value="dynamic">Daily Changing Menus</option>
            <option value="fixed">Fixed Menus</option>
          </select>
        </h2>
        {/* Mobile Dropdown */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as "dynamic" | "fixed")}
          className="text-sm border border-green-200 bg-white text-green-800 rounded-md px-3 py-2 outline-none cursor-pointer md:hidden w-full"
        >
          <option value="dynamic">Daily Changing Menus</option>
          <option value="fixed">Fixed Menus</option>
        </select>
        <div className="flex items-center gap-2">
          {usingBackend && (
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}
            >
              🟢 Live
            </span>
          )}
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a" }}
          >
            {filtered.length} places
            {usingBackend && filtered.length > 0 && uploadedCount < filtered.length
              ? ` • ${uploadedCount} menu${uploadedCount !== 1 ? "s" : ""} posted`
              : ""}
          </span>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-20">
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid rgba(22,163,74,0.15)",
              borderTop: "3px solid #16a34a",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      )}

      {/* Grid: always shows all hotels — placeholder card for those without today's menu */}
      {!loading && sorted.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.slice(0, renderLimit).map((item, i) => (
              <div key={item.id}>
                <MenuCard {...item} index={i} />
              </div>
            ))}
          </div>

          {/* Intersection Observer target for lazy progressive loading */}
          {renderLimit < sorted.length && (
            <div ref={loadMoreRef} className="h-10 w-full mt-8" />
          )}
        </>
      )}

      {/* No hotels at all / search returned nothing */}
      {!loading && sorted.length === 0 && menus.length > 0 && (
        <div className="text-center py-20">
          <p className="text-2xl font-bold" style={{ color: "#78716c" }}>No mess found 🍽️</p>
          <p className="mt-2 font-medium" style={{ color: "#a8a29e" }}>Try a different search</p>
        </div>
      )}

      {/* No hotels registered yet */}
      {!loading && menus.length === 0 && (
        <div className="text-center py-20">
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏠</div>
          <p className="text-xl font-bold" style={{ color: "#78716c" }}>No mess registered yet</p>
          <p className="mt-2 font-medium" style={{ color: "#a8a29e" }}>Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default MasonryGrid;
