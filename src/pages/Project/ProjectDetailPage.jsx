import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { base_url } from "../../../utils/base_url";

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchProjectDetails();
    }, [projectId]);

    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${base_url}/api/projects/${projectId}`);
            setProject(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching project details:', error);
            setError('Failed to load project details. Please try again.');
            toast.error('Failed to load project details');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigate(`/projects/edit/${projectId}`);
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`${base_url}/api/projects/${projectId}`);
            toast.success('Project deleted successfully');
            navigate('/projects');
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete project');
        } finally {
            setLoading(false);
        }
    };

    const handleManageProperties = () => {
        // Navigate to property management page for this project
        navigate(`/projects/${projectId}/properties`);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'upcoming':
                return 'bg-yellow-100 text-yellow-800';
            case 'under_construction':
                return 'bg-orange-100 text-orange-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatStatus = (status) => {
        if (!status) return 'Unknown';
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 2,
            style: 'currency',
            currency: 'INR'
        }).format(price).replace(/^(\D+)/, '₹ ');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="text-red-500 mb-4 text-xl">{error || 'Project not found'}</div>
                <p className="text-gray-600 mb-8">The project you're looking for doesn't exist or has been removed.</p>
                <button
                    onClick={() => navigate('/projects')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Back to Projects
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/projects')}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Projects
                </button>
            </div>

            {/* Project Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(project.status)}`}>
                            {formatStatus(project.status)}
                        </span>
                        <span className="text-gray-600">{project.type?.replace(/_/g, ' ')}</span>
                        {project.builder && (
                            <span className="text-gray-600">by {project.builder.name}</span>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Edit Project
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Delete Project
                    </button>
                    <button
                        onClick={handleManageProperties}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Manage Properties
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`pb-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'details'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Details
                    </button>
                    <button
                        onClick={() => setActiveTab('location')}
                        className={`pb-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'location'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Location
                    </button>
                    <button
                        onClick={() => setActiveTab('floor-plans')}
                        className={`pb-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'floor-plans'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Floor Plans
                    </button>
                    <button
                        onClick={() => setActiveTab('amenities')}
                        className={`pb-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'amenities'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Amenities
                    </button>
                    <button
                        onClick={() => setActiveTab('properties')}
                        className={`pb-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'properties'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Properties
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Overview</h2>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Builder</h3>
                                <p className="text-lg font-medium">{project.builder?.name || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">RERA Number</h3>
                                <p className="text-lg font-medium">{project.reraNumber || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">RERA Validity</h3>
                                <p className="text-lg font-medium">{project.reravalidity || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Total Units</h3>
                                <p className="text-lg font-medium">{project.overview?.totalUnits || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Total Towers</h3>
                                <p className="text-lg font-medium">{project.overview?.totalTowers || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Launch Date</h3>
                                <p className="text-lg font-medium">
                                    {project.overview?.launchDate ? formatDate(project.overview.launchDate) : 'N/A'}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Possession Date</h3>
                                <p className="text-lg font-medium">
                                    {project.overview?.possessionDate ? formatDate(project.overview.possessionDate) : 'N/A'}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Price Range</h3>
                                <p className="text-lg font-medium">
                                    {project.overview?.priceRange?.min && project.overview?.priceRange?.max
                                        ? `${formatPrice(project.overview.priceRange.min)} - ${formatPrice(project.overview.priceRange.max)}`
                                        : 'N/A'}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Price Per Sq.Ft</h3>
                                <p className="text-lg font-medium">
                                    {project.overview?.priceRange?.pricePerSqFt
                                        ? formatPrice(project.overview.priceRange.pricePerSqFt)
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        {project.description && (
                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                                </div>
                            </div>
                        )}

                        {/* Property Types */}
                        {project.propertyType && project.propertyType.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Property Types</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.propertyType.map((type, index) => (
                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                            {type}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Offers */}
                        {project.offer && project.offer.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Offers</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.offer.map((offer, index) => (
                                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                            {offer}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Highlights */}
                        {project.highlights && project.highlights.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Project Highlights</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {project.highlights.map((highlight, index) => (
                                        <div key={index} className="bg-blue-50 p-4 rounded-lg">
                                            <div className="flex items-start">
                                                {highlight.icon && (
                                                    <img
                                                        src={highlight.icon}
                                                        alt=""
                                                        className="w-8 h-8 mr-3 object-contain"
                                                    />
                                                )}
                                                <div>
                                                    <h4 className="font-medium text-blue-800">{highlight.title}</h4>
                                                    <p className="text-sm text-blue-600 mt-1">{highlight.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'details' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Details</h2>

                        {/* Specifications */}
                        {project.specification && project.specification.length > 0 ? (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Specifications</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {project.specification.map((spec, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-gray-800 mb-2">{spec.category}</h4>
                                            <ul className="space-y-1">
                                                {spec.details.map((item, idx) => (
                                                    <li key={idx} className="flex items-start">
                                                        <span className="text-green-500 mr-2">•</span>
                                                        <span className="text-gray-700">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No specification details available.</p>
                        )}

                        {/* RERA Info */}
                        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">RERA Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">RERA Number</h4>
                                    <p className="text-gray-800">{project.reraNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">RERA Validity</h4>
                                    <p className="text-gray-800">{project.reravalidity || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Brochures */}
                        {project.brochures && project.brochures.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Project Brochures</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {project.brochures.map((brochure, index) => (
                                        <a
                                            key={index}
                                            href={brochure.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-red-100 rounded-lg mr-4">
                                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">{brochure.title}</h4>
                                                <p className="text-sm text-blue-600">View Brochure</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gallery */}
                        {project.gallery && project.gallery.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Project Gallery</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {project.gallery.map((category) => (
                                        <div key={category.category} className="space-y-2">
                                            <h4 className="font-medium text-gray-700">{category.category}</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {category.images.slice(0, 4).map((image, idx) => (
                                                    <div key={idx} className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg">
                                                        <img
                                                            src={image}
                                                            alt={`${category.category} ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            {category.images.length > 4 && (
                                                <p className="text-sm text-blue-600">
                                                    +{category.images.length - 4} more images
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Master Plan */}
                        {project.masterPlan && (
                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Master Plan</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <img
                                        src={project.masterPlan}
                                        alt="Master Plan"
                                        className="max-h-96 object-contain mx-auto"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'location' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Details</h2>

                        {/* Address Information */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Full Address</h4>
                                    <p className="text-gray-800">{project.location?.address || 'N/A'}</p>
                                </div>
                                {project.location?.landmark && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Landmark</h4>
                                        <p className="text-gray-800">{project.location.landmark}</p>
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">City</h4>
                                    <p className="text-gray-800">{project.location?.city || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">State</h4>
                                    <p className="text-gray-800">{project.location?.state || 'N/A'}</p>
                                </div>
                                {project.location?.pincode && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Pincode</h4>
                                        <p className="text-gray-800">{project.location.pincode}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Map View */}
                        {(project.location?.coordinates?.coordinates || (project.location?.latitude && project.location?.longitude)) && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Map Location</h3>
                                <div className="h-96 w-full rounded-lg bg-gray-100 flex items-center justify-center">
                                    <p className="text-gray-500">
                                        Map View - A Google Map would be displayed here showing the project location
                                    </p>
                                </div>
                                <p className="mt-2 text-sm text-gray-600">
                                    Coordinates:
                                    {project.location?.coordinates?.coordinates
                                        ? `${project.location.coordinates.coordinates[1]}, ${project.location.coordinates.coordinates[0]}`
                                        : `${project.location?.latitude || 'N/A'}, ${project.location?.longitude || 'N/A'}`
                                    }
                                </p>
                            </div>
                        )}

                        {/* Nearby Locations */}
                        {project.nearbyLocations && project.nearbyLocations.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Nearby Locations</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.entries(
                                        project.nearbyLocations.reduce((acc, location) => {
                                            if (!acc[location.type]) acc[location.type] = [];
                                            acc[location.type].push(location);
                                            return acc;
                                        }, {})
                                    ).map(([type, locations]) => (
                                        <div key={type} className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-gray-800 mb-3">
                                                {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </h4>
                                            <ul className="space-y-2">
                                                {locations.map((location, idx) => (
                                                    <li key={idx} className="flex justify-between text-sm">
                                                        <span className="text-gray-700">{location.name}</span>
                                                        <span className="text-gray-500">
                                                            {location.distance} km
                                                            {location.duration && ` (${location.duration} mins)`}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'floor-plans' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Floor Plans</h2>

                        {project.floorPlans && project.floorPlans.length > 0 ? (
                            <div className="space-y-8">
                                {project.floorPlans.map((plan, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{plan.name}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-500">Type</h4>
                                                        <p className="text-gray-800">{plan.type}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-500">Bedrooms</h4>
                                                            <p className="text-gray-800">{plan.bedrooms}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-500">Bathrooms</h4>
                                                            <p className="text-gray-800">{plan.bathrooms}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-500">Super Area</h4>
                                                            <p className="text-gray-800">{plan.superArea} sq.ft</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-500">Carpet Area</h4>
                                                            <p className="text-gray-800">{plan.carpetArea} sq.ft</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-500">Price</h4>
                                                        <p className="text-gray-800 text-xl font-semibold">
                                                            {formatPrice(plan.price)}
                                                        </p>
                                                    </div>
                                                </div>
                                                {plan.image && (
                                                    <div className="flex justify-center items-center">
                                                        <img
                                                            src={plan.image}
                                                            alt={`Floor plan for ${plan.name}`}
                                                            className="max-h-72 object-contain"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 text-gray-500">
                                <p className="text-xl">No floor plans available</p>
                                <p className="mt-2">Floor plans have not been added to this project yet.</p>
                                <button
                                    onClick={handleEdit}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Edit Project to Add Floor Plans
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'amenities' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Amenities</h2>

                        {project.amenities && project.amenities.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {project.amenities.map((amenity, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                        <div className="bg-gray-50 p-3">
                                            <h3 className="font-medium text-gray-800">{amenity.category}</h3>
                                        </div>
                                        <div className="p-4">
                                            <ul className="space-y-2">
                                                {amenity.items.map((item, idx) => (
                                                    <li key={idx} className="flex items-start">
                                                        <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                        <span className="text-gray-700">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 text-gray-500">
                                <p className="text-xl">No amenities available</p>
                                <p className="mt-2">Amenities have not been added to this project yet.</p>
                                <button
                                    onClick={handleEdit}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Edit Project to Add Amenities
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'properties' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Connected Properties</h2>
                            <button
                                onClick={handleManageProperties}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Manage Properties
                            </button>
                        </div>

                        {project.connectedProperties && project.connectedProperties.length > 0 ? (
                            <div className="space-y-4 mt-4">
                                {project.connectedProperties.map((property) => (
                                    <div
                                        key={property.post_id || property._id}
                                        className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                                    >
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-800">
                                                    {property.post_title || property.title}
                                                </h3>
                                                <div className="mt-1 flex flex-wrap gap-2">
                                                    {property.type_name && (
                                                        <span className="text-sm text-gray-600">
                                                            {property.type_name}
                                                        </span>
                                                    )}
                                                    {property.price && (
                                                        <span className="text-sm text-gray-600">
                                                            {formatPrice(property.price)}
                                                        </span>
                                                    )}
                                                    {property.location && (
                                                        <span className="text-sm text-gray-600">
                                                            {property.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800"
                                                    onClick={() => {
                                                        // Navigate to property detail page
                                                        navigate(`/properties/${property.post_id || property._id}`);
                                                    }}
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 text-gray-500">
                                <p className="text-xl">No properties connected</p>
                                <p className="mt-2">This project doesn't have any connected properties yet.</p>
                                <button
                                    onClick={handleManageProperties}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Connect Properties
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetailPage;