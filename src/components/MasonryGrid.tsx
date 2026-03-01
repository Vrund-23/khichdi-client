import { useState, useEffect } from "react";
import MenuCard from "./MenuCard";
import { fetchLatestMenus } from "@/lib/api";

// Fallback static assets
import menu1 from "@/assets/menu-1.jpg";
import menu2 from "@/assets/menu-2.jpg";
import menu3 from "@/assets/menu-3.jpg";
import menu4 from "@/assets/menu-4.jpg";
import menu5 from "@/assets/menu-5.jpg";
import menu6 from "@/assets/menu-6.jpg";

// Static fallback data when backend has no data
const fallbackData = [
  { id: "f1", image: menu1, messName: "Somnath", price: 70, isOpen: true, distance: "0.3 km" },
  { id: "f2", image: menu2, messName: "Mahadev", price: 85, isOpen: true, distance: "0.5 km" },
  { id: "f3", image: menu3, messName: "Gayatri", price: 60, isOpen: false, distance: "0.8 km" },
  { id: "f4", image: menu4, messName: "Nutan-Club", price: 90, isOpen: true, distance: "1.2 km" },
  { id: "f5", image: menu5, messName: "Gujrat-Club", price: 55, isOpen: true, distance: "0.1 km" },
  { id: "f6", image: menu6, messName: "A.M.Naik", price: 75, isOpen: true, distance: "0.6 km" },
];

interface BackendMenu {
  _id: string;
  imageUrl: string;
  date: string;
  note?: string;
  hotel?: {
    _id?: string;
    id?: string;
    hotelName?: string;
    name?: string;
    address?: string;
    price?: number;
  };
  hotelId?: {
    _id?: string;
    id?: string;
    hotelName?: string;
    name?: string;
    address?: string;
    price?: number;
  };
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
}

const MasonryGrid = ({ searchQuery }: { searchQuery: string }) => {
  const [menus, setMenus] = useState<DisplayMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingBackend, setUsingBackend] = useState(false);

  useEffect(() => {
    const loadMenus = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const backendMenus = await fetchLatestMenus();
        if (backendMenus && backendMenus.length > 0) {
          const mapped: DisplayMenu[] = backendMenus.map((m: BackendMenu) => {
            const hotel = m.hotel || m.hotelId;
            const hotelName = hotel?.hotelName || hotel?.name || "Unknown Mess";
            return {
              id: m._id,
              image: m.imageUrl,
              messName: hotelName,
              price: hotel?.price || 0,
              isOpen: true,
              distance: "",
              uploadedAt: m.date,
              note: m.note || '',
              hotelId: hotel?._id || hotel?.id || '',
              address: hotel?.address || '',
            };
          });
          setMenus(mapped);
          setUsingBackend(true);
        } else {
          setMenus(fallbackData);
          setUsingBackend(false);
        }
      } catch {
        setMenus(fallbackData);
        setUsingBackend(false);
      } finally {
        setLoading(false);
      }
    };

    loadMenus();

    const handleRefresh = () => {
      loadMenus(true); // reload silently
    };

    window.addEventListener('refreshMenus', handleRefresh);
    return () => window.removeEventListener('refreshMenus', handleRefresh);
  }, []);

  const filtered = menus.filter((m) =>
    m.messName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="w-full max-w-6xl mx-auto px-4 py-6 pb-28 md:pb-8"
      style={{ background: "linear-gradient(to bottom, #f0fdf4, #fafaf8)" }}
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold" style={{ color: "#166534" }}>
          🍽️ Today's Menus
        </h2>
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
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Staggered masonry: 1 col mobile, 2 col sm, 3 col lg */}
      {!loading && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-5 space-y-4 md:space-y-5">
          {filtered.map((item, i) => (
            <div key={item.id} className="break-inside-avoid">
              <MenuCard {...item} index={i} />
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl font-bold" style={{ color: "#78716c" }}>No mess found 🍽️</p>
          <p className="mt-2 font-medium" style={{ color: "#a8a29e" }}>Try a different search</p>
        </div>
      )}
    </div>
  );
};

export default MasonryGrid;
