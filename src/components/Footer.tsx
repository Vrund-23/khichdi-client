const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="footer" className="w-full py-10 mt-6 flex flex-col items-center justify-center text-center gap-3 px-4 bg-gradient-to-b from-transparent to-green-50/50 border-t border-green-100/50 pb-10">
            <div className="flex flex-col items-center gap-1 mb-2">
                <p className="text-sm font-medium text-gray-500 font-serif">
                    © {currentYear} Khichdi | Made for Vidyanagar
                </p>
                <div className="h-[2px] w-12 bg-green-200 rounded-full mt-2 mb-1"></div>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <span>Developed with</span>
                <span className="text-lg animate-[pulse_2s_ease-in-out_infinite] select-none" role="img" aria-label="heart">❤️</span>
                <span>by</span>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-base md:text-lg font-black font-serif text-green-900">
                <span className="hover:text-green-700 transition-colors cursor-default">Dharmik Kumbhani</span>
                <span className="text-green-300 text-sm md:text-base hidden sm:inline">•</span>
                <span className="hover:text-green-700 transition-colors cursor-default">Harshvardhan Parmar</span>
                <span className="text-green-300 text-sm md:text-base hidden sm:inline">•</span>
                <span className="hover:text-green-700 transition-colors cursor-default">Vrund Patel</span>
            </div>

            <div id="owners-section" className="mt-8 w-full max-w-2xl px-6 py-5 bg-white/60 border border-green-200/60 rounded-3xl shadow-sm backdrop-blur-md transition-all duration-500 hover:bg-white/90 hover:shadow-lg hover:border-green-300">
                <h4 className="text-green-800 font-bold text-base md:text-lg mb-2 flex items-center justify-center flex-wrap gap-x-2 gap-y-1">
                    <span className="text-xl animate-bounce">📢</span>
                    <span>Note for Owners</span>
                    <span className="text-sm font-semibold text-green-600/80">(Dining Hall / Club / Nashta House)</span>
                </h4>
                <div className="flex flex-col items-center w-full mb-6 gap-2">
                    <p className="text-gray-700 text-sm md:text-base font-medium leading-relaxed text-center">
                        તમારા menu અને Location અમારી વેબસાઈટ પર એડ કરવા માટે અમારો સંપર્ક કરો:
                    </p>
                    <div className="text-2xl md:text-3xl font-black text-green-700 px-4 py-1 rounded-full select-none animate-pulse">
                        (Free)
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                    <a href="tel:+918238267235" className="relative group hover:-translate-y-1 transition-all flex items-center gap-2 bg-gradient-to-r from-green-50 to-white px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(74,222,128,0.4)] border-2 border-green-200 text-green-800 font-bold text-sm">
                        <span className="absolute inset-0 rounded-full group-hover:animate-ping opacity-20 bg-green-400"></span>
                        <span className="text-lg">📞</span> Dharmik (8238267235)
                    </a>
                    <a href="tel:+918866841264" className="relative group hover:-translate-y-1 transition-all flex items-center gap-2 bg-gradient-to-r from-green-50 to-white px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(74,222,128,0.4)] border-2 border-green-200 text-green-800 font-bold text-sm">
                        <span className="absolute inset-0 rounded-full group-hover:animate-ping opacity-20 bg-green-400"></span>
                        <span className="text-lg">📞</span> Harshvardhan (8866841264)
                    </a>
                    <a href="tel:+918160064498" className="relative group hover:-translate-y-1 transition-all flex items-center gap-2 bg-gradient-to-r from-green-50 to-white px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(74,222,128,0.4)] border-2 border-green-200 text-green-800 font-bold text-sm">
                        <span className="absolute inset-0 rounded-full group-hover:animate-ping opacity-20 bg-green-400"></span>
                        <span className="text-lg">📞</span> Vrund (8160064498)
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
