import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { base_url } from "../../../utils/base_url";
import ProjectForm from '../../components/Project/ProjectForm';
import ProjectAutofill from '../../components/Project/ProjectAutofill';

const AddProjectPage = () => {
    const [loading, setLoading] = useState(false);
    const [builders, setBuilders] = useState([]);
    const [draftLoaded, setDraftLoaded] = useState(false);
    const navigate = useNavigate();

    // Initial empty form data
    const initialFormData = {
        name: '',
        type: 'RESIDENTIAL',
        status: 'UPCOMING',
        builder: '',
        reraNumber: '',
        reravalidity: '',
        description: '',
        overview: {
            totalUnits: '',
            totalTowers: '',
            launchDate: '',
            possessionDate: '',
            priceRange: {
                min: '',
                max: '',
                pricePerSqFt: ''
            }
        },
        location: {
            address: '',
            landmark: '',
            city: '',
            state: '',
            pincode: '',
            latitude: '',
            longitude: ''
        },
        floorPlans: [],
        amenities: [],
        highlights: [],
        brochures: [],
        nearbyLocations: [],
        offer: [],
        propertyType: []
    };

    // State to store the form data
    const [formData, setFormData] = useState(initialFormData);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [floorPlanFiles, setFloorPlanFiles] = useState({});

    // Save to localStorage every 30 seconds
    useEffect(() => {
        const draftTimer = setInterval(() => {
            saveDraft();
        }, 30000);

        return () => clearInterval(draftTimer);
    }, [formData]);

    const loadDraft = () => {
        const savedDraft = localStorage.getItem('projectDraft');
        if (savedDraft) {
            try {
                const parsedDraft = JSON.parse(savedDraft);
                setFormData(parsedDraft);
                setDraftLoaded(true);
                toast.success('Draft loaded successfully');
            } catch (error) {
                console.error('Error parsing draft:', error);
                toast.error('Failed to load draft');
            }
        }
    };

    // Load draft on first render
    useEffect(() => {
        loadDraft();
        fetchBuilders();
    }, []);

    const fetchBuilders = async () => {
        try {
            const response = await axios.get(`${base_url}/builders`);
            setBuilders(response.data);
        } catch (error) {
            console.error('Error fetching builders:', error);
            toast.error('Failed to load builders');
        }
    };

    const saveDraft = () => {
        try {
            localStorage.setItem('projectDraft', JSON.stringify(formData));
            console.log('Draft saved automatically');
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    };

    const handleSaveDraft = () => {
        try {
            localStorage.setItem('projectDraft', JSON.stringify(formData));
            toast.success('Draft saved successfully');
        } catch (error) {
            console.error('Error saving draft:', error);
            toast.error('Failed to save draft');
        }
    };

    const clearDraft = () => {
        localStorage.removeItem('projectDraft');
        setFormData(initialFormData);
        toast.success('Draft cleared');
    };

    const handleFormChange = (updatedData) => {
        setFormData(updatedData);
    };

    // Function to handle file uploads from ProjectForm
    const handleFileUpdates = (galleryFiles, floorPlanFiles) => {
        setGalleryFiles(galleryFiles);
        setFloorPlanFiles(floorPlanFiles);
    };

    // Function to handle test data application from ProjectAutofill component
    const handleApplyTestData = (testData) => {
        setFormData(testData);
        toast.success('Test data applied successfully');
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Validate required fields
            if (!formData.name || !formData.builder || !formData.type) {
                toast.error('Please fill out all required fields');
                setLoading(false);
                return;
            }

            // Format data for API
            const projectData = {
                ...formData,
                location: {
                    ...formData.location,
                    "coordinates": {
                        "type": "Point",
                        "coordinates": [
                            formData.location.longitude ? parseFloat(formData.location.longitude) : 0,
                            formData.location.latitude ? parseFloat(formData.location.latitude) : 0,
                        ]
                    },
                }
            };

            // Create FormData object for file uploads
            const formDataObj = new FormData();
            formDataObj.append('data', JSON.stringify(projectData));

            // Add gallery images to FormData
            if (galleryFiles && galleryFiles.length > 0) {
                galleryFiles.forEach(file => {
                    formDataObj.append('galleryList', file);
                });
            }

            // Add floor plan images to FormData
            if (Object.keys(floorPlanFiles).length > 0) {
                const floorPlanIndices = [];

                Object.entries(floorPlanFiles).forEach(([index, file]) => {
                    formDataObj.append('floorPlanImages', file);
                    floorPlanIndices.push(index);
                });

                // Add indices to help backend map files to floor plans
                formDataObj.append('floorPlanIndices', JSON.stringify(floorPlanIndices));
            }

            const response = await axios.post(`${base_url}/api/projects`, formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Project created successfully');
            localStorage.removeItem('projectDraft'); // Clear draft on successful submission
            navigate('/projects');
        } catch (error) {
            console.error('Error creating project:', error);
            toast.error(`Failed to create project: ${error.response?.data?.error || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            navigate('/projects');
        }
    };

    return (
        <div className="">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Add New Project</h1>
                <div className="flex space-x-3">
                    <ProjectAutofill onApply={handleApplyTestData} builders={builders} />

                    <button
                        onClick={handleSaveDraft}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
                        disabled={loading}
                    >
                        Save as Draft
                    </button>
                    {draftLoaded && (
                        <button
                            onClick={clearDraft}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            Clear Draft
                        </button>
                    )}
                </div>
            </div>

            <div className="">
                <ProjectForm
                    projectData={formData}
                    isEditing={false}
                    onSubmit={handleSubmit}
                    onReset={handleCancel}
                    onChange={handleFormChange}
                    onFileUpdates={handleFileUpdates} // New prop to handle file updates
                    loading={loading}
                    builders={builders}
                />
            </div>
        </div>
    );
};

export default AddProjectPage;