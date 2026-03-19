import { useState, useEffect, useMemo, useRef } from "react";
import MenuCard from "./MenuCard";
import useSWR from 'swr';
import { fetchAllHotelsWithTodayMenu } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import PullToRefresh from "react-simple-pull-to-refresh";

// Fallback static assets (used when backend is unreachable)
import menu1 from "@/assets/menu-1.jpg";
import menu2 from "@/assets/menu-2.jpg";
import menu3 from "@/assets/menu-3.jpg";
import menu4 from "@/assets/menu-4.jpg";
import menu5 from "@/assets/menu-5.jpg";
import menu6 from "@/assets/menu-6.jpg";

// Static fallback data when backend is completely unreachable
const fallbackData: DisplayMenu[] = [
  { id: "f1", image: menu1, messName: "Somnath", price: 70, showPrice: true, isOpen: true, distance: "0.3 km", menuPostedToday: true },
  { id: "f2", image: menu2, messName: "Mahadev", price: 85, showPrice: true, isOpen: true, distance: "0.5 km", menuPostedToday: true },
  { id: "f3", image: menu3, messName: "Gayatri", price: 60, showPrice: true, isOpen: false, distance: "0.8 km", menuPostedToday: true },
  { id: "f4", image: menu4, messName: "Nutan-Club", price: 90, showPrice: true, isOpen: true, distance: "1.2 km", menuPostedToday: true },
  { id: "f5", image: menu5, messName: "Gujrat-Club", price: 55, showPrice: true, isOpen: true, distance: "0.1 km", menuPostedToday: true },
  { id: "f6", image: menu6, messName: "A.M.Naik", price: 75, showPrice: true, isOpen: true, distance: "0.6 km", menuPostedToday: true },
];

interface BackendHotel {
  _id: string;
  hotelName?: string;
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  showPrice?: boolean;
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
  showPrice: boolean;
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
  menuPostedToday: boolean;
  hotelType?: string;
}

const isFavourite = (hotelId?: string) =>
  hotelId ? localStorage.getItem(`liked_${hotelId}`) === 'true' : false;

const MasonryGrid = ({ searchQuery }: { searchQuery: string }) => {
  const [selectedType, setSelectedType] = useState<"dynamic" | "fixed" | "fastfood">("dynamic");
  const [likeVersion, setLikeVersion] = useState(0);

  const fetcher = async () => {
    const hotels = await fetchAllHotelsWithTodayMenu();
    if (hotels && hotels.length > 0) {
      return (hotels as BackendHotel[]).map((h) => {
        const hotelName = h.hotelName || h.name || "Unknown Mess";
        const hType = h.hotelType || "dynamic";
        const isFixed = hType === "fixed" || hType === "fastfood";
        const hasMenu = h.todayMenu !== null && h.todayMenu !== undefined;
        const isMenuAvailable = isFixed || hasMenu;
        return {
          id: h._id,
          image: hasMenu ? h.todayMenu!.imageUrl : (isFixed ? (h.imageUrl || "") : ""),
          messName: hotelName,
          price: h.price || 0,
          showPrice: h.showPrice !== false,
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
      return [];
    } else {
      throw new Error("Network Error");
    }
  };

  const { data: swrMenus, isLoading: loading, mutate } = useSWR('masonryGridHotels', fetcher, {
    revalidateOnFocus: true,
    errorRetryCount: 3,
    errorRetryInterval: 3000,
    dedupingInterval: 5000,
  });

  const menus = useMemo(() => {
    if (swrMenus) return swrMenus;
    if (!loading && !swrMenus) return fallbackData;
    return [];
  }, [swrMenus, loading]);

  const usingBackend = !!swrMenus || (menus.length === 0 && !loading && swrMenus !== undefined);

  useEffect(() => {
    const handleRefresh = () => mutate();
    window.addEventListener("refreshMenus", handleRefresh);
    const handleStorageChange = () => setLikeVersion((v) => v + 1);
    window.addEventListener("storage", handleStorageChange);
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
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      if (a.menuPostedToday && !b.menuPostedToday) return -1;
      if (!a.menuPostedToday && b.menuPostedToday) return 1;
      if (a.menuPostedToday && b.menuPostedToday && a.uploadedAt && b.uploadedAt) {
        return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      }
      return 0;
    });

    return { filtered: f, sorted: s };
  }, [menus, searchQuery, selectedType, likeVersion]);

  const uploadedCount = filtered.filter((m) => m.menuPostedToday).length;

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

  useEffect(() => {
    setRenderLimit(12);
  }, [searchQuery]);

  const handleRefresh = async () => {
    await mutate();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} refreshingContent={<div className="flex justify-center p-4">Refreshing...</div>}>
      <div
        className="w-full max-w-6xl mx-auto px-4 py-6 pb-8"
        style={{ background: "linear-gradient(to bottom, #f0fdf4, #fafaf8)" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-5 border-b border-green-50 pb-5">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-green-900 flex items-center gap-3">
              {selectedType === "dynamic" ? "🍽️ Today's Menus" : selectedType === "fixed" ? "🌅 Breakfast & Snacks" : "🍔 Fast Food"}
              {usingBackend && (
                <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700 uppercase tracking-widest border border-green-200 self-center ml-1">
                  Live
                </span>
              )}
            </h2>
            <p className="text-sm font-medium text-green-700/70 flex items-center gap-2 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Showing {filtered.length} places
              {usingBackend && filtered.length > 0 && uploadedCount < filtered.length && (
                <> • <span className="text-green-600 font-bold">{uploadedCount} menus posted today</span></>
              )}
            </p>
          </div>

          <div className="w-full md:w-auto bg-green-50/50 backdrop-blur shadow-sm p-1.5 rounded-[20px] border border-green-100 flex items-center gap-1 font-sans overflow-x-auto">
            <button
              onClick={() => setSelectedType("dynamic")}
              className={`shrink-0 md:flex-none px-4 sm:px-5 py-2.5 text-[12px] sm:text-sm font-black rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap ${
                selectedType === "dynamic"
                  ? "bg-green-900 text-white shadow-lg shadow-green-900/20 scale-[1.02] transform"
                  : "text-green-700/70 hover:bg-green-100/50 hover:text-green-800 active:scale-95"
              }`}
            >
              Daily Specials
            </button>
            <button
              onClick={() => setSelectedType("fixed")}
              className={`shrink-0 md:flex-none px-4 sm:px-5 py-2.5 text-[12px] sm:text-sm font-black rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap ${
                selectedType === "fixed"
                  ? "bg-green-900 text-white shadow-lg shadow-green-900/20 scale-[1.02] transform"
                  : "text-green-700/70 hover:bg-green-100/50 hover:text-green-800 active:scale-95"
              }`}
            >
              Breakfast & Snacks
            </button>
            <button
              onClick={() => setSelectedType("fastfood")}
              className={`shrink-0 md:flex-none px-4 sm:px-5 py-2.5 text-[12px] sm:text-sm font-black rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap ${
                selectedType === "fastfood"
                  ? "bg-green-900 text-white shadow-lg shadow-green-900/20 scale-[1.02] transform"
                  : "text-green-700/70 hover:bg-green-100/50 hover:text-green-800 active:scale-95"
              }`}
            >
              Fast Food
            </button>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl border border-green-100 overflow-hidden bg-white h-[340px] flex flex-col">
                <Skeleton className="h-[240px] w-full rounded-none" />
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex justify-between mt-auto">
                    <Skeleton className="h-4 w-1/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && sorted.length > 0 && (
          <>
            <div data-nosnippet className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.slice(0, renderLimit).map((item, i) => (
                <div key={item.id}>
                  <MenuCard {...item} index={i} />
                </div>
              ))}
            </div>
            {renderLimit < sorted.length && (
              <div ref={loadMoreRef} className="h-10 w-full mt-8" />
            )}
          </>
        )}

        {!loading && sorted.length === 0 && menus.length > 0 && (
          <div className="text-center py-20">
            <p className="text-2xl font-bold" style={{ color: "#78716c" }}>No mess found 🍽️</p>
            <p className="mt-2 font-medium" style={{ color: "#a8a29e" }}>Try a different search</p>
          </div>
        )}

        {!loading && menus.length === 0 && (
          <div className="text-center py-20">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏠</div>
            <p className="text-xl font-bold" style={{ color: "#78716c" }}>No mess registered yet</p>
            <p className="mt-2 font-medium" style={{ color: "#a8a29e" }}>Check back soon!</p>
          </div>
        )}
      </div>
    </PullToRefresh>
  );
};

export default MasonryGrid;
