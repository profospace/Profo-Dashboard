import React from 'react';

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Properties Overview</h2>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Properties</span>
                        <span className="text-2xl font-bold">24</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Projects Overview</h2>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Active Projects</span>
                        <span className="text-2xl font-bold">8</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Leads Overview</h2>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">New Leads</span>
                        <span className="text-2xl font-bold">12</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;