import { MapPin, Building2, School } from "lucide-react";
import menu1 from "@/assets/menu-1.jpg";
import menu2 from "@/assets/menu-2.jpg";
import menu4 from "@/assets/menu-4.jpg";

interface LocationOverlayProps {
  onSelect: (zone: string) => void;
}

const zones = [
  { id: "bvm", label: "BVM / Engineering Zone", image: menu1, icon: School, description: "Hostels near BVM campus" },
  { id: "mota-bazar", label: "Mota Bazar", image: menu2, icon: Building2, description: "City center eateries" },
  { id: "nana-bazar", label: "Nana Bazar", image: menu4, icon: MapPin, description: "Budget-friendly options" },
];

const LocationOverlay = ({ onSelect }: LocationOverlayProps) => {
  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />

      {/* Desktop: centered card */}
      <div className="hidden md:flex absolute inset-0 items-center justify-center px-4">
        <div className="bg-card rounded-4xl p-10 max-w-lg w-full shadow-2xl animate-scale-in border border-border">
          <OverlayContent onSelect={onSelect} />
        </div>
      </div>

      {/* Mobile: bottom sheet */}
      <div className="md:hidden absolute inset-x-0 bottom-0">
        <div className="bg-card rounded-t-4xl p-6 pb-8 shadow-2xl animate-slide-up border-t border-border">
          {/* Drag handle */}
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
          <OverlayContent onSelect={onSelect} />
        </div>
      </div>
    </div>
  );
};

const OverlayContent = ({ onSelect }: { onSelect: (zone: string) => void }) => (
  <>
    <div className="text-center mb-6">
      <h2 className="text-2xl font-extrabold text-foreground">Where are you eating?</h2>
      <p className="text-muted-foreground mt-1.5 text-sm font-medium">
        Pick your zone to see nearby mess menus
      </p>
    </div>

    <div className="flex flex-col gap-3">
      {zones.map((zone) => (
        <button
          key={zone.id}
          onClick={() => onSelect(zone.id)}
          className="flex items-center gap-4 w-full p-3 rounded-2xl border-2 border-border bg-card hover:border-primary hover:bg-secondary transition-all duration-200 text-left group btn-squishy overflow-hidden"
        >
          {/* Zone photo */}
          <div className="size-16 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={zone.image}
              alt={zone.label}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-foreground text-base truncate">{zone.label}</p>
            <p className="text-sm text-muted-foreground font-medium">{zone.description}</p>
          </div>
          <zone.icon className="size-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-auto" />
        </button>
      ))}
    </div>
  </>
);

export default LocationOverlay;
