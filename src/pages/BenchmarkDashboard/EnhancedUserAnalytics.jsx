import React, { useState, useEffect } from 'react';
import { Users, Activity, Clock, Eye, TrendingUp, Globe, Server, AlertCircle, MapPin, Calendar, BarChart3, PieChart, Target, Zap, UserCheck, Router, Smartphone, Monitor, Navigation } from 'lucide-react';
import { base_url } from '../../../utils/base_url';

const EnhancedUserAnalytics = () => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({});
    const [userProfiles, setUserProfiles] = useState([]);
    const [userJourneys, setUserJourneys] = useState({});
    const [behaviorMetrics, setBehaviorMetrics] = useState({});
    const [locationData, setLocationData] = useState([]);
    const [deviceData, setDeviceData] = useState([]);
    const [timePatterns, setTimePatterns] = useState({});
    const [userSegments, setUserSegments] = useState({});
    const [filters, setFilters] = useState({
        endpoint: '',
        userId: '',
        status: '',
        timeRange: '24h',
        limit: 100
    });
    const [activeTab, setActiveTab] = useState('live');
    const [isLoading, setIsLoading] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);

    const API_BASE_URL = base_url;

    // Fetch comprehensive user data
    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            // Fetch API logs
            const params = new URLSearchParams();
            if (filters.endpoint) params.append('endpoint', filters.endpoint);
            if (filters.userId) params.append('userId', filters.userId);
            if (filters.status) params.append('status', filters.status);
            params.append('limit', filters.limit);

            const [logsResponse, statsResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/api/benchmark/logs?${params}`),
                fetch(`${API_BASE_URL}/api/benchmark/stats`)
            ]);

            const logsData = await logsResponse.json();
            const statsData = await statsResponse.json();

            setLogs(logsData);
            setStats(statsData);

            // Process user analytics
            processUserAnalytics(logsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsLoading(false);
    };

    // Process comprehensive user analytics
    const processUserAnalytics = (logs) => {
        const userMap = new Map();
        const journeyMap = new Map();
        const locationMap = new Map();
        const deviceMap = new Map();
        const hourlyActivity = new Array(24).fill(0);
        const dailyActivity = {};

        logs.forEach(log => {
            const timestamp = new Date(log.timestamp);
            const hour = timestamp.getHours();
            const date = timestamp.toDateString();

            // Hourly patterns
            hourlyActivity[hour]++;

            // Daily patterns
            dailyActivity[date] = (dailyActivity[date] || 0) + 1;

            if (log.userId && log.userId._id) {
                const userId = log.userId._id;

                // User profile data
                if (!userMap.has(userId)) {
                    userMap.set(userId, {
                        id: userId,
                        name: log.userId.name || 'Unknown',
                        email: log.userId.email || '',
                        phone: log.userId.phone || '',
                        firstSeen: timestamp,
                        lastSeen: timestamp,
                        totalSessions: 0,
                        totalRequests: 0,
                        totalResponseTime: 0,
                        successfulRequests: 0,
                        errorRequests: 0,
                        uniqueEndpoints: new Set(),
                        preferredMethods: {},
                        activityPattern: new Array(24).fill(0),
                        userAgent: '',
                        location: '',
                        deviceType: '',
                        browser: ''
                    });
                }

                const user = userMap.get(userId);

                // Update user metrics
                user.lastSeen = timestamp > user.lastSeen ? timestamp : user.lastSeen;
                user.totalRequests++;
                user.totalResponseTime += log.responseTime || 0;
                user.uniqueEndpoints.add(log.route);
                user.preferredMethods[log.method] = (user.preferredMethods[log.method] || 0) + 1;
                user.activityPattern[hour]++;

                if (log.status === 'Success') user.successfulRequests++;
                else user.errorRequests++;

                // User journey tracking
                if (!journeyMap.has(userId)) {
                    journeyMap.set(userId, []);
                }
                journeyMap.get(userId).push({
                    route: log.route,
                    method: log.method,
                    timestamp: timestamp,
                    responseTime: log.responseTime,
                    status: log.status,
                    statusCode: log.statusCode
                });

                // Extract location and device info (if available in userAgent)
                if (log.userAgent) {
                    user.userAgent = log.userAgent;
                    const deviceInfo = parseUserAgent(log.userAgent);
                    user.browser = deviceInfo.browser;
                    user.deviceType = deviceInfo.deviceType;

                    deviceMap.set(deviceInfo.deviceType, (deviceMap.get(deviceInfo.deviceType) || 0) + 1);
                }

                if (log.ip) {
                    // Mock location based on IP (in real implementation, use IP geolocation service)
                    const location = getLocationFromIP(log.ip);
                    user.location = location;
                    locationMap.set(location, (locationMap.get(location) || 0) + 1);
                }
            }
        });

        // Convert maps to arrays and calculate derived metrics
        const profiles = Array.from(userMap.values()).map(user => ({
            ...user,
            uniqueEndpoints: user.uniqueEndpoints.size,
            avgResponseTime: Math.round(user.totalResponseTime / user.totalRequests),
            successRate: Math.round((user.successfulRequests / user.totalRequests) * 100),
            sessionDuration: Math.round((user.lastSeen - user.firstSeen) / 1000 / 60), // minutes
            topMethod: Object.keys(user.preferredMethods).reduce((a, b) =>
                user.preferredMethods[a] > user.preferredMethods[b] ? a : b, 'GET'),
            isActive: (Date.now() - user.lastSeen.getTime()) < 300000 // 5 minutes
        }));

        // User segmentation
        const segments = {
            power_users: profiles.filter(u => u.totalRequests > 50).length,
            regular_users: profiles.filter(u => u.totalRequests >= 10 && u.totalRequests <= 50).length,
            light_users: profiles.filter(u => u.totalRequests < 10).length,
            active_now: profiles.filter(u => u.isActive).length,
            high_performers: profiles.filter(u => u.avgResponseTime < 200).length,
            error_prone: profiles.filter(u => u.successRate < 80).length
        };

        // Behavior metrics
        const behavior = {
            avgSessionDuration: Math.round(profiles.reduce((acc, u) => acc + u.sessionDuration, 0) / profiles.length),
            avgRequestsPerUser: Math.round(profiles.reduce((acc, u) => acc + u.totalRequests, 0) / profiles.length),
            mostActiveHour: hourlyActivity.indexOf(Math.max(...hourlyActivity)),
            peakActivityTime: `${hourlyActivity.indexOf(Math.max(...hourlyActivity))}:00`,
            userRetentionRate: Math.round((profiles.filter(u => u.totalRequests > 1).length / profiles.length) * 100),
            bounceRate: Math.round((profiles.filter(u => u.totalRequests === 1).length / profiles.length) * 100)
        };

        setUserProfiles(profiles.sort((a, b) => b.lastSeen - a.lastSeen));
        setUserJourneys(Object.fromEntries(journeyMap));
        setBehaviorMetrics(behavior);
        setLocationData(Array.from(locationMap.entries()).map(([location, count]) => ({ location, count })));
        setDeviceData(Array.from(deviceMap.entries()).map(([device, count]) => ({ device, count })));
        setTimePatterns({ hourly: hourlyActivity, daily: dailyActivity });
        setUserSegments(segments);
    };

    // Parse user agent for device info
    const parseUserAgent = (userAgent) => {
        const ua = userAgent.toLowerCase();
        let browser = 'Unknown';
        let deviceType = 'Desktop';

        if (ua.includes('chrome')) browser = 'Chrome';
        else if (ua.includes('firefox')) browser = 'Firefox';
        else if (ua.includes('safari')) browser = 'Safari';
        else if (ua.includes('edge')) browser = 'Edge';

        if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) deviceType = 'Mobile';
        else if (ua.includes('tablet') || ua.includes('ipad')) deviceType = 'Tablet';

        return { browser, deviceType };
    };

    // Mock location from IP
    const getLocationFromIP = (ip) => {
        const locations = ['New York', 'London', 'Tokyo', 'Sydney', 'Berlin', 'Mumbai', 'Toronto', 'Paris'];
        return locations[Math.floor(Math.random() * locations.length)];
    };

    const formatTimeAgo = (timestamp) => {
        const now = Date.now();
        const time = new Date(timestamp).getTime();
        const diffInSeconds = Math.floor((now - time) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    useEffect(() => {
        fetchUserData();
    }, [filters]);

    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(fetchUserData, 5000);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, filters]);

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
        >
            <Icon size={18} />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <Users className="text-blue-600" size={36} />
                        Advanced User Analytics
                    </h1>
                    <p className="text-gray-600">Comprehensive user behavior analysis and insights</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    <TabButton id="live" label="Live Activity" icon={Eye} />
                    <TabButton id="profiles" label="User Profiles" icon={Users} />
                    <TabButton id="journeys" label="User Journeys" icon={Navigation} />
                    <TabButton id="behavior" label="Behavior Analysis" icon={BarChart3} />
                    <TabButton id="demographics" label="Demographics" icon={Globe} />
                    <TabButton id="performance" label="Performance" icon={Zap} />
                </div>

                {/* User Segments Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-green-500">
                        <h3 className="text-xs font-medium text-gray-500 mb-1">Active Now</h3>
                        <p className="text-2xl font-bold text-green-600">{userSegments.active_now || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-500">
                        <h3 className="text-xs font-medium text-gray-500 mb-1">Power Users</h3>
                        <p className="text-2xl font-bold text-blue-600">{userSegments.power_users || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-purple-500">
                        <h3 className="text-xs font-medium text-gray-500 mb-1">Regular Users</h3>
                        <p className="text-2xl font-bold text-purple-600">{userSegments.regular_users || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-orange-500">
                        <h3 className="text-xs font-medium text-gray-500 mb-1">Light Users</h3>
                        <p className="text-2xl font-bold text-orange-600">{userSegments.light_users || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-red-500">
                        <h3 className="text-xs font-medium text-gray-500 mb-1">Error Prone</h3>
                        <p className="text-2xl font-bold text-red-600">{userSegments.error_prone || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-indigo-500">
                        <h3 className="text-xs font-medium text-gray-500 mb-1">High Performers</h3>
                        <p className="text-2xl font-bold text-indigo-600">{userSegments.high_performers || 0}</p>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'live' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Eye className="text-green-500" />
                                Live User Activity
                            </h3>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {userProfiles.filter(u => u.isActive).map(user => (
                                    <div key={user.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{user.name}</h4>
                                            <p className="text-sm text-gray-600">{formatTimeAgo(user.lastSeen)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{user.totalRequests} requests</p>
                                            <p className="text-xs text-gray-500">{user.avgResponseTime}ms avg</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <BarChart3 className="text-blue-500" />
                                Activity Heatmap (24h)
                            </h3>
                            <div className="grid grid-cols-12 gap-1">
                                {timePatterns.hourly && timePatterns.hourly.map((count, hour) => (
                                    <div
                                        key={hour}
                                        className={`h-8 rounded flex items-center justify-center text-xs font-medium ${count > Math.max(...timePatterns.hourly) * 0.7 ? 'bg-blue-500 text-white' :
                                                count > Math.max(...timePatterns.hourly) * 0.4 ? 'bg-blue-300 text-white' :
                                                    count > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'
                                            }`}
                                        title={`${hour}:00 - ${count} requests`}
                                    >
                                        {hour}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600">
                                    Peak activity: <span className="font-semibold">{behaviorMetrics.peakActivityTime}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'profiles' && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Users className="text-purple-500" />
                                Detailed User Profiles ({userProfiles.length})
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requests</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Response</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endpoints</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Seen</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {userProfiles.slice(0, 20).map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {user.isActive ? '🟢 Active' : '⚫ Offline'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-semibold">{user.totalRequests}</td>
                                            <td className="px-4 py-4">
                                                <span className={`text-sm font-semibold ${user.successRate > 95 ? 'text-green-600' :
                                                        user.successRate > 80 ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                    {user.successRate}%
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-semibold">{user.avgResponseTime}ms</td>
                                            <td className="px-4 py-4 text-sm">{user.uniqueEndpoints}</td>
                                            <td className="px-4 py-4 text-sm">{user.location || 'Unknown'}</td>
                                            <td className="px-4 py-4 text-sm">{user.deviceType}</td>
                                            <td className="px-4 py-4 text-sm text-gray-500">{formatTimeAgo(user.lastSeen)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'behavior' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Target className="text-orange-500" />
                                Behavior Metrics
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Avg Session Duration</span>
                                    <span className="font-semibold">{behaviorMetrics.avgSessionDuration || 0}m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Requests per User</span>
                                    <span className="font-semibold">{behaviorMetrics.avgRequestsPerUser || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Retention Rate</span>
                                    <span className="font-semibold text-green-600">{behaviorMetrics.userRetentionRate || 0}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Bounce Rate</span>
                                    <span className="font-semibold text-red-600">{behaviorMetrics.bounceRate || 0}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <MapPin className="text-blue-500" />
                                Geographic Distribution
                            </h3>
                            <div className="space-y-3">
                                {locationData.slice(0, 5).map(({ location, count }) => (
                                    <div key={location} className="flex items-center justify-between">
                                        <span className="text-gray-600">{location}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{ width: `${(count / Math.max(...locationData.map(l => l.count))) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-semibold w-8">{count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Smartphone className="text-purple-500" />
                                Device Analytics
                            </h3>
                            <div className="space-y-3">
                                {deviceData.map(({ device, count }) => (
                                    <div key={device} className="flex items-center justify-between">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            {device === 'Mobile' ? <Smartphone size={16} /> : <Monitor size={16} />}
                                            {device}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-purple-500 h-2 rounded-full"
                                                    style={{ width: `${(count / Math.max(...deviceData.map(d => d.count))) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-semibold w-8">{count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'journeys' && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Navigation className="text-indigo-500" />
                            User Journey Analysis
                        </h3>
                        <div className="grid gap-6">
                            {Object.entries(userJourneys).slice(0, 5).map(([userId, journey]) => {
                                const user = userProfiles.find(u => u.id === userId);
                                return (
                                    <div key={userId} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-gray-900">
                                                {user?.name || 'User'} Journey
                                            </h4>
                                            <span className="text-sm text-gray-500">
                                                {journey.length} steps
                                            </span>
                                        </div>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {journey.slice(0, 10).map((step, index) => (
                                                <div key={index} className="flex items-center gap-1 min-w-fit">
                                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${step.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {step.method} {step.route.split('/').pop()}
                                                    </div>
                                                    {index < journey.length - 1 && (
                                                        <div className="w-2 h-0.5 bg-gray-300"></div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-4">
                            <select
                                value={filters.timeRange}
                                onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="1h">Last Hour</option>
                                <option value="24h">Last 24 Hours</option>
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Search user..."
                                value={filters.userId}
                                onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setAutoRefresh(!autoRefresh)}
                                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${autoRefresh
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                            >
                                {autoRefresh ? '🟢' : '🔴'} Auto-refresh
                            </button>

                            <button
                                onClick={fetchUserData}
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                            >
                                <Activity size={16} />
                                {isLoading ? 'Loading...' : 'Refresh'}
                            </button>

                            <button
                                onClick={() => {
                                    // Export user data functionality
                                    const dataStr = JSON.stringify(userProfiles, null, 2);
                                    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
                                    const exportFileDefaultName = `user-analytics-${new Date().toISOString().split('T')[0]}.json`;
                                    const linkElement = document.createElement('a');
                                    linkElement.setAttribute('href', dataUri);
                                    linkElement.setAttribute('download', exportFileDefaultName);
                                    linkElement.click();
                                }}
                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 flex items-center gap-2"
                            >
                                📊 Export Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Insights Section */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="text-green-500" />
                            Growth Insights
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">New Users Today</span>
                                <span className="font-semibold text-green-600">
                                    +{userProfiles.filter(u =>
                                        new Date(u.firstSeen).toDateString() === new Date().toDateString()
                                    ).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Returning Users</span>
                                <span className="font-semibold text-blue-600">
                                    {userProfiles.filter(u => u.totalRequests > 5).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">User Growth Rate</span>
                                <span className="font-semibold text-purple-600">
                                    {Math.round((userProfiles.length / Math.max(userProfiles.length - 5, 1)) * 100 - 100)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <AlertCircle className="text-orange-500" />
                            Quality Metrics
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">API Health Score</span>
                                <span className="font-semibold text-green-600">
                                    {Math.round((stats.successRequests / Math.max(stats.totalRequests, 1)) * 100)}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">User Satisfaction</span>
                                <span className="font-semibold text-blue-600">
                                    {userProfiles.filter(u => u.successRate > 95).length}/{userProfiles.length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Problem Users</span>
                                <span className="font-semibold text-red-600">
                                    {userProfiles.filter(u => u.successRate < 80).length}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Zap className="text-purple-500" />
                            Performance Insights
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Fastest User</span>
                                <span className="font-semibold text-green-600">
                                    {Math.min(...userProfiles.map(u => u.avgResponseTime))}ms
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Slowest User</span>
                                <span className="font-semibold text-red-600">
                                    {Math.max(...userProfiles.map(u => u.avgResponseTime))}ms
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Performance Tier</span>
                                <span className="font-semibold text-blue-600">
                                    {behaviorMetrics.avgRequestsPerUser > 20 ? 'High Load' :
                                        behaviorMetrics.avgRequestsPerUser > 10 ? 'Medium Load' : 'Light Load'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Real-time Activity Feed */}
                {activeTab === 'live' && (
                    <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Activity className="text-red-500" />
                            Live Activity Stream
                        </h3>
                        <div className="max-h-64 overflow-y-auto space-y-2">
                            {logs.slice(0, 10).map((log, index) => (
                                <div key={log._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <div className="flex-1">
                                        <span className="font-medium">{log.userId?.name || 'Anonymous'}</span>
                                        <span className="text-gray-600 mx-2">•</span>
                                        <span className="text-sm text-gray-600">{log.method} {log.route}</span>
                                    </div>
                                    <div className="text-right text-sm text-gray-500">
                                        {formatTimeAgo(log.timestamp)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnhancedUserAnalytics;