// // LogsDashboard.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { base_url } from "../../utils/base_url";

// /**
//  * LogsDashboard
//  * - Polls GET /api/agentic/logs?tail=12000
//  * - Parses "=== TITLE @ TIMESTAMP ===" blocks into timeline entries
//  * - Shows newest entries at top. Click an item to expand/collapse details.
//  *
//  * Usage:
//  * - Place this component in your React app and ensure your React dev proxy points to your agent server:
//  *   package.json (in CRA) -> "proxy": "http://localhost:4310"
//  */

// function parseLogBlocks(raw) {
//     // split by lines, look for blocks starting with === TITLE @ TIMESTAMP ===
//     const lines = raw.split(/\r?\n/);
//     const entries = [];
//     let current = null;

//     const headerRe = /^\s*===\s*(.+?)\s*@\s*(.+?)\s*===\s*$/;

//     for (let line of lines) {
//         const m = line.match(headerRe);
//         if (m) {
//             // start new block
//             if (current) entries.push(current);
//             current = { title: m[1].trim(), timestamp: m[2].trim(), body: "" };
//             continue;
//         }
//         if (!current) {
//             // preamble: put into a default initial block
//             current = { title: "log", timestamp: "", body: line + "\n" };
//             continue;
//         }
//         current.body += line + "\n";
//     }
//     if (current) entries.push(current);
//     return entries;
// }

// export default function LogsDashboard() {
//     const [raw, setRaw] = useState("");
//     const [entries, setEntries] = useState([]);
//     const [polling, setPolling] = useState(true);
//     const [tailBytes, setTailBytes] = useState(12000);
//     const [loading, setLoading] = useState(false);
//     const timerRef = useRef(null);

//     async function fetchLogs() {
//         setLoading(true);
//         try {
//             const res = await fetch(`${base_url}/api/agentic/logs?tail=${tailBytes}`, { cache: "no-store" });
//             const json = await res.json();
//             if (json.ok) {
//                 setRaw(json.content || "");
//                 const parsed = parseLogBlocks(json.content || "");
//                 // newest first
//                 setEntries(parsed.reverse());
//             } else {
//                 setRaw(json.message || "No logs available.");
//                 setEntries([]);
//             }
//         } catch (err) {
//             setRaw("Error fetching logs: " + err.message);
//             setEntries([]);
//         } finally {
//             setLoading(false);
//         }
//     }

//     useEffect(() => {
//         // initial fetch
//         fetchLogs();
//         // polling
//         if (polling) {
//             timerRef.current = setInterval(fetchLogs, 4000);
//         }
//         return () => clearInterval(timerRef.current);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [polling, tailBytes]);

//     function togglePolling() {
//         if (polling) {
//             clearInterval(timerRef.current);
//             timerRef.current = null;
//         } else {
//             fetchLogs();
//             timerRef.current = setInterval(fetchLogs, 4000);
//         }
//         setPolling(!polling);
//     }

//     return (
//         <div style={{ fontFamily: "Inter, system-ui, Arial", padding: 16, maxWidth: 1100, margin: "0 auto" }}>
//             <h2 style={{ margin: 0 }}>Profo Agent — Debug Logs Dashboard</h2>
//             <p style={{ marginTop: 6, color: "#666" }}>
//                 Live timeline of agent decisions. Polling:{" "}
//                 <strong>{polling ? "ON" : "OFF"}</strong>
//             </p>

//             <div style={{ display: "flex", gap: 10, marginTop: 12, marginBottom: 12 }}>
//                 <button onClick={togglePolling} style={buttonStyle}>
//                     {polling ? "Pause" : "Resume"}
//                 </button>
//                 <button
//                     onClick={() => {
//                         setRaw("");
//                         setEntries([]);
//                     }}
//                     style={buttonStyle}
//                 >
//                     Clear View
//                 </button>

//                 <label style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 6 }}>
//                     Tail bytes:
//                     <input
//                         value={tailBytes}
//                         onChange={(e) => setTailBytes(Number(e.target.value || 8000))}
//                         style={{ width: 100, padding: 6, borderRadius: 6, border: "1px solid #ddd" }}
//                         type="number"
//                         min={1000}
//                     />
//                 </label>

//                 <button
//                     onClick={() => fetchLogs()}
//                     style={{ ...buttonStyle, marginLeft: "auto" }}
//                 >
//                     Refresh
//                 </button>
//             </div>

//             <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
//                 <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
//                     <div style={{ fontSize: 13, color: "#888" }}>Raw preview</div>
//                     {loading && <div style={{ color: "#888", marginLeft: 8 }}>loading…</div>}
//                 </div>

//                 {entries.length === 0 && (
//                     <pre style={{ whiteSpace: "pre-wrap", color: "#333" }}>{raw || "No logs yet."}</pre>
//                 )}

//                 <div style={{ display: "grid", gap: 8 }}>
//                     {entries.map((e, idx) => (
//                         <LogItem key={idx} entry={e} />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// const LogItem = ({ entry }) => {
//     const [open, setOpen] = useState(false);
//     return (
//         <div
//             style={{
//                 border: "1px solid #f0f0f0",
//                 padding: 12,
//                 borderRadius: 8,
//                 background: open ? "#fbfbff" : "#fff",
//                 boxShadow: open ? "0 4px 18px rgba(20,20,60,0.04)" : "none",
//             }}
//         >
//             <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
//                 <div style={{ flex: 1 }}>
//                     <div style={{ fontSize: 13, fontWeight: 600 }}>{entry.title}</div>
//                     <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{entry.timestamp}</div>
//                 </div>
//                 <div>
//                     <button onClick={() => setOpen(!open)} style={smallButtonStyle}>
//                         {open ? "Collapse" : "Expand"}
//                     </button>
//                 </div>
//             </div>

//             {open && (
//                 <pre style={{ marginTop: 10, whiteSpace: "pre-wrap", fontSize: 13, color: "#222" }}>
//                     {entry.body}
//                 </pre>
//             )}
//         </div>
//     );
// };

// const buttonStyle = {
//     background: "#0f172a",
//     color: "#fff",
//     padding: "8px 12px",
//     borderRadius: 8,
//     border: "none",
//     cursor: "pointer",
// };

// const smallButtonStyle = {
//     background: "#e6e9f2",
//     color: "#111827",
//     padding: "6px 10px",
//     borderRadius: 8,
//     border: "none",
//     cursor: "pointer",
// };

import React, { useEffect, useState, useRef } from "react";
import { Eye, Database, FileText, RefreshCw, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { base_url } from "../../utils/base_url";


function parseLogBlocks(raw) {
    const lines = raw.split(/\r?\n/);
    const entries = [];
    let current = null;
    const headerRe = /^\s*===\s*(.+?)\s*@\s*(.+?)\s*===\s*$/;

    for (let line of lines) {
        const m = line.match(headerRe);
        if (m) {
            if (current) entries.push(current);
            current = { title: m[1].trim(), timestamp: m[2].trim(), body: "" };
            continue;
        }
        if (!current) {
            current = { title: "log", timestamp: "", body: line + "\n" };
            continue;
        }
        current.body += line + "\n";
    }
    if (current) entries.push(current);
    return entries;
}

export default function LogsDashboard() {
    const [viewMode, setViewMode] = useState("db"); // "file" or "db"
    const [fileRaw, setFileRaw] = useState("");
    const [fileEntries, setFileEntries] = useState([]);
    const [dbLogs, setDbLogs] = useState([]);
    const [polling, setPolling] = useState(true);
    const [tailBytes, setTailBytes] = useState(12000);
    const [loading, setLoading] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const timerRef = useRef(null);

    async function fetchFileLogs() {
        setLoading(true);
        try {
            const res = await fetch(`${base_url}/api/agentic/logs?tail=${tailBytes}`, { cache: "no-store" });
            const json = await res.json();
            if (json.ok) {
                setFileRaw(json.content || "");
                const parsed = parseLogBlocks(json.content || "");
                setFileEntries(parsed.reverse());
            } else {
                setFileRaw(json.message || "No logs available.");
                setFileEntries([]);
            }
        } catch (err) {
            setFileRaw("Error fetching logs: " + err.message);
            setFileEntries([]);
        } finally {
            setLoading(false);
        }
    }

    async function fetchDbLogs() {
        setLoading(true);
        try {
            const res = await fetch(`${base_url}/api/agentic/logs/db?limit=10`, { cache: "no-store" });
            const json = await res.json();
            if (json.ok) {
                setDbLogs(json.logs || []);
            } else {
                setDbLogs([]);
            }
        } catch (err) {
            console.error("Error fetching DB logs:", err);
            setDbLogs([]);
        } finally {
            setLoading(false);
        }
    }

    async function fetchSingleLog(sessionId) {
        try {
            const res = await fetch(`${base_url}/api/agentic/logs/db/${sessionId}`);
            const json = await res.json();
            if (json.ok) {
                setSelectedLog(json.log);
            }
        } catch (err) {
            console.error("Error fetching log:", err);
        }
    }

    async function cleanupLogs() {
        if (!confirm("Remove logs beyond the latest 10?")) return;
        try {
            await fetch(`${base_url}/api/agentic/logs/db/cleanup`, { method: "DELETE" });
            fetchDbLogs();
        } catch (err) {
            console.error("Error cleaning logs:", err);
        }
    }

    useEffect(() => {
        if (viewMode === "file") {
            fetchFileLogs();
            if (polling) {
                timerRef.current = setInterval(fetchFileLogs, 4000);
            }
        } else {
            fetchDbLogs();
            if (polling) {
                timerRef.current = setInterval(fetchDbLogs, 4000);
            }
        }
        return () => clearInterval(timerRef.current);
    }, [polling, tailBytes, viewMode]);

    function togglePolling() {
        if (polling) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        } else {
            if (viewMode === "file") fetchFileLogs();
            else fetchDbLogs();
            timerRef.current = setInterval(viewMode === "file" ? fetchFileLogs : fetchDbLogs, 4000);
        }
        setPolling(!polling);
    }

    const statusColor = (status) => {
        if (status === "success") return "#10b981";
        if (status === "error") return "#ef4444";
        return "#f59e0b";
    };

    return (
        <div style={{ fontFamily: "Inter, system-ui, Arial", padding: 16, maxWidth: 1200, margin: "0 auto" }}>
            <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <Database size={24} />
                Profo Agent — Debug Logs Dashboard
            </h2>
            <p style={{ marginTop: 6, color: "#666" }}>
                Monitor agent decisions and AI interactions. Polling: <strong>{polling ? "ON" : "OFF"}</strong>
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 12, marginBottom: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 4, background: "#f3f4f6", borderRadius: 8, padding: 4 }}>
                    <button
                        onClick={() => setViewMode("db")}
                        style={{
                            ...tabButton,
                            background: viewMode === "db" ? "#0f172a" : "transparent",
                            color: viewMode === "db" ? "#fff" : "#374151",
                        }}
                    >
                        <Database size={16} />
                        Database Logs
                    </button>
                    <button
                        onClick={() => setViewMode("file")}
                        style={{
                            ...tabButton,
                            background: viewMode === "file" ? "#0f172a" : "transparent",
                            color: viewMode === "file" ? "#fff" : "#374151",
                        }}
                    >
                        <FileText size={16} />
                        File Logs
                    </button>
                </div>

                <button onClick={togglePolling} style={buttonStyle}>
                    {polling ? "Pause" : "Resume"}
                </button>

                <button onClick={() => (viewMode === "file" ? fetchFileLogs() : fetchDbLogs())} style={buttonStyle}>
                    <RefreshCw size={16} />
                    Refresh
                </button>

                {viewMode === "file" && (
                    <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        Tail bytes:
                        <input
                            value={tailBytes}
                            onChange={(e) => setTailBytes(Number(e.target.value || 8000))}
                            style={{ width: 100, padding: 6, borderRadius: 6, border: "1px solid #ddd" }}
                            type="number"
                            min={1000}
                        />
                    </label>
                )}

                {viewMode === "db" && (
                    <button onClick={cleanupLogs} style={{ ...buttonStyle, background: "#ef4444", marginLeft: "auto" }}>
                        <Trash2 size={16} />
                        Cleanup
                    </button>
                )}

                {loading && <div style={{ color: "#888", display: "flex", alignItems: "center" }}>Loading…</div>}
            </div>

            {viewMode === "file" ? (
                <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
                    {fileEntries.length === 0 && (
                        <pre style={{ whiteSpace: "pre-wrap", color: "#333" }}>{fileRaw || "No logs yet."}</pre>
                    )}
                    <div style={{ display: "grid", gap: 8 }}>
                        {fileEntries.map((e, idx) => (
                            <FileLogItem key={idx} entry={e} />
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ display: "grid", gap: 12 }}>
                    {dbLogs.length === 0 && (
                        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 8, padding: 20, textAlign: "center", color: "#666" }}>
                            No database logs yet. Make some requests to see them here.
                        </div>
                    )}
                    {dbLogs.map((log) => (
                        <DbLogCard key={log._id} log={log} onExpand={() => fetchSingleLog(log.sessionId)} selectedLog={selectedLog} />
                    ))}
                </div>
            )}
        </div>
    );
}

const FileLogItem = ({ entry }) => {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ border: "1px solid #f0f0f0", padding: 12, borderRadius: 8, background: open ? "#fbfbff" : "#fff" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{entry.title}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{entry.timestamp}</div>
                </div>
                <button onClick={() => setOpen(!open)} style={smallButtonStyle}>
                    {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>
            {open && (
                <pre style={{ marginTop: 10, whiteSpace: "pre-wrap", fontSize: 13, color: "#222" }}>{entry.body}</pre>
            )}
        </div>
    );
};

const DbLogCard = ({ log, onExpand, selectedLog }) => {
    const [open, setOpen] = useState(false);
    const isExpanded = selectedLog?.sessionId === log.sessionId;

    const handleExpand = () => {
        if (!open) onExpand();
        setOpen(!open);
    };

    return (
        <div style={{ border: "2px solid #e5e7eb", borderRadius: 12, background: "#fff", overflow: "hidden" }}>
            <div style={{ padding: 16, background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{log.userQuery}</div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                            Session: <code style={{ background: "#e5e7eb", padding: "2px 6px", borderRadius: 4, fontSize: 11 }}>{log.sessionId.slice(0, 8)}</code>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {/* <div style={{ fontSize: 12, fontWeight: 600, color: statusColor(log.status), textTransform: "uppercase" }}>
                            {log.status}
                        </div> */}
                        <button onClick={handleExpand} style={smallButtonStyle}>
                            <Eye size={16} />
                        </button>
                    </div>
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>
                    {new Date(log.createdAt).toLocaleString()} • Model: {log.aiModel}
                </div>
            </div>

            {open && isExpanded && selectedLog && (
                <div style={{ padding: 16 }}>
                    <LogDetailSection title="AI Requests" data={selectedLog.aiRequest} />
                    <LogDetailSection title="AI Responses" data={selectedLog.aiResponse} />
                    <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "#374151" }}>Log Entries ({selectedLog.logEntries.length})</div>
                        <div style={{ display: "grid", gap: 6 }}>
                            {selectedLog.logEntries.map((entry, idx) => (
                                <LogEntry key={idx} entry={entry} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const LogDetailSection = ({ title, data }) => {
    const [show, setShow] = useState(false);
    if (!data || (Array.isArray(data) && data.length === 0)) return null;

    return (
        <div style={{ marginBottom: 16 }}>
            <button
                onClick={() => setShow(!show)}
                style={{ ...smallButtonStyle, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}
            >
                {show ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {title}
            </button>
            {show && (
                <pre style={{ background: "#f9fafb", padding: 12, borderRadius: 8, fontSize: 12, overflow: "auto", maxHeight: 300 }}>
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}
        </div>
    );
};

const LogEntry = ({ entry }) => {
    const [show, setShow] = useState(false);
    const typeColors = {
        "NEW REQUEST": "#3b82f6",
        "INTENT RAW": "#8b5cf6",
        "INTENT PARSED": "#10b981",
        "NORMALIZED FILTERS": "#f59e0b",
        "FILTER REQUEST": "#06b6d4",
        "FILTER RESPONSE": "#14b8a6",
        "EXPLAIN RAW": "#a855f7",
        "FINAL RESPONSE": "#22c55e",
        ERROR: "#ef4444",
        "NO RESULTS": "#f97316",
    };

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 6, overflow: "hidden" }}>
            <div
                onClick={() => setShow(!show)}
                style={{
                    padding: "8px 12px",
                    background: "#f9fafb",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: typeColors[entry.type] || "#6b7280" }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{entry.type}</span>
                </div>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{new Date(entry.timestamp).toLocaleTimeString()}</span>
            </div>
            {show && (
                <pre style={{ margin: 0, padding: 12, fontSize: 11, background: "#fff", overflow: "auto", maxHeight: 200 }}>
                    {typeof entry.data === "string" ? entry.data : JSON.stringify(entry.data, null, 2)}
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
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontWeight: 500,
};

const smallButtonStyle = {
    background: "#e6e9f2",
    color: "#111827",
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 13,
};

const tabButton = {
    padding: "8px 14px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontWeight: 500,
    transition: "all 0.2s",
};