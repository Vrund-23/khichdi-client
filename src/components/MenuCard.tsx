import { MapPin, Heart, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { subscribeToPush, unsubscribeFromPush } from "@/lib/push";
import { useNavigate } from "react-router-dom";
import { optimizeImage } from "@/lib/utils";

interface MenuCardProps {
  image: string;
  messName: string;
  price: number;
  showPrice?: boolean;
  isOpen: boolean;
  distance?: string;
  index?: number;
  uploadedAt?: string;
  note?: string;
  hotelId?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  hotelImage?: string;
  hotelPhotos?: string[];
  menuPostedToday?: boolean;
  hotelType?: string;
}

const MenuCard = ({ image, messName, price, showPrice = true, isOpen, distance, index = 0, uploadedAt, note, hotelId, address, latitude, longitude, hotelImage, hotelPhotos, menuPostedToday = true, hotelType = "dynamic" }: MenuCardProps) => {
  const [liked, setLiked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const navigate = useNavigate();

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
    // Notify MasonryGrid to re-sort (localStorage events don't fire in the same tab)
    window.dispatchEvent(new Event('likeChanged'));

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

  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (latitude && longitude) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
      return;
    }

    // Convert to query using address if available, fallback to basic name + valianagar
    const locationQuery = address && address.trim() !== ''
      ? address
      : `${messName} Vallabh Vidyanagar`;

    const query = encodeURIComponent(locationQuery);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // Handle escape key and body scroll lock
  useEffect(() => {
    const isOverlayOpen = showModal || showFullScreen;

    // Body scroll lock
    if (isOverlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Escape listener
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showFullScreen) setShowFullScreen(false);
        else if (showModal) setShowModal(false);
      }
    };

    if (isOverlayOpen) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [showModal, showFullScreen]);

  return (
    <>
      {/* ── Card ── */}
      {menuPostedToday ? (
        <div
          className="mc-card"
          style={{ animationDelay: `${index * 0.08}s` }}
          onClick={() => setShowModal(true)}
        >
          <div className="mc-img-wrap">
            <img
              src={optimizeImage(image, 450)}
              alt={`${messName} - Today's Menu`}
              className="mc-img"
              loading={index < 6 ? "eager" : "lazy"}
              decoding="async"
              // @ts-ignore
              fetchpriority={index < 6 ? "high" : "auto"}
              onError={(e) => { e.currentTarget.src = '/Gemini_Generated_Image_su8l5hsu8l5hsu8l.png'; }}
            />
            {price > 0 && showPrice && <div className="mc-price-tag">₹{price}</div>}
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
                onClick={handleMapClick}
                aria-label="View on map"
              >
                <MapPin size={16} style={{ color: "#9ca3af", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#16a34a")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
                />
              </button>
            </div>
          </div>

          {note && (
            <div className="mc-note mt-auto">
              📝 {note}
            </div>
          )}
        </div>
      ) : (
        <div
          className="nmp-card"
          style={{ animationDelay: `${index * 0.08}s` }}
          onClick={() => {
            navigate(`/hotel/${hotelId || 'f1'}`, {
              state: { image, messName, price, isOpen, distance, uploadedAt, note, hotelId, address, latitude, longitude, hotelImage, hotelPhotos, hotelType }
            });
          }}
        >
          <div className="nmp-image-area">
            <div className="nmp-icon">📋</div>
            <div className="nmp-label">Menu has not been uploaded yet</div>
            <div style={{ fontSize: '0.75rem', color: '#b4b0ab', fontWeight: 500 }}>
              Check back later today
            </div>
          </div>
          <div className="nmp-footer">
            <h3 className="nmp-name">{messName}</h3>
            {price > 0 && showPrice && (
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
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div className="mc-overlay" onClick={() => setShowModal(false)} role="dialog" aria-label="Menu Details">
          <div className="mc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mc-modal-scroll">
              <div className="mc-modal-img-wrap" style={{ position: 'relative' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowModal(false); }}
                  className="absolute top-4 left-4 w-10 h-10 bg-white/80 hover:bg-white backdrop-blur shadow-lg text-green-900 rounded-full flex items-center justify-center transition-transform active:scale-95 z-10"
                >
                  <ArrowLeft size={20} />
                </button>
                {menuPostedToday || image ? (
                  <img src={optimizeImage(image, 1000)} alt={messName} className="mc-modal-img" onError={(e) => { e.currentTarget.src = '/Gemini_Generated_Image_su8l5hsu8l5hsu8l.png'; }} onClick={(e) => { e.stopPropagation(); setShowFullScreen(true); }} />
                ) : (
                  <div style={{ height: "250px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f3f4f6", cursor: "default" }}>
                    <div style={{ fontSize: "3rem", opacity: 0.4 }}>📋</div>
                    <div style={{ color: "#9ca3af", fontWeight: 600, marginTop: "10px" }}>No menu available today</div>
                  </div>
                )}
                {price > 0 && showPrice && <div className="mc-modal-price">₹{price}</div>}
                <div className="mc-modal-img-fade"></div>
              </div>
              <div className="mc-modal-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="mc-modal-name">{messName}</h2>
                    {distance && <p className="mc-modal-sub">{distance} away</p>}
                  </div>
                  <div className="mc-modal-actions">
                    <button className="mc-modal-fav" onClick={handleLike}>
                      <Heart
                        size={20}
                        className={liked ? "mc-heart-pop" : ""}
                        style={{
                          fill: liked ? "#dc2626" : "none",
                          color: liked ? "#dc2626" : "#22c55e",
                        }}
                      />
                    </button>
                    <button className="mc-modal-map" onClick={handleMapClick}>
                      <MapPin size={20} color="#fff" />
                    </button>
                  </div>
                </div>

                {note && <div className="mc-modal-note">📝 {note}</div>}

                <button
                  className="w-full mt-6 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-white text-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "#16a34a", boxShadow: "0 4px 14px rgba(22,163,74,0.3)" }}
                  onClick={() => {
                    setShowModal(false);
                    navigate(`/hotel/${hotelId || 'f1'}`, {
                      state: { image, messName, price, isOpen, distance, uploadedAt, note, hotelId, address, latitude, longitude, hotelImage, hotelPhotos, hotelType }
                    });
                  }}
                >
                  View More Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Full Screen Image Viewer ── */}
      {showFullScreen && (menuPostedToday || image) && (
        <div
          role="dialog"
          aria-label="Full screen image viewer"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={(e) => {
            e.stopPropagation();
            setShowFullScreen(false);
          }}
          style={{ animation: 'mc-fadeIn 0.22s ease both' }}
        >
          <img
            src={optimizeImage(image, 1600)}
            alt={messName}
            className="w-full h-full object-contain max-w-7xl mx-auto"
            onError={(e) => { e.currentTarget.src = '/Gemini_Generated_Image_su8l5hsu8l5hsu8l.png'; }}
            onClick={(e) => {
              e.stopPropagation();
              setShowFullScreen(false);
            }}
          />
          <div className="absolute top-6 right-6 text-white font-bold opacity-70 text-sm bg-black/50 px-3 py-1 rounded-full pointer-events-none">
            Tap anywhere to close
          </div>
        </div>
      )}
    </>
  );
};

export default MenuCard;