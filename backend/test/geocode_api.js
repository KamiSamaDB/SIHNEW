import Nominatim from "nominatim-client";

const client = Nominatim.createClient({
    useragent: "my-app",
    referer: "http://localhost"
});

client.search({ q: "bakery in new york" })
    .then(results => {
        const simplified = results.map(r => ({
            name: r.display_name,
            lat: r.lat,
            lng: r.lon
        }));
        console.log(simplified);
    })
    .catch(err => console.error("Search error:", err));
