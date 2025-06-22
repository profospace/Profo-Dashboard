import React, { useState, useCallback, useRef } from 'react';
import { Play, Square, Download, BarChart3, Clock, Zap, AlertTriangle } from 'lucide-react';

const ApiLoadTester = () => {
    const [apiUrl, setApiUrl] = useState('https://propertify.onrender.com/api/properties/filter?radius=10&purpose=Buy&loanApprovalStatus%5B0%5D=Pre-approved');
    const [isRunning, setIsRunning] = useState(false);
    const [metrics, setMetrics] = useState([]);
    const [summary, setSummary] = useState(null);
    const [config, setConfig] = useState({
        initialConcurrency: 1,
        maxConcurrency: 10,
        incrementStep: 1,
        requestsPerBatch: 5,
        batchDelay: 2000
    });

    const abortControllerRef = useRef(null);
    const currentBatchRef = useRef(0);

    const makeRequest = async (batchNumber, requestNumber) => {
        const startTime = performance.now();

        try {
            const response = await fetch(apiUrl, {
                signal: abortControllerRef.current?.signal,
                headers: {
                    'Accept': 'application/json',
                }
            });

            const endTime = performance.now();
            const responseTime = endTime - startTime;

            return {
                batchNumber,
                requestNumber,
                startTime,
                endTime,
                responseTime,
                status: response.status,
                success: response.ok,
                size: response.headers.get('content-length') || 0
            };
        } catch (error) {
            const endTime = performance.now();
            return {
                batchNumber,
                requestNumber,
                startTime,
                endTime,
                responseTime: endTime - startTime,
                status: 0,
                success: false,
                error: error.message,
                size: 0
            };
        }
    };

    const runBatch = async (concurrency, batchNumber) => {
        const promises = [];

        for (let i = 0; i < config.requestsPerBatch; i++) {
            promises.push(makeRequest(batchNumber, i + 1));

            // Add small delay between requests in the same batch to simulate real load
            if (i < config.requestsPerBatch - 1) {
                await new Promise(resolve => setTimeout(resolve, 100 / concurrency));
            }
        }

        const results = await Promise.all(promises);

        setMetrics(prev => [...prev, ...results]);

        return results;
    };

    const calculateSummary = useCallback((allMetrics) => {
        if (allMetrics.length === 0) return null;

        const responseTimes = allMetrics.map(m => m.responseTime);
        const successfulRequests = allMetrics.filter(m => m.success);
        const failedRequests = allMetrics.filter(m => !m.success);

        const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        const minResponseTime = Math.min(...responseTimes);
        const maxResponseTime = Math.max(...responseTimes);

        // Calculate percentiles
        const sortedTimes = [...responseTimes].sort((a, b) => a - b);
        const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
        const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
        const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];

        return {
            totalRequests: allMetrics.length,
            successfulRequests: successfulRequests.length,
            failedRequests: failedRequests.length,
            successRate: (successfulRequests.length / allMetrics.length * 100).toFixed(2),
            avgResponseTime: avgResponseTime.toFixed(2),
            minResponseTime: minResponseTime.toFixed(2),
            maxResponseTime: maxResponseTime.toFixed(2),
            p50: p50?.toFixed(2) || 0,
            p95: p95?.toFixed(2) || 0,
            p99: p99?.toFixed(2) || 0
        };
    }, []);

    const startTest = async () => {
        if (!apiUrl.trim()) return;

        setIsRunning(true);
        setMetrics([]);
        setSummary(null);
        currentBatchRef.current = 0;
        abortControllerRef.current = new AbortController();

        try {
            for (let concurrency = config.initialConcurrency; concurrency <= config.maxConcurrency; concurrency += config.incrementStep) {
                if (abortControllerRef.current?.signal.aborted) break;

                currentBatchRef.current++;
                console.log(`Running batch ${currentBatchRef.current} with concurrency: ${concurrency}`);

                await runBatch(concurrency, currentBatchRef.current);

                // Wait before next batch
                if (concurrency < config.maxConcurrency) {
                    await new Promise(resolve => setTimeout(resolve, config.batchDelay));
                }
            }
        } catch (error) {
            console.error('Test interrupted:', error);
        } finally {
            setIsRunning(false);
        }
    };

    const stopTest = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setIsRunning(false);
    };

    const exportResults = () => {
        const dataToExport = {
            config,
            summary,
            metrics,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `load-test-results-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    React.useEffect(() => {
        if (metrics.length > 0) {
            setSummary(calculateSummary(metrics));
        }
    }, [metrics, calculateSummary]);

    const getRecentMetrics = () => {
        return metrics.slice(-10).reverse();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <BarChart3 className="text-blue-600" size={28} />
                        <h1 className="text-2xl font-bold text-gray-800">API Load Tester</h1>
                    </div>

                    {/* Configuration */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">API Endpoint</label>
                            <input
                                type="url"
                                value={apiUrl}
                                onChange={(e) => setApiUrl(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter API URL"
                                disabled={isRunning}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Concurrency</label>
                                <input
                                    type="number"
                                    value={config.initialConcurrency}
                                    onChange={(e) => setConfig(prev => ({ ...prev, initialConcurrency: parseInt(e.target.value) || 1 }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    disabled={isRunning}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Max Concurrency</label>
                                <input
                                    type="number"
                                    value={config.maxConcurrency}
                                    onChange={(e) => setConfig(prev => ({ ...prev, maxConcurrency: parseInt(e.target.value) || 10 }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    disabled={isRunning}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Requests per Batch</label>
                                <input
                                    type="number"
                                    value={config.requestsPerBatch}
                                    onChange={(e) => setConfig(prev => ({ ...prev, requestsPerBatch: parseInt(e.target.value) || 5 }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    disabled={isRunning}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Batch Delay (ms)</label>
                                <input
                                    type="number"
                                    value={config.batchDelay}
                                    onChange={(e) => setConfig(prev => ({ ...prev, batchDelay: parseInt(e.target.value) || 2000 }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    min="500"
                                    step="500"
                                    disabled={isRunning}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={startTest}
                            disabled={isRunning || !apiUrl.trim()}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            <Play size={20} />
                            Start Test
                        </button>

                        <button
                            onClick={stopTest}
                            disabled={!isRunning}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            <Square size={20} />
                            Stop Test
                        </button>

                        <button
                            onClick={exportResults}
                            disabled={!summary}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            <Download size={20} />
                            Export Results
                        </button>
                    </div>

                    {isRunning && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-2 text-blue-800">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-b-transparent"></div>
                                <span>Running batch {currentBatchRef.current}... ({metrics.length} requests completed)</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Stats */}
                {summary && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Summary</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="text-green-600" size={20} />
                                    <h3 className="font-medium text-gray-700">Total Requests</h3>
                                </div>
                                <p className="text-2xl font-bold text-green-600">{summary.totalRequests}</p>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <BarChart3 className="text-blue-600" size={20} />
                                    <h3 className="font-medium text-gray-700">Success Rate</h3>
                                </div>
                                <p className="text-2xl font-bold text-blue-600">{summary.successRate}%</p>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="text-purple-600" size={20} />
                                    <h3 className="font-medium text-gray-700">Avg Response</h3>
                                </div>
                                <p className="text-2xl font-bold text-purple-600">{summary.avgResponseTime}ms</p>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="text-yellow-600" size={20} />
                                    <h3 className="font-medium text-gray-700">P95 Response</h3>
                                </div>
                                <p className="text-2xl font-bold text-yellow-600">{summary.p95}ms</p>
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="text-red-600" size={20} />
                                    <h3 className="font-medium text-gray-700">Max Response</h3>
                                </div>
                                <p className="text-2xl font-bold text-red-600">{summary.maxResponseTime}ms</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="text-gray-600" size={20} />
                                    <h3 className="font-medium text-gray-700">Failed</h3>
                                </div>
                                <p className="text-2xl font-bold text-gray-600">{summary.failedRequests}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Results */}
                {metrics.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Results</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 px-3">Batch</th>
                                        <th className="text-left py-2 px-3">Request</th>
                                        <th className="text-left py-2 px-3">Status</th>
                                        <th className="text-left py-2 px-3">Response Time</th>
                                        <th className="text-left py-2 px-3">Start Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getRecentMetrics().map((metric, index) => (
                                        <tr key={`${metric.batchNumber}-${metric.requestNumber}`} className="border-b border-gray-100">
                                            <td className="py-2 px-3">{metric.batchNumber}</td>
                                            <td className="py-2 px-3">{metric.requestNumber}</td>
                                            <td className="py-2 px-3">
                                                <span className={`px-2 py-1 rounded-full text-xs ${metric.success
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {metric.status || 'Error'}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3 font-mono">{metric.responseTime.toFixed(2)}ms</td>
                                            <td className="py-2 px-3 font-mono text-xs">
                                                {new Date(metric.startTime + Date.now() - performance.now()).toLocaleTimeString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {metrics.length > 10 && (
                            <p className="text-sm text-gray-500 mt-2">
                                Showing last 10 of {metrics.length} total requests
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiLoadTester;