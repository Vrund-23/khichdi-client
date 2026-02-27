import MenuCard from "./MenuCard";
import menu1 from "@/assets/menu-1.jpg";
import menu2 from "@/assets/menu-2.jpg";
import menu3 from "@/assets/menu-3.jpg";
import menu4 from "@/assets/menu-4.jpg";
import menu5 from "@/assets/menu-5.jpg";
import menu6 from "@/assets/menu-6.jpg";

const messData = [
  { id: 1, image: menu1, messName: "Somnath", price: 70, isOpen: true, distance: "0.3 km" },
  { id: 2, image: menu2, messName: "Mahadev", price: 85, isOpen: true, distance: "0.5 km" },
  { id: 3, image: menu3, messName: "Gayatri", price: 60, isOpen: false, distance: "0.8 km" },
  { id: 4, image: menu4, messName: "Nutan-Club", price: 90, isOpen: true, distance: "1.2 km" },
  { id: 5, image: menu5, messName: "Gujrat-Club", price: 55, isOpen: true, distance: "0.1 km" },
  { id: 6, image: menu6, messName: "A.M.Naik", price: 75, isOpen: true, distance: "0.6 km" },
];

const MasonryGrid = ({ searchQuery }: { searchQuery: string }) => {
  const filtered = messData.filter((m) =>
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
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a" }}
        >
          {filtered.length} places
        </span>
      </div>

      {/* Staggered masonry: 1 col mobile, 2 col sm, 3 col lg */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-5 space-y-4 md:space-y-5">
        {filtered.map((item, i) => (
          <div key={item.id} className="break-inside-avoid">
            <MenuCard {...item} index={i} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl font-bold" style={{ color: "#78716c" }}>No mess found 🍽️</p>
          <p className="mt-2 font-medium" style={{ color: "#a8a29e" }}>Try a different search</p>
        </div>
      )}
    </div>
  );
};

export default MasonryGrid;
