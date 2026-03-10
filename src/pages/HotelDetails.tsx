import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { subscribeToPush, unsubscribeFromPush } from "@/lib/push";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import API_BASE_URL from "@/lib/api";
import { optimizeImage } from "@/lib/utils";

interface MenuData {
    imageUrl: string;
    note?: string;
    date: string;
}

interface HotelData {
    messName: string;
    price: number;
    isOpen: boolean;
    address: string;
    latitude?: number;
    longitude?: number;
    image: string;
    uploadedAt?: string;
    note?: string;
    hotelPhotos: string[];
    hotelImage: string;
    hotelType?: string;
}

const HotelDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Use state passed from router, or fetch if accessed directly
    const [hotelData, setHotelData] = useState<HotelData | null>(location.state || null);
    const [loading, setLoading] = useState(!location.state);
    const [liked, setLiked] = useState(false);

    // Menu photo state
    const [fetchedMenus, setFetchedMenus] = useState<MenuData[]>([]);
    const ambiancePhotos = hotelData?.hotelPhotos || [];
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [showFullScreen, setShowFullScreen] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

    // Combine avoiding duplication of the 'today' menu
    const initialMenu: MenuData | null = hotelData && hotelData.image ? {
        imageUrl: hotelData.image,
        note: hotelData.note,
        date: hotelData.uploadedAt || new Date().toISOString()
    } : null;

    const combinedMenus = initialMenu ? [initialMenu] : [];
    fetchedMenus.forEach(fm => {
        if (!combinedMenus.some(cm => cm.imageUrl === fm.imageUrl)) {
            combinedMenus.push(fm);
        }
    });

    const activeMenu = combinedMenus[currentPhotoIndex] || null;

    useEffect(() => {
        if (showFullScreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowFullScreen(false);
        };

        if (showFullScreen) {
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [showFullScreen]);

    useEffect(() => {
        if (id) {
            const stored = localStorage.getItem(`liked_${id}`);
            if (stored === 'true') setLiked(true);
        }

        if (id && !id.startsWith('f')) {
            const fetchHistory = async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/menu/hotel/${id}/past`);
                    const data = await res.json();
                    if (data.success) {
                        setPastMenus(data.menus);
                    }
                } catch (error) {
                    console.error("Failed to fetch past menus", error);
                }
            };
            fetchHistory();
        }

        // Fetch missing hotel data if accessed directly
        if (!hotelData && id && !id.startsWith('f')) {
            const fetchHotelData = async () => {
                try {
                    setLoading(true);
                    const res = await fetch(`${API_BASE_URL}/admin/hotels`);
                    const data = await res.json();
                    if (data.success) {
                        const hotel = data.hotels.find((h: { _id: string; hotelType?: string; hotelName?: string; name?: string; price?: number; address?: string; latitude?: number; longitude?: number; todayMenu?: { imageUrl: string; date: string; note?: string; }; photos?: string[]; imageUrl?: string; }) => h._id === id);
                        if (hotel) {
                            setHotelData({
                                messName: hotel.hotelName || hotel.name || "Unknown Mess",
                                price: hotel.price || 0,
                                isOpen: true,
                                address: hotel.address || "",
                                latitude: hotel.latitude,
                                longitude: hotel.longitude,
                                image: hotel.todayMenu?.imageUrl || (hotel.hotelType === 'fixed' ? (hotel.imageUrl || "") : ""),
                                uploadedAt: hotel.todayMenu?.date || undefined,
                                note: hotel.todayMenu?.note || "",
                                hotelPhotos: hotel.photos || [],
                                hotelImage: hotel.imageUrl || "",
                                hotelType: hotel.hotelType || "dynamic"
                            });
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch hotel details", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchHotelData();
        } else if (!hotelData && (!id || id.startsWith('f'))) {
            setLoading(false);
        }
    }, [id, hotelData]);

    const setPastMenus = (menus: { imageUrl: string; note?: string; date: string }[]) => {
        const parsed = menus.map(m => ({
            imageUrl: m.imageUrl,
            note: m.note,
            date: m.date
        }));
        setFetchedMenus(parsed);
    };

    const handleLike = async () => {
        if (!id || id.startsWith('f')) {
            toast.error("Cannot subscribe to this mess (no ID).");
            return;
        }

        const newLikedState = !liked;
        setLiked(newLikedState);
        localStorage.setItem(`liked_${id}`, newLikedState.toString());

        if (newLikedState) {
            const success = await subscribeToPush(id);
            if (success) {
                toast.success(`Subscribed to ${hotelData?.messName || 'hotel'} daily menu updates!`);
            } else {
                setLiked(false);
                localStorage.setItem(`liked_${id}`, 'false');
                toast.error("Failed to subscribe. Please check notification permissions.");
            }
        } else {
            const success = await unsubscribeFromPush(id);
            if (success) {
                toast.info(`Unsubscribed from ${hotelData?.messName || 'hotel'} updates.`);
            }
        }
    };

    const handleMapClick = () => {
        if (hotelData?.latitude && hotelData?.longitude) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${hotelData.latitude},${hotelData.longitude}`, '_blank');
            return;
        }

        const messName = hotelData?.messName || 'Restaurant';
        const address = hotelData?.address || '';
        const locationQuery = address && address.trim() !== ''
            ? address
            : `${messName} Vallabh Vidyanagar`;

        const query = encodeURIComponent(locationQuery);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
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
        );
    }

    if (!hotelData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <h2 className="text-2xl font-bold mb-4 text-green-900">Hotel Details Not Found</h2>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-green-600 text-white rounded-full font-bold">
                    Go Back Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0fdf4] font-sans relative pb-24">
            {/* Header bar */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-green-100 px-4 py-4 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center hover:bg-green-100 transition-colors"
                >
                    <ArrowLeft className="text-green-800" size={20} />
                </button>
                <h1 className="font-bold text-lg text-green-900 font-serif">Hotel Details</h1>
                <div className="w-10 h-10" />
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8">



                {/* Main Info Card */}
                <div className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-green-900/5 mb-8 border border-green-50">
                    <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">

                        {/* General Info */}
                        <div className="flex-1 w-full">
                            <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
                                <div>
                                    <h2 className="text-3xl font-black text-green-900 font-serif mb-1 leading-tight">{hotelData.messName}</h2>
                                </div>

                                {hotelData.price > 0 && (
                                    <div className="bg-gradient-to-br from-green-500 to-green-400 text-white px-5 py-2 rounded-full shadow-lg shadow-green-500/30">
                                        <span className="text-sm font-semibold opacity-90">Starts at</span>
                                        <div className="text-2xl font-black leading-none mt-0.5">₹{hotelData.price}</div>
                                    </div>
                                )}
                            </div>

                            {hotelData.address && (
                                <div className="mt-4 flex items-start gap-2 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <MapPin size={18} className="text-green-600 mt-0.5 shrink-0" />
                                    <p className="text-sm font-medium leading-relaxed">{hotelData.address}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex border-t border-green-50 p-4 sm:px-8 bg-green-50/30">
                        <button
                            onClick={handleMapClick}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-green-100 transition-colors text-green-700 font-bold"
                        >
                            <MapPin size={18} />
                            Open in Maps
                        </button>
                        <div className="w-[1px] bg-green-200 mx-2" />
                        <button
                            onClick={handleLike}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors font-bold ${liked ? 'bg-red-50 text-red-600' : 'hover:bg-green-100 text-gray-600'}`}
                        >
                            <Heart size={18} className={liked ? "fill-red-500 text-red-500" : ""} />
                            {liked ? 'Unsubscribe' : 'Subscribe'}
                        </button>
                    </div>
                </div>

                {/* Menu / Gallery Section */}
                <h3 className="text-2xl font-black font-serif text-green-900 mb-6 flex items-center gap-3">
                    {hotelData.hotelType === 'fixed' ? "🍽️ Menu" : (hotelData.image && currentPhotoIndex === 0 ? "🍽️ Today's Menu" : "🍽️ Past Menu")}
                    {activeMenu?.date && hotelData.hotelType !== 'fixed' && <span className="text-sm font-normal text-gray-500 font-sans mt-1 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">{new Date(activeMenu.date).toLocaleDateString()}</span>}
                </h3>

                <div className="bg-white p-4 sm:p-6 rounded-[32px] shadow-xl shadow-green-900/5 border border-green-50 mb-8">
                    {/* Main Image View */}
                    <div className="relative rounded-[24px] overflow-hidden w-full bg-gray-900/5 flex items-center justify-center h-[55vh] sm:h-[70vh] shadow-inner">
                        {combinedMenus.length > 0 && activeMenu ? (
                            <>
                                <img
                                    src={optimizeImage(activeMenu.imageUrl, 1200)}
                                    alt={`${hotelData.messName} menu`}
                                    className="w-full h-full object-contain drop-shadow-sm cursor-zoom-in"
                                    loading="eager"
                                    // @ts-ignore
                                    fetchpriority="high"
                                    onError={(e) => { e.currentTarget.src = '/khichdi-fallback.svg'; }}
                                    onClick={(e) => { e.stopPropagation(); setFullScreenImage(activeMenu.imageUrl); setShowFullScreen(true); }}
                                    style={{ animation: 'mc-fadeIn 0.3s ease-in-out' }}
                                />

                                {/* Navigation Arrows */}
                                {combinedMenus.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentPhotoIndex((prev) => (prev - 1 + combinedMenus.length) % combinedMenus.length)}
                                            className="absolute left-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white backdrop-blur shadow-lg text-green-900 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-10"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button
                                            onClick={() => setCurrentPhotoIndex((prev) => (prev + 1) % combinedMenus.length)}
                                            className="absolute right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white backdrop-blur shadow-lg text-green-900 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-10"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-400 font-medium">No menu image available.</p>
                        )}
                    </div>

                    {/* Thumbnail Strip */}
                    {combinedMenus.length > 1 && (
                        <div className="mt-6 flex overflow-x-auto gap-3 pb-2 scroll-smooth hide-scrollbar">
                            {combinedMenus.map((menu, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentPhotoIndex(idx)}
                                    className={`relative shrink-0 rounded-2xl overflow-hidden h-20 w-20 sm:h-24 sm:w-24 transition-all duration-300 ${currentPhotoIndex === idx ? 'border-4 border-green-500 shadow-md scale-105' : 'border border-gray-200 opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={optimizeImage(menu.imageUrl, 200)} alt={`Thumbnail ${idx}`} loading="lazy" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    {activeMenu?.note && (
                        <div className="mt-6 bg-yellow-50 text-yellow-800 p-5 rounded-2xl border border-yellow-200 shadow-sm flex items-start gap-4">
                            <span className="text-2xl">📝</span>
                            <div>
                                <h4 className="font-bold text-sm text-yellow-900 mb-1">Chef's Note</h4>
                                <p className="text-[15px] font-medium leading-relaxed">{activeMenu.note}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Static Hotel Ambiance Section */}
                {ambiancePhotos.length > 0 && (
                    <div className="mt-4 w-full bg-white rounded-[32px] p-6 sm:p-8 shadow-xl shadow-green-900/5 border border-green-50 overflow-hidden">
                        <h3 className="text-2xl font-black font-serif text-green-900 mb-6 flex items-center gap-3">
                            🖼️ Hotel Ambiance
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full uppercase tracking-wider ml-1">Photos</span>
                        </h3>
                        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
                            {ambiancePhotos.map((photo, idx) => (
                                <img
                                    key={idx}
                                    src={optimizeImage(photo, 600)}
                                    alt={`${hotelData.messName} ambiance ${idx + 1}`}
                                    className="w-64 h-44 sm:w-80 sm:h-56 object-cover rounded-2xl shadow-sm shrink-0 snap-center border border-green-100"
                                    loading="lazy"
                                    onError={(e) => { e.currentTarget.src = '/khichdi-fallback.svg'; }}
                                    onClick={(e) => { e.stopPropagation(); setFullScreenImage(photo); setShowFullScreen(true); }}
                                    style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                />
                            ))}
                        </div>
                    </div>
                )}

            </div>

            <Footer />

            {/* ── Full Screen Image Viewer ── */}
            {showFullScreen && fullScreenImage && (
                <div
                    role="dialog"
                    aria-label="Full screen image viewer"
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 cursor-zoom-out"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowFullScreen(false);
                        setFullScreenImage(null);
                    }}
                    style={{ animation: 'mc-fadeIn 0.22s ease both' }}
                >
                    <img
                        src={optimizeImage(fullScreenImage, 1800)}
                        alt={hotelData.messName}
                        className="w-full h-full object-contain max-w-7xl mx-auto"
                        onError={(e) => { e.currentTarget.src = '/khichdi-fallback.svg'; }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowFullScreen(false);
                            setFullScreenImage(null);
                        }}
                    />
                    <div className="absolute top-6 right-6 text-white font-bold opacity-70 text-sm bg-black/50 px-3 py-1 rounded-full pointer-events-none">
                        Tap anywhere to close
                    </div>
                </div>
            )}
        </div>
    );
};

export default HotelDetails;
