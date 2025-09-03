import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Helper: flatten nested JSON and extract numeric values
const flattenNumbers = (obj, prefix = "") => {
  let result = {};
  if (typeof obj === "number") {
    result[prefix || "value"] = obj;
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      result = { ...result, ...flattenNumbers(item, `${prefix}[${idx}]`) };
    });
  } else if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      result = { ...result, ...flattenNumbers(obj[key], prefix ? `${prefix}.${key}` : key) };
    }
  }
  return result;
};

export default function Apihit() {
  const [apis, setApis] = useState([]);
  const [inputApi, setInputApi] = useState("");
  const [intervalSec, setIntervalSec] = useState(10);
  const [activeTab, setActiveTab] = useState("data");

  const [apiHistory, setApiHistory] = useState({});
  const [apiCounts, setApiCounts] = useState({});

  const addApi = () => {
    if (inputApi && !apis.includes(inputApi)) {
      setApis([...apis, inputApi]);
      setInputApi("");
    }
  };

  const fetchData = async (api) => {
    try {
      const res = await axios.get(api);

      const flattened = flattenNumbers(res.data); // Extract numeric values

      // Update history
      setApiHistory((prev) => {
        const history = prev[api] ? [...prev[api]] : [];
        const timestamp = new Date().toLocaleTimeString();
        history.push({ time: timestamp, value: flattened });
        return { ...prev, [api]: history };
      });

      // Update API call counts
      setApiCounts((prev) => ({
        ...prev,
        [api]: prev[api] ? prev[api] + 1 : 1,
      }));
    } catch (error) {
      console.error(`Error fetching ${api}:`, error.message);
    }
  };

  useEffect(() => {
    if (apis.length === 0) return;

    apis.forEach(fetchData);

    const interval = setInterval(() => {
      apis.forEach(fetchData);
    }, intervalSec * 1000);

    return () => clearInterval(interval);
  }, [apis, intervalSec]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dynamic API Dashboard</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter API URL"
          value={inputApi}
          onChange={(e) => setInputApi(e.target.value)}
          className="border p-1 rounded w-full"
        />
        <button onClick={addApi} className="bg-blue-500 text-white px-4 rounded">
          Add API
        </button>
      </div>

      <div className="mb-4">
        <label className="mr-2">Refresh Interval (sec):</label>
        <input
          type="number"
          value={intervalSec}
          onChange={(e) => setIntervalSec(Number(e.target.value))}
          className="border p-1 rounded w-20"
        />
      </div>

      <div className="flex gap-4 mb-4 border-b">
        <button
          className={`pb-2 ${activeTab === "data" ? "border-b-2 border-blue-500 font-bold" : ""}`}
          onClick={() => setActiveTab("data")}
        >
          Data & Chart
        </button>
        <button
          className={`pb-2 ${activeTab === "count" ? "border-b-2 border-blue-500 font-bold" : ""}`}
          onClick={() => setActiveTab("count")}
        >
          API Call Counts
        </button>
      </div>

      {activeTab === "data" && (
        <div>
          {apis.map((api) => (
            <div key={api} className="mb-6 p-4 border rounded">
              <h2 className="font-semibold mb-2">{api}</h2>
              <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(apiHistory[api]?.slice(-1)[0]?.value, null, 2)}
              </pre>

              {apiHistory[api] && apiHistory[api].length > 0 && (
                <Line
                  data={{
                    labels: apiHistory[api].map((d) => d.time),
                    datasets: Object.keys(apiHistory[api][0].value).map((key, idx) => ({
                      label: key,
                      data: apiHistory[api].map((d) => d.value[key]),
                      borderColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
                      backgroundColor: `hsla(${(idx * 60) % 360}, 70%, 50%, 0.2)`,
                    })),
                  }}
                  options={{ responsive: true }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "count" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apis.map((api) => (
            <div key={api} className="p-4 border rounded">
              <h2 className="font-semibold mb-2">{api}</h2>
              <p>API called: {apiCounts[api] || 0} times</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}