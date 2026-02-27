import { MapPin, Leaf, IndianRupee, Moon } from "lucide-react";
import { useState } from "react";

const filters = [
  { id: "location", label: "Current Location", icon: MapPin, emoji: "📍" },
  { id: "veg", label: "Pure Veg", icon: Leaf, emoji: "🥬" },
  { id: "budget", label: "Under ₹80", icon: IndianRupee, emoji: "💰" },
  { id: "dinner", label: "Dinner", icon: Moon, emoji: "🌙" },
];

const FilterChips = ({ onFilterChange }: { onFilterChange: (active: string[]) => void }) => {
  const [active, setActive] = useState<string[]>([]);

  const toggle = (id: string) => {
    const next = active.includes(id) ? active.filter((f) => f !== id) : [...active, id];
    setActive(next);
    onFilterChange(next);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => toggle(f.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border-2 ${
              active.includes(f.id)
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-card text-foreground border-border hover:border-khichdi-light hover:bg-secondary"
            }`}
          >
            <span>{f.emoji}</span>
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterChips;
