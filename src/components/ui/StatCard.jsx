import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const StatCard = ({ title, value, icon, linkTo, color = 'blue' }) => {
    return (
        <div className="bg-white shadow-sm rounded-lg p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-50">
                    {icon}
                </div>
            </div>
            {linkTo && (
                <Link
                    to={linkTo}
                    className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    View details
                    <FiArrowRight className="ml-1" />
                </Link>
            )}
        </div>
    );
};

export default StatCard;