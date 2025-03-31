import React, {  useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ChevronLeftIcon, ChevronRightIcon, PhoneIcon, LocateIcon, CalendarIcon, HomeIcon,  UserIcon } from 'lucide-react';
import { IndianRupeeIcon } from 'lucide-react';
import { FaBuilding } from "react-icons/fa";

import { base_url } from "../../../utils/base_url";

export default function PropertyDetails({ propertyId, onClose }) {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchPropertyDetails();
    }, [propertyId]);

    const fetchPropertyDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${base_url}/api/details/${propertyId}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch property details: ${response.status}`);
            }

            const data = await response.json();
            setProperty(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching property details:', error);
            setError('Failed to load property details. Please try again.');
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const backdrop = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 }
    };

    const modal = {
        hidden: { y: "-100vh", opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        exit: {
            y: "100vh",
            opacity: 0,
            transition: {
                ease: "easeInOut"
            }
        }
    };

    if (loading) {
        return (
            <motion.div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
                variants={backdrop}
                initial="hidden"
                animate="visible"
                exit="hidden"
            >
                <motion.div
                    className="bg-white p-6 rounded-lg max-w-3xl w-full mx-4"
                    variants={modal}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600">Loading property details...</p>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
                variants={backdrop}
                initial="hidden"
                animate="visible"
                exit="hidden"
            >
                <motion.div
                    className="bg-white p-6 rounded-lg max-w-3xl w-full mx-4"
                    variants={modal}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="text-center py-12">
                        <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            onClick={fetchPropertyDetails}
                        >
                            Try Again
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    if (!property) {
        return null;
    }

    // Prepare gallery images array
    const galleryImages = [
        property.post_image,
        ...(property.galleryList || []),
        property.floor_plan_image
    ].filter(Boolean);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto"
                variants={backdrop}
                initial="hidden"
                animate="visible"
                exit="hidden"
            >
                <motion.div
                    className="bg-white rounded-lg max-w-5xl w-full mx-4 my-8"
                    variants={modal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="sticky top-0 z-10 bg-white rounded-t-lg border-b border-gray-200 p-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">{property.post_title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
                        {/* Image Gallery */}
                        <div className="mb-6">
                            <div className="relative h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden">
                                {galleryImages.length > 0 ? (
                                    <motion.img
                                        src={galleryImages[activeImageIndex]}
                                        alt={`Property ${activeImageIndex + 1}`}
                                        className="h-full w-full object-cover"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        key={activeImageIndex}
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                        No Images Available
                                    </div>
                                )}

                                {/* Navigation arrows */}
                                {galleryImages.length > 1 && (
                                    <>
                                        <motion.button
                                            onClick={() => setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 focus:outline-none"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <ChevronLeftIcon className="h-5 w-5" />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 focus:outline-none"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <ChevronRightIcon className="h-5 w-5" />
                                        </motion.button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {galleryImages.length > 1 && (
                                <div className="mt-2 grid grid-cols-4 md:grid-cols-6 gap-2">
                                    {galleryImages.map((img, index) => (
                                        <motion.div
                                            key={index}
                                            className={`h-16 rounded-md overflow-hidden cursor-pointer ${index === activeImageIndex ? 'ring-2 ring-blue-500' : ''
                                                }`}
                                            onClick={() => setActiveImageIndex(index)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="mb-6 border-b border-gray-200">
                            <nav className="-mb-px flex space-x-6">
                                <motion.button
                                    className={`py-2 px-1 relative ${activeTab === 'overview'
                                            ? 'text-blue-600 font-medium'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    onClick={() => setActiveTab('overview')}
                                    whileHover={{ y: -2 }}
                                >
                                    Overview
                                    {activeTab === 'overview' && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                            layoutId="underline"
                                        />
                                    )}
                                </motion.button>
                                <motion.button
                                    className={`py-2 px-1 relative ${activeTab === 'details'
                                            ? 'text-blue-600 font-medium'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    onClick={() => setActiveTab('details')}
                                    whileHover={{ y: -2 }}
                                >
                                    Details
                                    {activeTab === 'details' && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                            layoutId="underline"
                                        />
                                    )}
                                </motion.button>
                                <motion.button
                                    className={`py-2 px-1 relative ${activeTab === 'features'
                                            ? 'text-blue-600 font-medium'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    onClick={() => setActiveTab('features')}
                                    whileHover={{ y: -2 }}
                                >
                                    Features
                                    {activeTab === 'features' && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                            layoutId="underline"
                                        />
                                    )}
                                </motion.button>
                                <motion.button
                                    className={`py-2 px-1 relative ${activeTab === 'contact'
                                            ? 'text-blue-600 font-medium'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    onClick={() => setActiveTab('contact')}
                                    whileHover={{ y: -2 }}
                                >
                                    Contact
                                    {activeTab === 'contact' && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                            layoutId="underline"
                                        />
                                    )}
                                </motion.button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                                >
                                    <div>
                                        <div className="flex items-center mb-4">
                                            <HomeIcon className="h-5 w-5 text-blue-500 mr-2" />
                                            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                                        </div>

                                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Property ID</span>
                                                <span className="font-medium">{property.post_id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Property Type</span>
                                                <span className="font-medium">{property.type_name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Purpose</span>
                                                <span className="font-medium">{property.purpose}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Status</span>
                                                <span className={`font-medium px-2 py-1 rounded-full text-xs ${property.status === 'listed' ? 'bg-green-100 text-green-800' :
                                                        property.status === 'unlisted' ? 'bg-gray-100 text-gray-800' :
                                                            property.status === 'payment-pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>
                                                    {property.status || 'unlisted'}
                                                </span>
                                            </div>
                                            {property.building_id && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Building ID</span>
                                                    <span className="font-medium">{property.building_id}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Available</span>
                                                <span className="font-medium">
                                                    {property.available ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center mt-6 mb-4">
                                            <IndianRupeeIcon className="h-5 w-5 text-blue-500 mr-2" />
                                            <h3 className="text-lg font-medium text-gray-900">Pricing & Area</h3>
                                        </div>
                                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Price</span>
                                                <span className="font-medium">
                                                    {property.priceOnRequest ? 'Price on Request' : `₹${property.price?.toLocaleString() || 'N/A'} ${property.priceUnit || ''}`}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Negotiable</span>
                                                <span className="font-medium">
                                                    {property.negotiation ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Area</span>
                                                <span className="font-medium">
                                                    {property.area} {property.areaUnit}
                                                </span>
                                            </div>
                                            {property.carpetArea && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Carpet Area</span>
                                                    <span className="font-medium">
                                                        {property.carpetArea} {property.areaUnit}
                                                    </span>
                                                </div>
                                            )}
                                            {property.superBuiltupArea && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Super Built-up Area</span>
                                                    <span className="font-medium">
                                                        {property.superBuiltupArea} {property.areaUnit}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center mb-4">
                                            <FaBuilding className="h-5 w-5 text-blue-500 mr-2" />
                                            <h3 className="text-lg font-medium text-gray-900">Property Details</h3>
                                        </div>

                                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                            {property.bedrooms && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Bedrooms</span>
                                                    <span className="font-medium">{property.bedrooms}</span>
                                                </div>
                                            )}
                                            {property.bathrooms && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Bathrooms</span>
                                                    <span className="font-medium">{property.bathrooms}</span>
                                                </div>
                                            )}
                                            {property.floor && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Floor</span>
                                                    <span className="font-medium">{property.floor}</span>
                                                </div>
                                            )}
                                            {property.furnishing && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Furnishing</span>
                                                    <span className="font-medium">{property.furnishing}</span>
                                                </div>
                                            )}
                                            {property.possession && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Possession</span>
                                                    <span className="font-medium">{property.possession}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center mt-6 mb-4">
                                            <LocateIcon className="h-5 w-5 text-blue-500 mr-2" />
                                            <h3 className="text-lg font-medium text-gray-900">Location</h3>
                                        </div>
                                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                            <div>
                                                <span className="text-gray-500 block mb-1">Address</span>
                                                <span className="font-medium">{property.address || 'No address provided'}</span>
                                            </div>
                                            {property.post_city && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">City</span>
                                                    <span className="font-medium">{property.post_city}</span>
                                                </div>
                                            )}
                                            {property.locality && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Locality</span>
                                                    <span className="font-medium">{property.locality}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'details' && (
                                <motion.div
                                    key="details"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="mb-6">
                                        <div className="flex items-center mb-4">
                                            <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
                                            <h3 className="text-lg font-medium text-gray-900">Timeline</h3>
                                        </div>
                                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Posted On</span>
                                                <span className="font-medium">
                                                    {formatDate(property.createdAt)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Last Updated</span>
                                                <span className="font-medium">
                                                    {formatDate(property.updatedAt)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Views</span>
                                                <span className="font-medium">
                                                    {property.total_views || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Details */}
                                    <div className="mb-6">
                                        <div className="flex items-center mb-4">
                                            <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
                                        </div>
                                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                            {property.agreement && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Agreement</span>
                                                    <span className="font-medium">{property.agreement}</span>
                                                </div>
                                            )}
                                            {property.constructionStatus && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Construction Status</span>
                                                    <span className="font-medium">{property.constructionStatus}</span>
                                                </div>
                                            )}
                                            {property.propertyCondition && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Property Condition</span>
                                                    <span className="font-medium">{property.propertyCondition}</span>
                                                </div>
                                            )}
                                            {property.ownershipType && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Ownership Type</span>
                                                    <span className="font-medium">{property.ownershipType}</span>
                                                </div>
                                            )}
                                            {property.legalStatus && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Legal Status</span>
                                                    <span className="font-medium">{property.legalStatus}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-gray-700 whitespace-pre-line">{property.post_description || 'No description available.'}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'features' && (
                                <motion.div
                                    key="features"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Amenities & Features */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Amenities */}
                                        {property.amenities && property.amenities.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">Amenities</h3>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {property.amenities.map((amenity, index) => (
                                                            <div key={index} className="flex items-center">
                                                                <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                                                                <span className="text-gray-700">{amenity}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Facilities */}
                                        {property.facilities && property.facilities.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">Facilities</h3>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {property.facilities.map((facility, index) => (
                                                            <div key={index} className="flex items-center">
                                                                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                                                                <span className="text-gray-700">{facility}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    {property.tags && property.tags.length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex flex-wrap gap-2">
                                                    {property.tags.map((tag, index) => (
                                                        <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Special features */}
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {property.propertyFeatures && property.propertyFeatures.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">Property Features</h3>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {property.propertyFeatures.map((feature, index) => (
                                                            <div key={index} className="flex items-center">
                                                                <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                                                                <span className="text-gray-700">{feature}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {property.viewTypes && (
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">View Types</h3>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <span className="text-gray-700">{property.viewTypes}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {
                                activeTab === 'contact' && (
                                    <motion.div
                                        key="contact"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {/* Contact Information */}
                                        <div>
                                            <div className="flex items-center mb-4">
                                                <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
                                                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                {property.property_owner_name && (
                                                    <div className="mb-4">
                                                        <span className="text-gray-500 block mb-1">Owner Name:</span>
                                                        <span className="text-lg font-medium">{property.property_owner_name}</span>
                                                    </div>
                                                )}

                                                {property.contactList && property.contactList.length > 0 && (
                                                    <div>
                                                        <span className="text-gray-500 block mb-2">Contact Numbers:</span>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {property.contactList.map((contact, index) => (
                                                                <a
                                                                    key={index}
                                                                    href={`tel:${contact}`}
                                                                    className="inline-flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                                                >
                                                                    <PhoneIcon className="h-4 w-4 text-blue-500 mr-2" />
                                                                    {contact}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {(!property.property_owner_name && (!property.contactList || property.contactList.length === 0)) && (
                                                    <div className="text-center py-4 text-gray-500">
                                                        No contact information available
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Builder/Agency Information */}
                                        {property.builder && (
                                            <div className="mt-6">
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">Builder Information</h3>
                                                <div className="bg-gray-50 p-6 rounded-lg">
                                                    <div className="flex items-center mb-4">
                                                        {property.builder.logo ? (
                                                            <img
                                                                src={property.builder.logo}
                                                                alt={property.builder.name}
                                                                className="h-16 w-16 object-contain mr-4"
                                                            />
                                                        ) : (
                                                            <div className="h-16 w-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-4">
                                                                <OfficeBuildingIcon className="h-8 w-8" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h4 className="text-lg font-medium">{property.builder.name}</h4>
                                                            <p className="text-gray-500">{property.builder.company}</p>
                                                        </div>
                                                    </div>

                                                    {property.builder.description && (
                                                        <p className="text-gray-700 mt-2">{property.builder.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                        </AnimatePresence >
                    </div >
                </motion.div >
            </motion.div >
        </AnimatePresence >
    );
}