import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiSettings, FiList, FiSend, FiAlertTriangle, FiCheckCircle, FiEye, FiClock } from 'react-icons/fi';
import { base_url } from '../../../utils/constants';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmailStats from '../../components/dashboard/EmailStats';
import ActiveConfigCard from '../../components/dashboard/ActiveConfigCard';
import ActiveTemplateCard from '../../components/dashboard/ActiveTemplateCard';
import RecentEmailsCard from '../../components/dashboard/RecentEmailsCard';

const MailDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSent: 0,
        openRate: 0,
        clickRate: 0
    });
    const [activeConfig, setActiveConfig] = useState(null);
    const [activeTemplate, setActiveTemplate] = useState(null);
    const [recentEmails, setRecentEmails] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Fetch email stats data
                const logsResponse = await axios.get(`${base_url}/recommendations/logs?limit=5`);
                const recentLogs = logsResponse.data.data || [];
                setRecentEmails(recentLogs);

                // Calculate stats from all logs
                const totalSent = logsResponse.data.pagination?.total || 0;
                const openedCount = recentLogs.filter(log => log.status === 'opened' || log.status === 'clicked').length;
                const clickedCount = recentLogs.filter(log => log.status === 'clicked').length;

                setStats({
                    totalSent,
                    openRate: totalSent > 0 ? Math.round((openedCount / totalSent) * 100) : 0,
                    clickRate: totalSent > 0 ? Math.round((clickedCount / totalSent) * 100) : 0
                });

                // Fetch active config
                const configResponse = await axios.get(`${base_url}/email-config/active`);
                setActiveConfig(configResponse.data.data);

                // Fetch active template
                const templateResponse = await axios.get(`${base_url}/email-templates/active`);
                setActiveTemplate(templateResponse.data.data);

                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const triggerRecommendationJob = async () => {
        try {
            await axios.post(`${base_url}/recommendations/trigger`);
            alert('Recommendation email job triggered successfully');
        } catch (error) {
            console.error('Error triggering recommendation job:', error);
            alert('Failed to trigger recommendation job');
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Email Dashboard</h1>
                <button
                    onClick={triggerRecommendationJob}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out flex items-center"
                >
                    <FiSend className="mr-2" />
                    Send Recommendations Now
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FiAlertTriangle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Emails Sent"
                    value={stats.totalSent}
                    icon={<FiMail className="h-6 w-6 text-blue-600" />}
                    linkTo="/email-logs"
                />
                <StatCard
                    title="Open Rate"
                    value={`${stats.openRate}%`}
                    icon={<FiEye className="h-6 w-6 text-green-600" />}
                    linkTo="/email-logs"
                />
                <StatCard
                    title="Click Rate"
                    value={`${stats.clickRate}%`}
                    icon={<FiCheckCircle className="h-6 w-6 text-purple-600" />}
                    linkTo="/email-logs"
                />
            </div>

            {/* Email Stats Chart */}
            <EmailStats emails={recentEmails} />

            {/* Configuration and Templates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActiveConfigCard config={activeConfig} />
                <ActiveTemplateCard template={activeTemplate} />
            </div>

            {/* Recent Emails */}
            <RecentEmailsCard emails={recentEmails} />
        </div>
    );
};

export default MailDashboard;