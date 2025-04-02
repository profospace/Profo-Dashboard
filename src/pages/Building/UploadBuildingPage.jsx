import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuildingForm from '../../components/Building/BuildingForm';
import { createBuilding } from '../../../utils/Building/api';
import useBuildingDrafts from '../../../utils/Building/useBuildingDrafts';

const UploadBuildingPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [draftSaved, setDraftSaved] = useState(false);
    const [draftId, setDraftId] = useState(null);
    const navigate = useNavigate();

    // Initialize building drafts hook
    const { saveDraft, updateDraft } = useBuildingDrafts();

    // Handle form submission
    const handleSubmit = async (buildingData, galleryFiles) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await createBuilding(buildingData, galleryFiles);

            // Show success message
            alert('Building uploaded successfully!');

            // If this was a saved draft, we could delete it here

            // Navigate to the buildings list
            navigate('/buildings');
        } catch (error) {
            console.error('Error creating building:', error);
            setSubmitError(error.message || 'Failed to create building. Please try again.');
            window.scrollTo(0, 0); // Scroll to top to show error
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle saving draft
    const handleSaveDraft = (buildingData) => {
        try {
            let savedDraftId;

            if (draftId) {
                // Update existing draft
                savedDraftId = updateDraft(draftId, buildingData);
            } else {
                // Save new draft
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
                <h1 className="text-2xl font-bold text-gray-900">Upload New Building</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Fill in the building details and submit the form.
                </p>
            </div>

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

            <BuildingForm
                onSubmit={handleSubmit}
                onSaveDraft={handleSaveDraft}
                isLoading={isSubmitting}
            />
        </div>
    );
};

export default UploadBuildingPage;