// LogsDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import { base_url } from "../../utils/base_url";

/**
 * LogsDashboard
 * - Polls GET /api/agentic/logs?tail=12000
 * - Parses "=== TITLE @ TIMESTAMP ===" blocks into timeline entries
 * - Shows newest entries at top. Click an item to expand/collapse details.
 *
 * Usage:
 * - Place this component in your React app and ensure your React dev proxy points to your agent server:
 *   package.json (in CRA) -> "proxy": "http://localhost:4310"
 */

function parseLogBlocks(raw) {
    // split by lines, look for blocks starting with === TITLE @ TIMESTAMP ===
    const lines = raw.split(/\r?\n/);
    const entries = [];
    let current = null;

    const headerRe = /^\s*===\s*(.+?)\s*@\s*(.+?)\s*===\s*$/;

    for (let line of lines) {
        const m = line.match(headerRe);
        if (m) {
            // start new block
            if (current) entries.push(current);
            current = { title: m[1].trim(), timestamp: m[2].trim(), body: "" };
            continue;
        }
        if (!current) {
            // preamble: put into a default initial block
            current = { title: "log", timestamp: "", body: line + "\n" };
            continue;
        }
        current.body += line + "\n";
    }
    if (current) entries.push(current);
    return entries;
}

export default function LogsDashboard() {
    const [raw, setRaw] = useState("");
    const [entries, setEntries] = useState([]);
    const [polling, setPolling] = useState(true);
    const [tailBytes, setTailBytes] = useState(12000);
    const [loading, setLoading] = useState(false);
    const timerRef = useRef(null);

    async function fetchLogs() {
        setLoading(true);
        try {
            const res = await fetch(`${base_url}/api/agentic/logs?tail=${tailBytes}`, { cache: "no-store" });
            const json = await res.json();
            if (json.ok) {
                setRaw(json.content || "");
                const parsed = parseLogBlocks(json.content || "");
                // newest first
                setEntries(parsed.reverse());
            } else {
                setRaw(json.message || "No logs available.");
                setEntries([]);
            }
        } catch (err) {
            setRaw("Error fetching logs: " + err.message);
            setEntries([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // initial fetch
        fetchLogs();
        // polling
        if (polling) {
            timerRef.current = setInterval(fetchLogs, 4000);
        }
        return () => clearInterval(timerRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [polling, tailBytes]);

    function togglePolling() {
        if (polling) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        } else {
            fetchLogs();
            timerRef.current = setInterval(fetchLogs, 4000);
        }
        setPolling(!polling);
    }

    return (
        <div style={{ fontFamily: "Inter, system-ui, Arial", padding: 16, maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ margin: 0 }}>Profo Agent — Debug Logs Dashboard</h2>
            <p style={{ marginTop: 6, color: "#666" }}>
                Live timeline of agent decisions. Polling:{" "}
                <strong>{polling ? "ON" : "OFF"}</strong>
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 12, marginBottom: 12 }}>
                <button onClick={togglePolling} style={buttonStyle}>
                    {polling ? "Pause" : "Resume"}
                </button>
                <button
                    onClick={() => {
                        setRaw("");
                        setEntries([]);
                    }}
                    style={buttonStyle}
                >
                    Clear View
                </button>

                <label style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    Tail bytes:
                    <input
                        value={tailBytes}
                        onChange={(e) => setTailBytes(Number(e.target.value || 8000))}
                        style={{ width: 100, padding: 6, borderRadius: 6, border: "1px solid #ddd" }}
                        type="number"
                        min={1000}
                    />
                </label>

                <button
                    onClick={() => fetchLogs()}
                    style={{ ...buttonStyle, marginLeft: "auto" }}
                >
                    Refresh
                </button>
            </div>

            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
                <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 13, color: "#888" }}>Raw preview</div>
                    {loading && <div style={{ color: "#888", marginLeft: 8 }}>loading…</div>}
                </div>

                {entries.length === 0 && (
                    <pre style={{ whiteSpace: "pre-wrap", color: "#333" }}>{raw || "No logs yet."}</pre>
                )}

                <div style={{ display: "grid", gap: 8 }}>
                    {entries.map((e, idx) => (
                        <LogItem key={idx} entry={e} />
                    ))}
                </div>
            </div>
        </div>
    );
}

const LogItem = ({ entry }) => {
    const [open, setOpen] = useState(false);
    return (
        <div
            style={{
                border: "1px solid #f0f0f0",
                padding: 12,
                borderRadius: 8,
                background: open ? "#fbfbff" : "#fff",
                boxShadow: open ? "0 4px 18px rgba(20,20,60,0.04)" : "none",
            }}
        >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{entry.title}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{entry.timestamp}</div>
                </div>
                <div>
                    <button onClick={() => setOpen(!open)} style={smallButtonStyle}>
                        {open ? "Collapse" : "Expand"}
                    </button>
                </div>
            </div>

            {open && (
                <pre style={{ marginTop: 10, whiteSpace: "pre-wrap", fontSize: 13, color: "#222" }}>
                    {entry.body}
                </pre>
            )}
        </div>
    );
};

const buttonStyle = {
    background: "#0f172a",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
};

const smallButtonStyle = {
    background: "#e6e9f2",
    color: "#111827",
    padding: "6px 10px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
};