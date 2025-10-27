// pinger.js
import fetch from "node-fetch"; // install with `npm install node-fetch`
// :spanner: Replace with the URL(s) you want to ping
const URLS = [
    "https://propertify-0tk4.onrender.com",
];
// Function to ping all URLs
async function pingUrls() {
    for (const url of URLS) {
        try {
            const start = Date.now();
            const res = await fetch(url);
            const time = Date.now() - start;
            console.log(`[${new Date().toISOString()}] :white_tick: ${url} responded with ${res.status} in ${time}ms`);
        } catch (err) {
            console.error(`[${new Date().toISOString()}] :x: Failed to reach ${url}:`, err.message);
        }
    }
}
// Run immediately once
pingUrls();
// Then repeat every 30 seconds
setInterval(pingUrls, 30 * 1000);
