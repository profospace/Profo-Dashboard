import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiRefreshCw, FiSend, FiAlertTriangle, FiFilter } from 'react-icons/fi';
import { base_url } from '../../../utils/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PageHeader from '../../components/ui/PageHeader';
import EmailLogTable from '../../components/email-logs/EmailLogTable';
import EmailLogFilters from '../../components/email-logs/EmailLogFilters';
import EmailMetrics from '../../components/email-logs/EmailMetrics';
import Pagination from '../../components/ui/Pagination';

const EmailLogs = () => {
    const [emailLogs, setEmailLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');
    const [metrics, setMetrics] = useState({
        totalSent: 0,
        opened: 0,
        clicked: 0,
        failed: 0,
        openRate: 0,
        clickRate: 0
    });

    useEffect(() => {
        fetchEmailLogs();
    }, [page, statusFilter]);

    const fetchEmailLogs = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.get(
                `${base_url}/recommendations/logs?page=${page}&limit=10${statusFilter ? `&status=${statusFilter}` : ''}`
            );

            setEmailLogs(response.data.data || []);
            setTotal(response.data.pagination?.total || 0);

            // Calculate metrics
            if (response.data.data) {
                const logs = response.data.data;
                const totalCount = response.data.pagination?.total || logs.length;
                const openedCount = logs.filter(log => log.status === 'opened' || log.status === 'clicked').length;
                const clickedCount = logs.filter(log => log.status === 'clicked').length;
                const failedCount = logs.filter(log => log.status === 'failed').length;

                setMetrics({
                    totalSent: totalCount,
                    opened: openedCount,
                    clicked: clickedCount,
                    failed: failedCount,
                    openRate: totalCount > 0 ? Math.round((openedCount / totalCount) * 100) : 0,
                    clickRate: totalCount > 0 ? Math.round((clickedCount / totalCount) * 100) : 0
                });
            }
        } catch (error) {
            console.error('Error fetching email logs:', error);
            setError(error.response?.data?.error || 'Failed to fetch email logs');
            toast.error('Failed to fetch email logs');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchEmailLogs();
    };

    const handleFilterChange = (filter) => {
        setStatusFilter(filter);
        setPage(1); // Reset to page 1 when filter changes
    };

    const triggerRecommendationJob = async () => {
        try {
            await axios.post(`${base_url}/recommendations/trigger`);
            toast.success('Recommendation email job triggered');

            // Refresh logs after a delay
            setTimeout(() => {
                fetchEmailLogs();
            }, 2000);
        } catch (error) {
            console.error('Error triggering recommendation job:', error);
            toast.error('Failed to trigger recommendation job');
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Email Logs"
                description="Track and monitor all sent recommendation emails"
            />

            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                <div className="flex space-x-2">
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-md transition duration-150 ease-in-out"
                    >
                        <FiRefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </button>

                    <EmailLogFilters
                        currentFilter={statusFilter}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                <button
                    onClick={triggerRecommendationJob}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center self-start md:self-auto"
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

            <EmailMetrics metrics={metrics} />

            {isLoading && !isRefreshing ? (
                <LoadingSpinner />
            ) : emailLogs.length === 0 ? (
                <div className="bg-white shadow-sm rounded-lg p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Email Logs Found</h3>
                    <p className="text-gray-500 mb-4">
                        {statusFilter
                            ? `No emails with status "${statusFilter}" found.`
                            : "No emails have been sent yet."}
                    </p>
                    <button
                        onClick={triggerRecommendationJob}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center mx-auto"
                    >
                        <FiSend className="mr-2" />
                        Send Recommendations Now
                    </button>
                </div>
            ) : (
                <>
                    <EmailLogTable emailLogs={emailLogs} />

                    <Pagination
                        currentPage={page}
                        totalPages={Math.ceil(total / 10)}
                        onPageChange={setPage}
                        totalItems={total}
                        itemsPerPage={10}
                    />
                </>
            )}
        </div>
    );
};

export default EmailLogs;