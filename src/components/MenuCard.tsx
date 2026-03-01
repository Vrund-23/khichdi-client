import { MapPin, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { subscribeToPush, unsubscribeFromPush } from "@/lib/push";

interface MenuCardProps {
  image: string;
  messName: string;
  price: number;
  isOpen: boolean;
  distance?: string;
  index?: number;
  uploadedAt?: string;
  note?: string;
  hotelId?: string;
}

const MenuCard = ({ image, messName, price, isOpen, distance, index = 0, uploadedAt, note, hotelId }: MenuCardProps) => {
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Rehydrate "liked" state from localStorage just to keep visual consistency
  useEffect(() => {
    if (hotelId) {
      const stored = localStorage.getItem(`liked_${hotelId}`);
      if (stored === 'true') setLiked(true);
    }
  }, [hotelId]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!hotelId) {
      toast.error("Cannot subscribe to this mess (no ID).");
      return;
    }

    const newLikedState = !liked;
    setLiked(newLikedState);
    localStorage.setItem(`liked_${hotelId}`, newLikedState.toString());

    if (newLikedState) {
      const success = await subscribeToPush(hotelId);
      if (success) {
        toast.success(`Subscribed to ${messName} daily menu updates!`);
      } else {
        setLiked(false);
        localStorage.setItem(`liked_${hotelId}`, 'false');
        toast.error("Failed to subscribe. Please check notification permissions.");
      }
    } else {
      const success = await unsubscribeFromPush(hotelId);
      if (success) {
        toast.info(`Unsubscribed from ${messName} updates.`);
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes mc-fadeUp {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes mc-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes mc-scaleIn {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes mc-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          60%       { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
        }
        @keyframes mc-heartPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.4); }
          70%  { transform: scale(0.87); }
          100% { transform: scale(1); }
        }

        .mc-card {
          font-family: 'DM Sans', sans-serif;
          border-radius: 24px;
          overflow: hidden;
          background: rgba(255,255,255,0.93);
          border: 1.5px solid rgba(74,222,128,0.2);
          box-shadow: 0 4px 24px rgba(22,163,74,0.09), 0 1px 4px rgba(0,0,0,0.05);
          cursor: pointer;
          opacity: 0;
          animation: mc-fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) forwards;
          transition: transform 0.32s cubic-bezier(0.16,1,0.3,1),
                      box-shadow 0.32s cubic-bezier(0.16,1,0.3,1),
                      border-color 0.3s ease;
        }
        .mc-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 48px rgba(22,163,74,0.15), 0 4px 12px rgba(0,0,0,0.07);
          border-color: rgba(74,222,128,0.45);
        }

        .mc-img-wrap { position: relative; overflow: hidden; }
        .mc-img {
          width: 100%; height: auto; display: block; object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .mc-card:hover .mc-img { transform: scale(1.06); }

        .mc-price-tag {
          position: absolute; top: 12px; right: 12px;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          color: #fff;
          padding: 5px 13px;
          border-radius: 9999px;
          font-size: 13px; font-weight: 800;
          box-shadow: 0 2px 10px rgba(22,163,74,0.38);
          font-family: 'DM Sans', sans-serif;
        }

        .mc-footer {
          padding: 12px 15px;
          display: flex; align-items: center; justify-content: space-between;
          background: linear-gradient(to bottom, rgba(240,253,244,0.5), #fff);
        }

        .mc-mess-name {
          font-weight: 800; font-size: 1.3rem;
          color: #14532d;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 180px;
          font-family: 'Playfair Display', serif;
          letter-spacing: -0.01em;
        }

        .mc-right { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }

        .mc-dist {
          font-size: 11px; font-weight: 600; color: #9ca3af;
          font-family: 'DM Sans', sans-serif;
        }

        .mc-icon-btn {
          width: 30px; height: 30px; border-radius: 9999px;
          border: none; background: transparent; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.18s, transform 0.15s;
        }
        .mc-icon-btn:hover  { background: rgba(74,222,128,0.13); transform: scale(1.12); }
        .mc-icon-btn:active { transform: scale(0.88); }

        .mc-heart-pop { animation: mc-heartPop 0.32s cubic-bezier(0.16,1,0.3,1); }

        .mc-badge-open {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 9px; border-radius: 9999px;
          font-size: 11px; font-weight: 700;
          background: rgba(220,252,231,0.9); color: #15803d;
          border: 1px solid rgba(74,222,128,0.28);
          font-family: 'DM Sans', sans-serif;
        }
        .mc-badge-closed {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 9px; border-radius: 9999px;
          font-size: 11px; font-weight: 700;
          background: rgba(254,226,226,0.9); color: #dc2626;
          border: 1px solid rgba(220,38,38,0.15);
          font-family: 'DM Sans', sans-serif;
        }

        .mc-dot-open {
          width: 6px; height: 6px; border-radius: 9999px;
          background: #22c55e;
          animation: mc-pulse 1.6s ease-in-out infinite;
        }
        .mc-dot-closed {
          width: 6px; height: 6px; border-radius: 9999px;
          background: #dc2626;
        }

        /* ── Modal ── */
        .mc-overlay {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.42);
          backdrop-filter: blur(12px);
          padding: 16px;
          animation: mc-fadeIn 0.22s ease both;
        }
        .mc-modal {
          font-family: 'DM Sans', sans-serif;
          background: rgba(255,255,255,0.97);
          border-radius: 28px;
          max-width: 480px; width: 100%;
          overflow: hidden;
          border: 1.5px solid rgba(74,222,128,0.28);
          box-shadow: 0 24px 80px rgba(22,163,74,0.17), 0 8px 24px rgba(0,0,0,0.1);
          animation: mc-scaleIn 0.32s cubic-bezier(0.16,1,0.3,1) both;
        }
        .mc-modal-img-wrap { position: relative; }
        .mc-modal-price {
          position: absolute; top: 16px; right: 16px;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          color: #fff; padding: 7px 18px;
          border-radius: 9999px;
          font-size: 18px; font-weight: 800;
          box-shadow: 0 4px 16px rgba(22,163,74,0.38);
        }
        .mc-modal-img-fade {
          position: absolute; bottom: 0; left: 0; right: 0; height: 52px;
          background: linear-gradient(to top, rgba(240,253,244,0.7), transparent);
          pointer-events: none;
        }
        .mc-modal-body {
          padding: 22px 24px 26px;
          background: linear-gradient(to bottom, rgba(240,253,244,0.4), #fff);
        }
        .mc-modal-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.22rem; font-weight: 700; color: #14532d;
        }
        .mc-modal-sub {
          font-size: 0.82rem; color: #9ca3af; font-weight: 500; margin-top: 3px;
        }
        .mc-modal-actions { display: flex; gap: 8px; flex-shrink: 0; }

        .mc-modal-fav {
          width: 40px; height: 40px; border-radius: 9999px;
          border: 1.5px solid rgba(74,222,128,0.28); cursor: pointer;
          background: rgba(220,252,231,0.8);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.18s, transform 0.15s;
        }
        .mc-modal-fav:hover  { background: rgba(187,247,208,0.9); transform: scale(1.1); }
        .mc-modal-fav:active { transform: scale(0.88); }

        .mc-modal-map {
          width: 40px; height: 40px; border-radius: 9999px;
          border: none; cursor: pointer;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          box-shadow: 0 2px 12px rgba(22,163,74,0.38);
          display: flex; align-items: center; justify-content: center;
          transition: box-shadow 0.2s, transform 0.15s;
        }
        .mc-modal-map:hover  { box-shadow: 0 4px 20px rgba(22,163,74,0.5); transform: scale(1.08); }
        .mc-modal-map:active { transform: scale(0.9); }

        .mc-modal-badge-open {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 9999px;
          font-size: 12px; font-weight: 700;
          background: rgba(220,252,231,0.9); color: #15803d;
          border: 1px solid rgba(74,222,128,0.28); margin-top: 14px;
          font-family: 'DM Sans', sans-serif;
        }
        .mc-modal-badge-closed {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 9999px;
          font-size: 12px; font-weight: 700;
          background: rgba(254,226,226,0.9); color: #dc2626;
          border: 1px solid rgba(220,38,38,0.15); margin-top: 14px;
          font-family: 'DM Sans', sans-serif;
        }
        .mc-modal-dot-open {
          width: 8px; height: 8px; border-radius: 9999px;
          background: #22c55e;
          animation: mc-pulse 1.6s ease-in-out infinite;
        }
        .mc-modal-dot-closed {
          width: 8px; height: 8px; border-radius: 9999px; background: #dc2626;
        }

        .mc-note {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #166534;
          background: rgba(220,252,231,0.7);
          padding: 6px 12px;
          border-top: 1px solid rgba(74,222,128,0.15);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mc-modal-note {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #14532d;
          background: rgba(220,252,231,0.5);
          border: 1px solid rgba(74,222,128,0.2);
          border-radius: 12px;
          padding: 10px 14px;
          margin-top: 14px;
          line-height: 1.5;
        }
      `}</style>

      {/* ── Card ── */}
      <div
        className="mc-card"
        style={{ animationDelay: `${index * 0.08}s` }}
        onClick={() => setExpanded(true)}
      >
        <div className="mc-img-wrap">
          <img
            src={image}
            alt={`${messName} - Today's Menu`}
            className="mc-img"
            loading="lazy"
          />
          {price > 0 && <div className="mc-price-tag">₹{price}</div>}
        </div>

        <div className="mc-footer">
          <h3 className="mc-mess-name">{messName}</h3>

          <div className="mc-right">
            {distance && <span className="mc-dist">{distance}</span>}

            <button
              className="mc-icon-btn"
              onClick={handleLike}
              aria-label="Favourite"
            >
              <Heart
                size={16}
                className={liked ? "mc-heart-pop" : ""}
                style={{
                  fill: liked ? "#dc2626" : "none",
                  color: liked ? "#dc2626" : "#9ca3af",
                  transition: "color 0.2s, fill 0.2s",
                }}
              />
            </button>

            <button
              className="mc-icon-btn"
              onClick={(e) => e.stopPropagation()}
              aria-label="View on map"
            >
              <MapPin size={16} style={{ color: "#9ca3af", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#16a34a")}
                onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
              />
            </button>

            <div className={isOpen ? "mc-badge-open" : "mc-badge-closed"}>
              <div className={isOpen ? "mc-dot-open" : "mc-dot-closed"} />
              {isOpen ? "Open" : "Closed"}
            </div>
          </div>
        </div>

        {note && (
          <div className="mc-note">
            📝 {note}
          </div>
        )}
      </div>

      {/* ── Expanded Modal ── */}
      {expanded && (
        <div className="mc-overlay" onClick={() => setExpanded(false)}>
          <div className="mc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mc-modal-img-wrap">
              <img
                src={image}
                alt={`${messName} - Full Menu`}
                style={{ width: "100%", height: "auto", maxHeight: "60vh", objectFit: "cover", display: "block" }}
                loading="lazy"
              />
              {price > 0 && <div className="mc-modal-price">₹{price}</div>}
              <div className="mc-modal-img-fade" />
            </div>

            <div className="mc-modal-body">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <h2 className="mc-modal-name">{messName}</h2>
                  <p className="mc-modal-sub">{distance ? `${distance} away • ` : ''}{uploadedAt ? `Uploaded ${new Date(uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : "Today's menu"}</p>
                </div>
                <div className="mc-modal-actions">
                  <button className="mc-modal-fav" onClick={(e) => { e.stopPropagation(); handleLike(e); }}>
                    <Heart
                      size={19}
                      style={{
                        fill: liked ? "#dc2626" : "none",
                        color: liked ? "#dc2626" : "#16a34a",
                        transition: "all 0.2s",
                      }}
                    />
                  </button>
                  <button className="mc-modal-map">
                    <MapPin size={19} color="white" />
                  </button>
                </div>
              </div>

              <div className={isOpen ? "mc-modal-badge-open" : "mc-modal-badge-closed"}>
                <div className={isOpen ? "mc-modal-dot-open" : "mc-modal-dot-closed"} />
                {isOpen ? "Open Now" : "Closed"}
              </div>

              {note && (
                <div className="mc-modal-note">
                  📝 {note}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuCard;