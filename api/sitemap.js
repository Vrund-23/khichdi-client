export default async function handler(req, res) {
    try {
        // Ensure the script can dynamically switch between local and production APIs
        const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';
        const HOST_URL = 'https://www.khichdi.co.in';

        console.log(`Fetching hotels from ${API_BASE_URL}/admin/hotels ...`);

        let hotels = [];
        try {
            const response = await fetch(`${API_BASE_URL}/admin/hotels`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.hotels) {
                    hotels = data.hotels;
                }
            } else {
                console.warn(`[Warning] Backend responded with status: ${response.status}`);
            }
        } catch (fetchError) {
            console.warn(`[Warning] Failed to fetch hotels. The backend might be unreachable: ${fetchError.message}`);
        }

        const today = new Date().toISOString().split('T')[0];

        // 1. Start XML
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // 2. Add Homepage
        xml += `  <url>\n`;
        xml += `    <loc>${HOST_URL}/</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>daily</changefreq>\n`;
        xml += `    <priority>1.0</priority>\n`;
        xml += `  </url>\n`;

        // 3. Add Hotel Pages
        hotels.forEach(hotel => {
            // Include dynamic id
            const hotelId = hotel._id;

            // If the hotel has a todayMenu, use its date as lastmod, otherwise use today's date
            const lastmod = (hotel.todayMenu && hotel.todayMenu.date)
                ? new Date(hotel.todayMenu.date).toISOString().split('T')[0]
                : today;

            xml += `  <url>\n`;
            xml += `    <loc>${HOST_URL}/hotel/${hotelId}</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += `    <changefreq>daily</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += `  </url>\n`;
        });

        // 4. End XML
        xml += `</urlset>\n`;

        // Set Headers and Response
        // Cache the sitemap for 1 hour at edge, and revalidate it slightly stale
        res.setHeader('Content-Type', 'text/xml');
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        res.status(200).send(xml);

    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        res.status(500).end();
    }
}
