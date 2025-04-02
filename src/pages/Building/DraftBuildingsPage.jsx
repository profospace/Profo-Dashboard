import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useBuildingDrafts from '../../../utils/Building/useBuildingDrafts';

const DraftBuildingsPage = () => {
    const navigate = useNavigate();
    const { drafts, deleteDraft } = useBuildingDrafts();
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    // Sort drafts by updatedAt (most recent first)
    const sortedDrafts = [...drafts].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    // Filter drafts based on search term
    const filteredDrafts = sortedDrafts.filter(draft => {
        const searchString = searchTerm.toLowerCase();
        const buildingName = draft.data.name?.toLowerCase() || '';
        const buildingId = draft.data.buildingId?.toLowerCase() || '';
        const ownerName = draft.data.ownerName?.toLowerCase() || '';

        return buildingName.includes(searchString) ||
            buildingId.includes(searchString) ||
            ownerName.includes(searchString);
    });

    const handleEditDraft = (draftId) => {
        navigate(`/buildings/new?draftId=${draftId}`);
    };

    const handleDeleteDraft = (draftId) => {
        if (showDeleteConfirm === draftId) {
            deleteDraft(draftId);
            setShowDeleteConfirm(null);
        } else {
            setShowDeleteConfirm(draftId);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(null);
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Generate thumbnail view for building
    const renderThumbnail = (draft) => {
        const hasName = !!draft.data.name;
        const hasType = !!draft.data.type;
        const hasOwner = !!draft.data.ownerName;
        const hasStatus = !!draft.data.developmentStatus;

        if (!hasName && !hasType && !hasOwner && !hasStatus) {
            return (
                <div className="flex flex-col items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                    <span className="mt-2 text-gray-500">Draft Building</span>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                <div className="font-medium text-gray-900">
                    {draft.data.name || 'Unnamed Building'}
                </div>

                {(hasType || hasOwner) && (
                    <div className="text-sm text-gray-500">
                        {hasType && <div>{draft.data.type}</div>}
                        {hasOwner && <div>Owner: {draft.data.ownerName}</div>}
                    </div>
                )}

                {hasStatus && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${draft.data.developmentStatus === 'Ready' ? 'bg-green-100 text-green-800' :
                            draft.data.developmentStatus === 'Under Construction' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                        }`}>
                        {draft.data.developmentStatus}
                    </span>
                )}
            </div>
        );
    };

    // Calculate draft completeness percentage
    const calculateCompleteness = (draft) => {
        const requiredFields = ['buildingId', 'name'];
        const recommendedFields = [
            'type', 'ownerName', 'totalProperties', 'developmentStatus',
            'description', 'totalFloors', 'contactNumber'
        ];

        let score = 0;
        let total = requiredFields.length + recommendedFields.length;

        // Check required fields (weighted more)
        requiredFields.forEach(field => {
            if (draft.data[field]) score += 2;
        });

        // Check recommended fields
        recommendedFields.forEach(field => {
            if (draft.data[field]) score += 1;
        });

        // Add points for location
        if (draft.data.location && draft.data.location.coordinates) {
            score += 2;
        }

        // Add points for flats details
        if (draft.data.flatsDetails && draft.data.flatsDetails.length > 0) {
            score += 2;
        }

        // Calculate percentage (with required fields weighted more)
        const totalPossible = (requiredFields.length * 2) + recommendedFields.length + 4;
        return Math.min(Math.round((score / totalPossible) * 100), 100);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Draft Buildings</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {drafts.length} draft{drafts.length !== 1 ? 's' : ''} available
                    </p>
                </div>

                <div className="mt-4 sm:mt-0">
                    <Link
                        to="/buildings/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        New Building
                    </Link>
                </div>
            </div>

            {/* Search box */}
            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search drafts by name, ID, or owner..."
                    />
                </div>
            </div>

            {drafts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No drafts</h3>
                    <p className="mt-1 text-sm text-gray-500">You haven't saved any building drafts yet.</p>
                    <div className="mt-6">
                        <Link
                            to="/buildings/new"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Building
                        </Link>
                    </div>
                </div>
            ) : filteredDrafts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No matching drafts</h3>
                    <p className="mt-1 text-sm text-gray-500">No drafts found matching your search criteria.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => setSearchTerm('')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Clear Search
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {filteredDrafts.map((draft) => {
                            const completenessPercentage = calculateCompleteness(draft);
                            const isConfirmingDelete = showDeleteConfirm === draft.id;

                            return (
                                <li key={draft.id} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
                                        <div className="flex items-center flex-1 min-w-0">
                                            <div className="flex-shrink-0 mr-4">
                                                {renderThumbnail(draft)}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-blue-600 truncate">
                                                    {draft.data.buildingId ? `ID: ${draft.data.buildingId}` : 'Draft Building'}
                                                </div>
                                                <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        Last updated: {formatDate(draft.updatedAt)}
                                                    </div>
                                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <div className="w-24 flex items-center">
                                                            <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                                                                <div
                                                                    className={`h-2.5 rounded-full ${completenessPercentage > 75 ? 'bg-green-600' :
                                                                            completenessPercentage > 40 ? 'bg-yellow-400' :
                                                                                'bg-red-400'
                                                                        }`}
                                                                    style={{ width: `${completenessPercentage}%` }}
                                                                ></div>
                                                            </div>
                                                            <span>{completenessPercentage}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0 mt-4 sm:mt-0 flex space-x-3">
                                            <button
                                                onClick={() => handleEditDraft(draft.id)}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </button>

                                            {isConfirmingDelete ? (
                                                <>
                                                    <button
                                                        onClick={() => handleDeleteDraft(draft.id)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={cancelDelete}
                                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleDeleteDraft(draft.id)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                                >
                                                    <svg className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DraftBuildingsPage;