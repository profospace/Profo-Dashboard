import { useState, useEffect } from 'react';

const DRAFTS_STORAGE_KEY = 'building_drafts';

const useBuildingDrafts = () => {
    const [drafts, setDrafts] = useState([]);

    // Load drafts from localStorage on component mount
    useEffect(() => {
        const storedDrafts = localStorage.getItem(DRAFTS_STORAGE_KEY);
        if (storedDrafts) {
            try {
                setDrafts(JSON.parse(storedDrafts));
            } catch (error) {
                console.error('Error parsing drafts from localStorage:', error);
                setDrafts([]);
            }
        }
    }, []);

    // Save a new draft
    const saveDraft = (draftData) => {
        const newDraft = {
            id: `draft_${Date.now()}`,
            data: draftData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const updatedDrafts = [...drafts, newDraft];
        localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updatedDrafts));
        setDrafts(updatedDrafts);

        return newDraft.id;
    };

    // Update an existing draft
    const updateDraft = (draftId, draftData) => {
        const draftIndex = drafts.findIndex(draft => draft.id === draftId);

        if (draftIndex === -1) {
            return saveDraft(draftData); // If draft doesn't exist, create a new one
        }

        const updatedDrafts = [...drafts];
        updatedDrafts[draftIndex] = {
            ...updatedDrafts[draftIndex],
            data: draftData,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updatedDrafts));
        setDrafts(updatedDrafts);

        return draftId;
    };

    // Delete a draft
    const deleteDraft = (draftId) => {
        const updatedDrafts = drafts.filter(draft => draft.id !== draftId);
        localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updatedDrafts));
        setDrafts(updatedDrafts);
    };

    // Get a specific draft by ID
    const getDraft = (draftId) => {
        return drafts.find(draft => draft.id === draftId) || null;
    };

    // Helper function to get the latest draft
    const getLatestDraft = () => {
        if (drafts.length === 0) return null;

        // Sort by updatedAt date and return the most recent
        return [...drafts].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )[0];
    };

    return {
        drafts,
        saveDraft,
        updateDraft,
        deleteDraft,
        getDraft,
        getLatestDraft
    };
};

export default useBuildingDrafts;