import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ProjectDraftsPage = () => {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadDrafts();
    }, []);

    const loadDrafts = () => {
        setLoading(true);
        try {
            // Get all drafts from localStorage
            const allDrafts = [];

            // Main draft
            const mainDraft = localStorage.getItem('projectDraft');
            if (mainDraft) {
                const parsedDraft = JSON.parse(mainDraft);
                allDrafts.push({
                    id: 'main',
                    name: parsedDraft.name || 'Unnamed Project',
                    type: parsedDraft.type || 'RESIDENTIAL',
                    lastUpdated: new Date().toISOString(),
                    data: parsedDraft
                });
            }

            // Check for numbered drafts
            for (let i = 1; i <= 10; i++) {
                const draftKey = `projectDraft_${i}`;
                const draft = localStorage.getItem(draftKey);
                if (draft) {
                    try {
                        const parsedDraft = JSON.parse(draft);
                        const timestamp = localStorage.getItem(`${draftKey}_timestamp`) || new Date().toISOString();

                        allDrafts.push({
                            id: draftKey,
                            name: parsedDraft.name || `Unnamed Project ${i}`,
                            type: parsedDraft.type || 'RESIDENTIAL',
                            lastUpdated: timestamp,
                            data: parsedDraft
                        });
                    } catch (error) {
                        console.error(`Error parsing draft ${draftKey}:`, error);
                    }
                }
            }

            // Sort drafts by last updated (most recent first)
            allDrafts.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

            setDrafts(allDrafts);
        } catch (error) {
            console.error('Error loading drafts:', error);
            toast.error('Failed to load drafts');
        } finally {
            setLoading(false);
        }
    };

    const handleEditDraft = (draft) => {
        // Save the selected draft as the main draft
        localStorage.setItem('projectDraft', JSON.stringify(draft.data));
        toast.success('Draft loaded and ready for editing');
        navigate('/projects/add');
    };

    const handleDeleteDraft = (draftId) => {
        if (!confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
            return;
        }

        try {
            localStorage.removeItem(draftId);
            // Also remove timestamp if it exists
            if (draftId !== 'main') {
                localStorage.removeItem(`${draftId}_timestamp`);
            }

            toast.success('Draft deleted successfully');
            loadDrafts(); // Refresh the list
        } catch (error) {
            console.error('Error deleting draft:', error);
            toast.error('Failed to delete draft');
        }
    };

    const handleSaveDraft = (draft) => {
        try {
            // Save draft to a new slot
            const nextSlotNumber = findNextAvailableSlot();
            const draftKey = `projectDraft_${nextSlotNumber}`;

            localStorage.setItem(draftKey, JSON.stringify(draft.data));
            localStorage.setItem(`${draftKey}_timestamp`, new Date().toISOString());

            toast.success('Draft saved to a new slot');
            loadDrafts(); // Refresh the list
        } catch (error) {
            console.error('Error saving draft to new slot:', error);
            toast.error('Failed to save draft');
        }
    };

    const findNextAvailableSlot = () => {
        // Find the next available slot number (1-10)
        for (let i = 1; i <= 10; i++) {
            const draftKey = `projectDraft_${i}`;
            if (!localStorage.getItem(draftKey)) {
                return i;
            }
        }
        // If all slots are used, use slot 1 (overwrite oldest)
        return 1;
    };

    const handleCreateNewDraft = () => {
        // Clear main draft and navigate to add project page
        localStorage.removeItem('projectDraft');
        navigate('/projects/add');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Project Drafts</h1>
                <div className="flex space-x-4">
                    <button
                        onClick={handleCreateNewDraft}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Create New Draft
                    </button>
                    <button
                        onClick={() => navigate('/projects')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Back to Projects
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-6">Saved Drafts</h2>

                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : drafts.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <p className="text-xl">No drafts found</p>
                        <p className="mt-2">Start a new project and save it as a draft to see it here.</p>
                        <button
                            onClick={handleCreateNewDraft}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Create New Project
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 text-left">
                                    <th className="py-3 px-4 font-semibold">Project Name</th>
                                    <th className="py-3 px-4 font-semibold">Type</th>
                                    <th className="py-3 px-4 font-semibold">Last Updated</th>
                                    <th className="py-3 px-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {drafts.map((draft) => (
                                    <tr key={draft.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="font-medium text-gray-900">{draft.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {draft.id === 'main' ? 'Current Draft' : `Saved Draft #${draft.id.split('_')[1]}`}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{draft.type?.replace('_', ' ')}</td>
                                        <td className="py-3 px-4">{formatDate(draft.lastUpdated)}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditDraft(draft)}
                                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDraft(draft.id)}
                                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                                {draft.id === 'main' && (
                                                    <button
                                                        onClick={() => handleSaveDraft(draft)}
                                                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                                    >
                                                        Save Copy
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDraftsPage;