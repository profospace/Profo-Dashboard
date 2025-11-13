
// ====================== IMPORTS ======================
const chalk = require("chalk");

// const fetch = require('node-fetch');
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

// ====================== CONFIG ======================
const FILTER_API =
    process.env.FILTER_API || "http://localhost:5029/api/web/properties/filter";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL =
    process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
const OPENROUTER_BASE =
    process.env.OPENROUTER_BASE || "https://openrouter.ai/api/v1";
const DEBUG_MODE = true;
const LOG_PATH = process.env.LOG_PATH || "./logs/agent-debug.txt";
const LOCALITY_PATH = process.env.LOCALITY_PATH || "./data/localities.json";

if (!fs.existsSync("./logs")) fs.mkdirSync("./logs");

// ====================== LOGGING ======================
function logToFile(title, data) {
    try {
        const entry = `\n=== ${title.toUpperCase()} @ ${new Date().toISOString()} ===\n${typeof data === "string" ? data : JSON.stringify(data, null, 2)
            }\n`;
        fs.appendFileSync(LOG_PATH, entry);
        if (DEBUG_MODE) console.log(chalk.gray(entry));
    } catch (e) {
        if (DEBUG_MODE) console.error("Failed to write log:", e.message);
    }
}

// ====================== LOCALITY CACHE ======================
let localityData = [];
try {
    if (fs.existsSync(LOCALITY_PATH)) {
        localityData = JSON.parse(fs.readFileSync(LOCALITY_PATH, "utf8")) || [];
        console.log(`📍 Loaded ${localityData.length} localities`);
    } else {
        console.warn("⚠️ Missing data/localities.json — run /api/generate-localities");
    }
} catch (e) {
    console.error("Error loading locality data:", e.message);
}

function norm(s) {
    return (s || "").toString().trim().toLowerCase();
}

// ====================== PRICE PARSER ======================
function parsePrice(value) {
    if (!value) return null;
    let str = value.toString().trim().toLowerCase();

    // Handle words
    str = str.replace(/(rupees|rs|inr|\₹)/g, "").trim();

    const num = parseFloat(str.replace(/[^\d.]/g, "")) || 0;

    if (/cr|crore/.test(str)) return num * 10000000; // 1 crore = 10M
    if (/l|lac|lakh/.test(str)) return num * 100000; // 1 lakh = 100k
    if (/k|thousand/.test(str)) return num * 1000; // 1k = 1000

    return num || null;
}

function parseNumber(v) {
    if (v == null) return null;
    if (typeof v === "number") return v;
    return parsePrice(v);
}

// ====================== EMI CALCULATION ======================
function calcEMI(P, annualRatePercent = 8.5, months = 240) {
    if (!P) return null;
    const r = annualRatePercent / 12 / 100;
    const emi = (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    return Math.round(emi);
}

// ====================== OPENROUTER CHAT ======================
async function openrouterChat(messages, max_tokens = 400, temperature = 0.3) {
    if (!OPENROUTER_API_KEY) throw new Error("Missing OPENROUTER_API_KEY");
    const payload = { model: OPENROUTER_MODEL, messages, max_tokens, temperature };

    const resp = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://profo.ai",
            "X-Title": "Profo Agent",
        },
        body: JSON.stringify(payload),
    });

    const text = await resp.text();
    if (!resp.ok) {
        const err = `OpenRouter error: ${resp.status} ${resp.statusText} - ${text}`;
        logToFile("OPENROUTER ERROR", err);
        throw new Error(err);
    }

    try {
        const data = JSON.parse(text);
        return data.choices?.[0]?.message?.content?.trim() || "";
    } catch (e) {
        return text.trim();
    }
}

// ====================== INTENT PARSER ======================
async function parseIntent(query) {
    const knownCities = [...new Set(localityData.map((l) => norm(l.city)))];
    const systemPrompt = `You are a strict real estate intent parser. Extract structured filters from queries. Use only known localities and cities. Return JSON with fields: purpose ("buy"/"rent"), city, locality, bedrooms, minPrice, maxPrice. Do NOT invent anything.`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
    ];

    const raw = await openrouterChat(messages, 350, 0.0);
    logToFile("INTENT RAW", raw);

    let parsed = {};
    try {
        parsed = JSON.parse(raw);
    } catch (e) {
        const m = raw.match(/\{[\s\S]*\}/);
        if (m) parsed = JSON.parse(m[0]);
    }

    parsed.purpose = parsed.purpose === "rent" ? "rent" : "buy";
    parsed.city = knownCities.includes(norm(parsed.city)) ? parsed.city : "";
    parsed.locality = parsed.locality || "";
    parsed.minPrice = parsePrice(parsed.minPrice);
    parsed.maxPrice = parsePrice(parsed.maxPrice);
    parsed.bedrooms = parsed.bedrooms ? Number(parsed.bedrooms) : null;

    logToFile("INTENT PARSED", parsed);
    return parsed;
}

// ====================== FILTER NORMALIZATION ======================
function normalizeFilters(filters) {
    const out = { ...filters };

    if (!out.purpose && /rent/i.test(out.query)) out.purpose = "rent";
    if (!out.purpose) out.purpose = "buy";

    if (!out.bedrooms && out.bhk) out.bedrooms = parseInt(out.bhk, 10);

    if (out.budget) {
        if (typeof out.budget === "object") {
            if (!out.maxPrice && out.budget.max) out.maxPrice = parsePrice(out.budget.max);
            if (!out.minPrice && out.budget.min) out.minPrice = parsePrice(out.budget.min);
        } else if (!out.maxPrice) out.maxPrice = parsePrice(out.budget);
    }

    if (!out.maxPrice && out.price) out.maxPrice = parsePrice(out.price);

    if (out.locality && localityData.length) {
        const input = out.locality.trim().toLowerCase();
        let found = localityData.find(
            (l) =>
                l.locality?.toLowerCase() === input ||
                l.city?.toLowerCase() === input
        );

        if (!found) {
            const fuzzy = localityData.find(
                (l) =>
                    l.locality?.toLowerCase().includes(input) ||
                    input.includes(l.locality?.toLowerCase())
            );
            if (fuzzy) found = fuzzy;
        }

        if (found) {
            out.city = found.city;
            out.locality = found.locality;
        } else {
            out.locality = "";
        }
    }

    logToFile("NORMALIZED FILTERS", out);
    return out;
}

// ====================== FILTER API ======================
async function callFilterApi(filters, maxResults = 10) {
    const params = {
        city: filters.city,
        locality: filters.locality,
        purpose: filters.purpose,
        configuration: filters.configuration,
        bedrooms: filters.bedrooms,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        limit: maxResults,
    };

    Object.keys(params).forEach((k) => params[k] == null && delete params[k]);
    const queryString = new URLSearchParams(params).toString();
    logToFile("FILTER REQUEST", queryString);

    const res = await fetch(`${FILTER_API}?${queryString}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();
    logToFile("FILTER RESPONSE", json);
    return json.properties || [];
}

// ====================== EXPLANATION ======================
async function gptExplainBatch(properties, filters) {
    if (!properties?.length) return [];
    const prompt = `User filters: ${JSON.stringify(
        filters
    )}\nProperties: ${JSON.stringify(
        properties.map((p, i) => ({
            idx: i,
            title: p.post_title,
            city: p.city,
            locality: p.locality,
            price: p.price,
        }))
    )}\nReturn JSON: [{"idx":0, "why":"short reason","confidence":"high|medium|low"}]`;

    const text = await openrouterChat([{ role: "user", content: prompt }], 600, 0.3);
    logToFile("EXPLAIN RAW", text);

    try {
        return JSON.parse(text);
    } catch {
        return properties.map((_, i) => ({
            idx: i,
            why: "Good match",
            confidence: "medium",
        }));
    }
}

// ====================== MAIN ROUTE ======================
app.post("/api/agentic/filter", async (req, res) => {
    try {
        const { query, maxResults = 5 } = req.body;
        logToFile("NEW REQUEST", query);

        const parsed = await parseIntent(query);
        const filters = normalizeFilters(parsed);

        let props = await callFilterApi(filters, maxResults);
        if (!props.length && filters.locality) {
            logToFile("NO RESULTS", `Retrying with city only: ${filters.city}`);
            props = await callFilterApi({ ...filters, locality: "" }, maxResults);
        }

        if (!props.length) {
            return res.json({
                summary: `No properties found for "${filters.locality || filters.city || "your query"}"`,
                results: [],
                filters,
            });
        }

        const explains = await gptExplainBatch(props, filters);
        const enriched = props.map((p, i) => {
            const exp = explains.find((e) => e.idx === i);
            return {
                id: p._id || p.post_id,
                title: p.post_title,
                city: p.city,
                locality: p.locality,
                price: parsePrice(p.price),
                estimatedEMI: calcEMI(parsePrice(p.price)),
                why: exp?.why || "Good match",
                confidence: exp?.confidence || "medium",
                raw: p,
            };
        });

        const summaryPrompt = `Summarize ${enriched.length} properties found for "${query}".`;
        const summary = await openrouterChat(
            [{ role: "user", content: summaryPrompt }],
            80,
            0.3
        );

        const response = { summary, filters, results: enriched };
        logToFile("FINAL RESPONSE", response);
        res.json(response);
    } catch (err) {
        logToFile("ERROR", err.stack);
        res.status(500).json({ error: err.message });
    }
});

// ====================== LOG VIEWER ======================
app.get("/api/agentic/logs", (req, res) => {
    try {
        const tailBytes = parseInt(req.query.tail || "8000", 10);
        if (!fs.existsSync(LOG_PATH))
            return res.json({ ok: false, message: "No logs available yet." });

        const stats = fs.statSync(LOG_PATH);
        const size = stats.size;
        const start = Math.max(0, size - tailBytes);
        const fd = fs.openSync(LOG_PATH, "r");
        const buffer = Buffer.alloc(Math.min(tailBytes, size));
        fs.readSync(fd, buffer, 0, buffer.length, start);
        fs.closeSync(fd);

        let content = buffer.toString("utf8");
        if (start > 0) {
            const firstNewline = content.indexOf("\n");
            if (firstNewline > -1) content = content.slice(firstNewline + 1);
        }

        res.json({ ok: true, size, tailBytes: buffer.length, content });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});
