import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BuildingForm from '../../components/Building/BuildingForm';
import { getBuildingById, updateBuilding } from '../../../utils/Building/api';
import useBuildingDrafts from '../../../utils/Building/useBuildingDrafts';

const EditBuildingPage = () => {
    const { buildingId } = useParams();
    const navigate = useNavigate();

    const [building, setBuilding] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [draftSaved, setDraftSaved] = useState(false);
    const [draftId, setDraftId] = useState(null);

    // Initialize building drafts hook
    const { saveDraft, updateDraft } = useBuildingDrafts();

    // Fetch building data on component mount
    useEffect(() => {
        const fetchBuilding = async () => {
            setIsLoading(true);
            try {
                const buildingData = await getBuildingById(buildingId);
                setBuilding(buildingData);
                setLoadError(null);
            } catch (error) {
                console.error('Error fetching building:', error);
                setLoadError(`Failed to load building: ${error.message || 'Unknown error'}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBuilding();
    }, [buildingId]);

    // Handle form submission
    const handleSubmit = async (buildingData, galleryFiles) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await updateBuilding(buildingId, buildingData, galleryFiles);

            // Show success message
            alert('Building updated successfully!');

            // Navigate back to building details
            navigate(`/buildings/${buildingId}`);
        } catch (error) {
            console.error('Error updating building:', error);
            setSubmitError(error.message || 'Failed to update building. Please try again.');
            window.scrollTo(0, 0); // Scroll to top to show error
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle saving draft
    const handleSaveDraft = (buildingData) => {
        try {
            let savedDraftId;
            const draftKey = `edit_${buildingId}`;

            if (draftId) {
                // Update existing draft
                savedDraftId = updateDraft(draftId, buildingData);
            } else {
                // Save new draft with a key that indicates it's an edit draft
                savedDraftId = saveDraft(buildingData);
                setDraftId(savedDraftId);
            }

            setDraftSaved(true);

            // Hide the "Draft saved" message after 3 seconds
            setTimeout(() => {
                setDraftSaved(false);
            }, 3000);

            return savedDraftId;
        } catch (error) {
            console.error('Error saving draft:', error);
            alert('Failed to save draft. Please try again.');
        }
    };

    return (
        <div className="mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Edit Building</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Update the building details and submit the form.
                </p>
            </div>

            {loadError && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{loadError}</p>
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/buildings')}
                                    className="text-sm font-medium text-red-700 hover:text-red-600"
                                >
                                    Go back to buildings list
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {submitError && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{submitError}</p>
                        </div>
                    </div>
                </div>
            )}

            {draftSaved && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">
                                Draft saved successfully. You can continue editing or come back later.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-700">Loading building data...</span>
                </div>
            ) : building ? (
                <BuildingForm
                    initialData={building}
                    onSubmit={handleSubmit}
                    onSaveDraft={handleSaveDraft}
                    isLoading={isSubmitting}
                />
            ) : null}
        </div>
    );
};

export default EditBuildingPage;