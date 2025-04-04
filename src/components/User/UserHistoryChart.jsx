// import React, { useMemo } from 'react';
// import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// const UserHistoryChart = ({ historyType, historyData }) => {
//     // Process data for charts
//     const chartData = useMemo(() => {
//         if (!historyData || historyData.length === 0) {
//             return [];
//         }

//         switch (historyType) {
//             case 'viewed':
//             case 'contacted':
//             case 'search':
//                 // Group by date for timeline charts
//                 const dateGroups = {};
//                 historyData?.forEach(item => {
//                     const timestamp = item.timestamp || '';
//                     if (!timestamp) return;

//                     const date = new Date(timestamp).toLocaleDateString();
//                     dateGroups[date] = dateGroups[date] || {
//                         date,
//                         count: 0,
//                         items: []
//                     };
//                     dateGroups[date].count += 1;
//                     dateGroups[date].items.push(item);
//                 });

//                 return Object.values(dateGroups).sort((a, b) =>
//                     new Date(a.date) - new Date(b.date)
//                 );

//             case 'liked':
//                 // Group by date for timeline charts
//                 const likedDateGroups = {};
//                 historyData.forEach(item => {
//                     const timestamp = item.savedAt || '';
//                     if (!timestamp) return;

//                     const date = new Date(timestamp).toLocaleDateString();
//                     likedDateGroups[date] = likedDateGroups[date] || {
//                         date,
//                         count: 0,
//                         items: []
//                     };
//                     likedDateGroups[date].count += 1;
//                     likedDateGroups[date].items.push(item);
//                 });

//                 return Object.values(likedDateGroups).sort((a, b) =>
//                     new Date(a.date) - new Date(b.date)
//                 );

//             default:
//                 return [];
//         }
//     }, [historyType, historyData]);

//     // Additional data for pie charts
//     const pieData = useMemo(() => {
//         if (!historyData || historyData.length === 0) {
//             return [];
//         }

//         switch (historyType) {
//             case 'contacted':
//                 // Group by contact type
//                 const contactTypeGroups = {};
//                 historyData.forEach(item => {
//                     const contactType = item.contactType || 'UNKNOWN';
//                     contactTypeGroups[contactType] = contactTypeGroups[contactType] || {
//                         name: contactType,
//                         value: 0
//                     };
//                     contactTypeGroups[contactType].value += 1;
//                 });

//                 return Object.values(contactTypeGroups);

//             case 'liked':
//                 // Group by entity type
//                 const entityTypeGroups = {};
//                 historyData.forEach(item => {
//                     const entityType = item.entityType || 'property';
//                     entityTypeGroups[entityType] = entityTypeGroups[entityType] || {
//                         name: entityType,
//                         value: 0
//                     };
//                     entityTypeGroups[entityType].value += 1;
//                 });

//                 return Object.values(entityTypeGroups);

//             default:
//                 return [];
//         }
//     }, [historyType, historyData]);

//     // Chart colors
//     const colors = {
//         viewed: ["#4F46E5", "#818CF8"],
//         liked: ["#DB2777", "#F472B6"],
//         contacted: ["#059669", "#34D399"],
//         search: ["#7C3AED", "#A78BFA"]
//     };

//     // COLORS array for pie chart
//     const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

//     // Get title based on history type
//     const getChartTitle = () => {
//         switch (historyType) {
//             case 'viewed':
//                 return 'Property Views Over Time';
//             case 'liked':
//                 return 'Liked Properties Over Time';
//             case 'contacted':
//                 return 'Property Contacts Over Time';
//             case 'search':
//                 return 'Searches Performed Over Time';
//             default:
//                 return 'Activity Timeline';
//         }
//     };

//     // Get secondary chart title based on history type
//     const getSecondaryChartTitle = () => {
//         switch (historyType) {
//             case 'contacted':
//                 return 'Contact Methods Distribution';
//             case 'liked':
//                 return 'Entity Types Distribution';
//             default:
//                 return null;
//         }
//     };

//     // Custom tooltip for charts
//     const CustomTooltip = ({ active, payload, label }) => {
//         if (active && payload && payload.length) {
//             return (
//                 <div className="bg-white p-4 border border-gray-200 rounded shadow-lg">
//                     <p className="font-medium text-gray-700">{label}</p>
//                     <p className="text-sm">
//                         <span className="font-medium" style={{ color: payload[0].color }}>
//                             Count:
//                         </span>{' '}
//                         {payload[0].value}
//                     </p>
//                 </div>
//             );
//         }
//         return null;
//     };

//     // If no data, show empty state
//     if (chartData.length === 0) {
//         return (
//             <div className="bg-white p-10 rounded-lg shadow text-center">
//                 <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                 </svg>
//                 <h3 className="mt-4 text-lg font-medium text-gray-900">No chart data available</h3>
//                 <p className="mt-1 text-gray-500">There is no history data to display for the selected time period.</p>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             {/* Main timeline chart */}
//             <div className="bg-white p-6 rounded-lg shadow">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">{getChartTitle()}</h3>
//                 <div className="h-72">
//                     <ResponsiveContainer width="100%" height="100%">
//                         <BarChart
//                             data={chartData}
//                             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                         >
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="date" />
//                             <YAxis />
//                             <Tooltip content={<CustomTooltip />} />
//                             <Legend />
//                             <Bar dataKey="count" name="Count" fill={colors[historyType][0]} />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>

//             {/* Secondary chart - only for contacted and liked */}
//             {(historyType === 'contacted' || historyType === 'liked') && pieData.length > 0 && (
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h3 className="text-lg font-medium text-gray-900 mb-4">{getSecondaryChartTitle()}</h3>
//                     <div className="h-72 flex items-center justify-center">
//                         <ResponsiveContainer width="100%" height="100%">
//                             <PieChart>
//                                 <Pie
//                                     data={pieData}
//                                     cx="50%"
//                                     cy="50%"
//                                     labelLine={true}
//                                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                                     outerRadius={80}
//                                     fill="#8884d8"
//                                     dataKey="value"
//                                 >
//                                     {pieData.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip />
//                                 <Legend />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>
//             )}

//             {/* Activity trend line chart */}
//             {chartData.length > 1 && (
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Trend</h3>
//                     <div className="h-72">
//                         <ResponsiveContainer width="100%" height="100%">
//                             <LineChart
//                                 data={chartData}
//                                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                             >
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="date" />
//                                 <YAxis />
//                                 <Tooltip content={<CustomTooltip />} />
//                                 <Legend />
//                                 <Line
//                                     type="monotone"
//                                     dataKey="count"
//                                     name="Activity"
//                                     stroke={colors[historyType][1]}
//                                     activeDot={{ r: 8 }}
//                                 />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UserHistoryChart;



import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const UserHistoryChart = ({ historyType, historyData }) => {
    // Process data for charts
    const chartData = useMemo(() => {
        // Ensure historyData is an array
        if (!historyData || !Array.isArray(historyData) || historyData.length === 0) {
            return [];
        }

        switch (historyType) {
            case 'viewed':
            case 'contacted':
            case 'search':
                // Group by date for timeline charts
                const dateGroups = {};
                historyData.forEach(item => {
                    const timestamp = item.timestamp || '';
                    if (!timestamp) return;

                    const date = new Date(timestamp).toLocaleDateString();
                    dateGroups[date] = dateGroups[date] || {
                        date,
                        count: 0,
                        items: []
                    };
                    dateGroups[date].count += 1;
                    dateGroups[date].items.push(item);
                });

                return Object.values(dateGroups).sort((a, b) =>
                    new Date(a.date) - new Date(b.date)
                );

            case 'liked':
                // Group by date for timeline charts
                const likedDateGroups = {};
                historyData.forEach(item => {
                    const timestamp = item.savedAt || '';
                    if (!timestamp) return;

                    const date = new Date(timestamp).toLocaleDateString();
                    likedDateGroups[date] = likedDateGroups[date] || {
                        date,
                        count: 0,
                        items: []
                    };
                    likedDateGroups[date].count += 1;
                    likedDateGroups[date].items.push(item);
                });

                return Object.values(likedDateGroups).sort((a, b) =>
                    new Date(a.date) - new Date(b.date)
                );

            default:
                return [];
        }
    }, [historyType, historyData]);

    // Additional data for pie charts
    const pieData = useMemo(() => {
        // Ensure historyData is an array
        if (!historyData || !Array.isArray(historyData) || historyData.length === 0) {
            return [];
        }

        switch (historyType) {
            case 'contacted':
                // Group by contact type
                const contactTypeGroups = {};
                historyData.forEach(item => {
                    const contactType = item.contactType || 'UNKNOWN';
                    contactTypeGroups[contactType] = contactTypeGroups[contactType] || {
                        name: contactType,
                        value: 0
                    };
                    contactTypeGroups[contactType].value += 1;
                });

                return Object.values(contactTypeGroups);

            case 'liked':
                // Group by entity type
                const entityTypeGroups = {};
                historyData.forEach(item => {
                    const entityType = item.entityType || 'property';
                    entityTypeGroups[entityType] = entityTypeGroups[entityType] || {
                        name: entityType,
                        value: 0
                    };
                    entityTypeGroups[entityType].value += 1;
                });

                return Object.values(entityTypeGroups);

            default:
                return [];
        }
    }, [historyType, historyData]);

    // Chart colors
    const colors = {
        viewed: ["#4F46E5", "#818CF8"],
        liked: ["#DB2777", "#F472B6"],
        contacted: ["#059669", "#34D399"],
        search: ["#7C3AED", "#A78BFA"]
    };

    // COLORS array for pie chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    // Get title based on history type
    const getChartTitle = () => {
        switch (historyType) {
            case 'viewed':
                return 'Property Views Over Time';
            case 'liked':
                return 'Liked Properties Over Time';
            case 'contacted':
                return 'Property Contacts Over Time';
            case 'search':
                return 'Searches Performed Over Time';
            default:
                return 'Activity Timeline';
        }
    };

    // Get secondary chart title based on history type
    const getSecondaryChartTitle = () => {
        switch (historyType) {
            case 'contacted':
                return 'Contact Methods Distribution';
            case 'liked':
                return 'Entity Types Distribution';
            default:
                return null;
        }
    };

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-200 rounded shadow-lg">
                    <p className="font-medium text-gray-700">{label}</p>
                    <p className="text-sm">
                        <span className="font-medium" style={{ color: payload[0].color }}>
                            Count:
                        </span>{' '}
                        {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    // If no data, show empty state
    if (chartData.length === 0) {
        return (
            <div className="bg-white p-10 rounded-lg shadow text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No chart data available</h3>
                <p className="mt-1 text-gray-500">There is no history data to display for the selected time period.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Main timeline chart */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{getChartTitle()}</h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="count" name="Count" fill={colors[historyType][0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Secondary chart - only for contacted and liked */}
            {(historyType === 'contacted' || historyType === 'liked') && pieData.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{getSecondaryChartTitle()}</h3>
                    <div className="h-72 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Activity trend line chart */}
            {chartData.length > 1 && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Trend</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    name="Activity"
                                    stroke={colors[historyType][1]}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserHistoryChart;
