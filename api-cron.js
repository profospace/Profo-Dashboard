import axios from "axios";

// api-cron.js
// Store APIs you want to run indefinitely
let apis = [
  "https://propertify-0tk4.onrender.com/",
];

// Interval in seconds
const intervalSec = 120;

// Function to hit all APIs
const fetchApis = async () => {
  for (const api of apis) {
    try {
      const res = await axios.get(api);
      console.log(`[${new Date().toLocaleTimeString()}] ✅ Hit ${api}`, res.status);
    } catch (err) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error hitting ${api}:`, err.message);
    }
  }
};

// Start immediately, then keep hitting every interval
fetchApis();
setInterval(fetchApis, intervalSec * 1000);
