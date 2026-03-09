import { useState, useEffect } from "react";
import MenuCard from "./MenuCard";
import { fetchAllHotelsWithTodayMenu } from "@/lib/api";

// Fallback static assets (used when backend is unreachable)
import menu1 from "@/assets/menu-1.jpg";
import menu2 from "@/assets/menu-2.jpg";
import menu3 from "@/assets/menu-3.jpg";
import menu4 from "@/assets/menu-4.jpg";
import menu5 from "@/assets/menu-5.jpg";
import menu6 from "@/assets/menu-6.jpg";

// Static fallback data when backend is completely unreachable
const fallbackData = [
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
  price?: number;
  imageUrl?: string;
  photos?: string[];
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
  hotelImage?: string;
  hotelPhotos?: string[];
  menuPostedToday: boolean; // false → show "not uploaded yet" placeholder
}

// Placeholder card shown when a hotel hasn't uploaded today's menu yet
const NoMenuPlaceholder = ({ messName, price }: { messName: string; price: number }) => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
      @keyframes placeholder-fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nmp-card {
        font-family: 'DM Sans', sans-serif;
        border-radius: 24px;
        overflow: hidden;
        background: rgba(255,255,255,0.85);
        border: 1.5px dashed rgba(156,163,175,0.5);
        box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        display: flex;
        flex-direction: column;
        height: 100%;
        animation: placeholder-fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards;
      }
      .nmp-image-area {
        width: 100%;
        height: 240px;
        background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        flex-shrink: 0;
      }
      .nmp-icon {
        font-size: 2.4rem;
        opacity: 0.45;
      }
      .nmp-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: #9ca3af;
        letter-spacing: 0.01em;
      }
      .nmp-footer {
        padding: 12px 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(to bottom, rgba(249,250,251,0.7), #fff);
        flex-grow: 1;
      }
      .nmp-name {
        font-family: 'Playfair Display', serif;
        font-weight: 700;
        font-size: 1.2rem;
        color: #6b7280;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `}</style>
    <div className="nmp-card">
      <div className="nmp-image-area">
        <div className="nmp-icon">📋</div>
        <div className="nmp-label">Menu has not been uploaded yet</div>
        <div style={{ fontSize: '0.75rem', color: '#b4b0ab', fontWeight: 500 }}>
          Check back later today
        </div>
      </div>
      <div className="nmp-footer">
        <h3 className="nmp-name">{messName}</h3>
        {price > 0 && (
          <span style={{
            background: 'linear-gradient(135deg, #9ca3af, #d1d5db)',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 700,
            flexShrink: 0,
          }}>
            ₹{price}
          </span>
        )}
      </div>
    </div>
  </>
);

// Helper — is this hotel marked as favourite in localStorage?
const isFavourite = (hotelId?: string) =>
  hotelId ? localStorage.getItem(`liked_${hotelId}`) === 'true' : false;

const MasonryGrid = ({ searchQuery }: { searchQuery: string }) => {
  const [menus, setMenus] = useState<DisplayMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingBackend, setUsingBackend] = useState(false);
  // Bump this counter whenever a like changes so the sort re-runs
  const [likeVersion, setLikeVersion] = useState(0);

  useEffect(() => {
    const loadMenus = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        // Fetch all hotels — each has todayMenu: {...} or null if not uploaded yet
        const hotels = await fetchAllHotelsWithTodayMenu();

        if (hotels && hotels.length > 0) {
          const mapped: DisplayMenu[] = (hotels as BackendHotel[]).map((h) => {
            const hotelName = h.hotelName || h.name || "Unknown Mess";
            const hasMenu = h.todayMenu !== null && h.todayMenu !== undefined;
            return {
              id: h._id,
              image: hasMenu ? h.todayMenu!.imageUrl : "",
              messName: hotelName,
              price: h.price || 0,
              isOpen: true,
              distance: "",
              uploadedAt: hasMenu ? h.todayMenu!.date : undefined,
              note: hasMenu ? (h.todayMenu!.note || "") : "",
              hotelId: h._id,
              address: h.address || "",
              hotelImage: h.imageUrl || "",
              hotelPhotos: h.photos || [],
              menuPostedToday: hasMenu,
            };
          });
          setMenus(mapped);
          setUsingBackend(true);
        } else if (hotels !== null) {
          // Backend reachable but zero hotels registered yet
          setMenus([]);
          setUsingBackend(true);
        } else {
          // Network error — fall back to static demo data
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
      loadMenus(true); // reload silently on push notification
    };

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
  }, []);

  const filtered = menus.filter((m) =>
    m.messName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Sort order (single, fixed — no UI toggle needed) ──────────────────────
  // 1. Favourite hotels  (heart icon tapped)  — any order among themselves
  // 2. Non-favourite hotels that DID post a menu today — earliest post first
  // 3. Non-favourite hotels that have NOT posted today's menu yet
  // likeVersion dependency ensures re-sort when user taps heart
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sorted = [...filtered].sort((a, b) => {
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

  // Count how many have today's menu uploaded (for the header counter)
  const uploadedCount = filtered.filter((m) => m.menuPostedToday).length;

  // Suppress the linter warning — likeVersion IS used as a sort trigger
  void likeVersion;

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
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Grid: always shows all hotels — placeholder card for those without today's menu */}
      {!loading && sorted.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((item, i) =>
            item.menuPostedToday ? (
              <div key={item.id}>
                <MenuCard {...item} index={i} />
              </div>
            ) : (
              <div key={item.id}>
                <NoMenuPlaceholder messName={item.messName} price={item.price} />
              </div>
            )
          )}
        </div>
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
