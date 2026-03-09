const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full py-10 mt-6 flex flex-col items-center justify-center text-center gap-3 px-4 bg-gradient-to-b from-transparent to-green-50/50 border-t border-green-100/50 pb-28 md:pb-10">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <span>Crafted with</span>
                <span className="text-lg animate-[pulse_2s_ease-in-out_infinite] select-none" role="img" aria-label="laptop">💻</span>
                <span>by</span>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-base md:text-lg font-black font-serif text-green-900">
                <span className="hover:text-green-700 transition-colors cursor-default">Dharmik Kumbhani</span>
                <span className="text-green-300 text-sm md:text-base hidden sm:inline">•</span>
                <span className="hover:text-green-700 transition-colors cursor-default">Harshvardhan Parmar</span>
                <span className="text-green-300 text-sm md:text-base hidden sm:inline">•</span>
                <span className="hover:text-green-700 transition-colors cursor-default">Vrund Patel</span>
            </div>

            <div className="mt-2 flex flex-col items-center gap-1">
                <div className="h-[2px] w-12 bg-green-200 rounded-full mb-1"></div>
                <p className="text-xs text-gray-500 font-medium">
                    © {currentYear} All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
