import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaBuilding, FaChartBar, FaGlobe, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Base from 'antd/es/typography/Base';
import { base_url } from '../../../utils/base_url';
const BuilderDetailPage = () => {
    const { id } = useParams();
    console.log(id)
    const [builder, setBuilder] = useState(null);
    const [loading, setLoading] = useState(true);


    if(id === ":id"){ // means directly wanrnt to access this page
        return <div>No Builder Selected</div>
    }

    useEffect(() => {
        fetchBuilderDetails();
    }, [id]);

    const fetchBuilderDetails = async () => {
        try {
            const response = await fetch(`${base_url}/builders/${id}`);
            const data = await response.json();
            console.log("data", data)
            setBuilder(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching builder details:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!builder) {
        return <div>Builder not found</div>;
    }

    return (
        <div className="mx-auto ">
            <div className="flex items-center mb-6">
                <img
                    src={builder.logo || 'https://via.placeholder.com/150'}
                    alt={`${builder.name} logo`}
                    className="w-24 h-24 rounded-full mr-6 object-cover"
                />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{builder.name}</h1>
                    <p className="text-gray-500">{builder.company}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <FaBuilding className="mr-2 text-blue-500" /> Company Details
                    </h2>
                    <div className="space-y-2">
                        <p><strong>Established:</strong> {builder.establishedYear}</p>
                        <p><strong>Experience:</strong> {builder.experience} years</p>
                        <p><strong>Status:</strong> {builder.status}</p>
                        <p><strong>Website:</strong> {builder.website}</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-green-500" /> Contact Information
                    </h2>
                    <div className="space-y-2">
                        <p><FaPhone className="inline mr-2" /> {builder?.contacts.join(', ')}</p>
                        <p>
                            <FaGlobe className="inline mr-2" />
                            {builder?.address?.street}, {builder?.address?.city},
                            {builder?.address?.state} - {builder?.address?.pincode}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FaChartBar className="mr-2 text-purple-500" /> Project Statistics
                </h2>
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-blue-100 p-4 rounded-lg text-center">
                        <h3 className="text-2xl font-bold text-blue-600">
                            {builder.statistics.completedProjects}
                        </h3>
                        <p className="text-gray-600">Completed Projects</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg text-center">
                        <h3 className="text-2xl font-bold text-green-600">
                            {builder.statistics.ongoingProjects}
                        </h3>
                        <p className="text-gray-600">Ongoing Projects</p>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-lg text-center">
                        <h3 className="text-2xl font-bold text-purple-600">
                            {builder.statistics.totalBuildings}
                        </h3>
                        <p className="text-gray-600">Total Buildings</p>
                    </div>
                    <div className="bg-red-100 p-4 rounded-lg text-center">
                        <h3 className="text-2xl font-bold text-red-600">
                            {builder.statistics.totalProperties}
                        </h3>
                        <p className="text-gray-600">Total Properties</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Description</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {builder.description || 'No description available.'}
                    </p>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Operating Locations</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {builder.operatingLocations && builder.operatingLocations.length > 0 ? (
                            builder.operatingLocations.map((location, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 p-4 rounded-lg"
                                >
                                    <h3 className="font-bold text-gray-800">{location.city}</h3>
                                    <p className="text-gray-600">{location.state}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No operating locations specified.</p>
                        )}
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h3 className="font-bold mb-2">Contacts</h3>
                            {builder.contacts && builder.contacts.length > 0 ? (
                                builder.contacts.map((contact, index) => (
                                    <p key={index} className="text-gray-700">
                                        {contact}
                                    </p>
                                ))
                            ) : (
                                <p className="text-gray-500">No contact information available.</p>
                            )}
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h3 className="font-bold mb-2">Website</h3>
                            {builder.website ? (
                                <a
                                    href={builder.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {builder.website}
                                </a>
                            ) : (
                                <p className="text-gray-500">No website specified.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
                    >
                        Back to Builders List
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuilderDetailPage;