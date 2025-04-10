import React, { useState } from 'react';
import { FaClipboardList, FaChevronDown, FaCheck } from 'react-icons/fa';

// Pre-defined builder templates for quick form filling
const PREFILL_OPTIONS = [
    {
        label: 'Green Valley Builders',
        data: {
            name: 'Green Valley Builders',
            username: 'greenvalley2024',
            company: 'Green Valley Real Estate Pvt Ltd',
            experience: 15,
            establishedYear: 2005,
            status: 'ACTIVE',
            description: 'Leading real estate developer with sustainable and innovative housing solutions.',
            website: 'https://greenvalleybuilders.com',
            contacts: ['9876543210', 'contact@greenvalley.com'],
            address: {
                street: '123 Innovation Park',
                city: 'Bangalore',
                state: 'Karnataka',
                pincode: '560001'
            },
            latitude: 12.9716,
            longitude: 77.5946,
            statistics: {
                completedProjects: 25,
                ongoingProjects: 10,
                totalBuildings: 50,
                totalProperties: 500
            },
            operatingLocations: [
                { city: 'Bangalore', state: 'Karnataka' },
                { city: 'Mumbai', state: 'Maharashtra' }
            ],
            access: true
        }
    },
    {
        label: 'Urban Horizon Developers',
        data: {
            name: 'Urban Horizon Developers',
            username: 'urbanhorizon',
            company: 'Urban Horizon Construction Pvt Ltd',
            experience: 10,
            establishedYear: 2010,
            status: 'ACTIVE',
            description: 'Transforming cityscapes with modern, sustainable urban developments.',
            website: 'https://urbanhorizon.com',
            contacts: ['7890123456', 'info@urbanhorizon.com'],
            address: {
                street: '456 Metro Square',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001'
            },
            latitude: 19.0760,
            longitude: 72.8777,
            statistics: {
                completedProjects: 18,
                ongoingProjects: 7,
                totalBuildings: 35,
                totalProperties: 350
            },
            operatingLocations: [
                { city: 'Mumbai', state: 'Maharashtra' },
                { city: 'Pune', state: 'Maharashtra' }
            ],
            access: true
        }
    },
    {
        label: 'Eco Homes Construction',
        data: {
            name: 'Eco Homes Construction',
            username: 'ecohomes',
            company: 'Eco Homes Sustainable Solutions',
            experience: 8,
            establishedYear: 2012,
            status: 'ACTIVE',
            description: 'Pioneering eco-friendly and energy-efficient housing solutions.',
            website: 'https://ecohomesconstruction.com',
            contacts: ['8901234567', 'support@ecohomes.com'],
            address: {
                street: '789 Green Tech Park',
                city: 'Hyderabad',
                state: 'Telangana',
                pincode: '500032'
            },
            latitude: 17.3850,
            longitude: 78.4867,
            statistics: {
                completedProjects: 15,
                ongoingProjects: 5,
                totalBuildings: 30,
                totalProperties: 250
            },
            operatingLocations: [
                { city: 'Hyderabad', state: 'Telangana' },
                { city: 'Chennai', state: 'Tamil Nadu' }
            ],
            access: true
        }
    }
];

const PrefillOptions = ({ onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

    const handleSelect = (option) => {
        setSelectedOption(option.label);
        onSelect(option.data);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition-all shadow-sm"
            >
                <FaClipboardList className="mr-2 text-blue-500" />
                <span className="text-gray-700">
                    {selectedOption || 'Prefill with Template'}
                </span>
                <FaChevronDown className={`ml-2 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-2 border-b border-gray-200">
                        <div className="text-sm font-medium text-gray-700">Select a template</div>
                        <div className="text-xs text-gray-500">Quickly fill the form with pre-defined data</div>
                    </div>
                    <ul className="py-2">
                        {PREFILL_OPTIONS.map((option, index) => (
                            <li key={index}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors"
                                >
                                    <span>{option.label}</span>
                                    {selectedOption === option.label && (
                                        <FaCheck className="text-green-500" />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PrefillOptions;