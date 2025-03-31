import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import LocationPicker from '../../components/Property/LocationPicker';
import { Steps } from 'antd';
import AutofillOptions from '../../components/Property/AutoFillOptions';
import { toast } from 'react-hot-toast';
import { base_url } from '../../../utils/base_url';

// We'll reuse the PropertyAdd component for both adding and editing properties
const PropertyAddEdit = ({ user }) => {
    const { propertyId } = useParams(); // Extract property ID from URL if editing
    const navigate = useNavigate();
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [originalImages, setOriginalImages] = useState({
        postImage: null,
        floorPlanImage: null,
        galleryImages: []
    });

    // Helper function to get category name from ID
    const getCategoryNameFromId = (categoryId) => {
        const categoryMap = {
            1: 'Residential',
            2: 'Commercial',
            3: 'Industrial',
            4: 'Agricultural'
        };
        return categoryMap[categoryId] || '';
    };

    // Category ID mapping for API submission
    const categoryMap = {
        'Residential': 1,
        'Commercial': 2,
        'Industrial': 3,
        'Agricultural': 4
    };

    // Function to get default form data for a new property
    const getDefaultFormData = () => {
        return {
            propertyType: '',
            propertyCategory: '',
            bedrooms: '',
            bathrooms: '',
            balconies: '',
            furnishingStatus: '',
            propertyAge: '',
            floorNumber: '',
            totalFloors: '',
            facingDirection: '',
            address: '',
            city: '',
            locality: '',
            pincode: '',
            title: '',
            description: '',
            price: '',
            priceUnit: 'lakh',
            area: '',
            areaUnit: 'sqft',
            amenities: [],
            postImage: null,
            floorPlanImage: null,
            galleryImages: [],
            latitude: '',
            longitude: '',
            purpose: 'buy',
            usp: [],
            ownerName: '',
            contactList: [],
            superBuiltupArea: '',
            carpetArea: '',
            pricePerSqFt: '',
            estimatedEMI: '',
            reraStatus: '',
            reraRegistrationNumber: '',
            reraWebsite: '',
            configuration: '',
            facing: '',
            overlookingAmenities: [],
            possessionDate: '',
            transactionType: '',
            propertyOwnership: '',
            flooring: '',
            parking: '',
            propertyCode: '',
            widthOfFacingRoad: '',
            gatedCommunity: false,
            waterSource: [],
            powerBackup: '',
            petFriendly: false,
            agreement: '',
            priceOnRequest: false,
            verified: false,
            anyConstraint: [],
            propertyTypes: [],
            propertyFeatures: [],
            viewTypes: [],
            propertyConditions: [],
            legalStatuses: [],
            constructionStatuses: [],
            ownershipTypes: [],
            financingOptions: [],
            environmentalCertifications: [],
            propertyManagementServices: [],
            investmentStrategies: [],
            tags: [],
            facilities: [],
            location_advantage: [],
            construction_status: '',
            possession: '',
            region: '',
            category: '',
            broker_status: '',
            furnishStatus: '',
            whatsappAlerts: false,
            whatsappContact: '',
            profoProxyAllowed: false,
        };
    };


    // Function to prepare property data for editing
    const preparePropertyDataForEdit = (property) => {
        console.log("Preparing property for edit:", property);

        // Store original image URLs
        setOriginalImages({
            postImage: property.post_image || null,
            floorPlanImage: property.floor_plan_image || null,
            galleryImages: property.galleryList || []
        });

        // Return the property data mapped to form fields
        return {
            propertyType: property.type_name || '',
            propertyCategory: getCategoryNameFromId(property.category) || '',
            bedrooms: property.bedrooms || '',
            bathrooms: property.bathrooms || '',
            balconies: property.balconies || '',
            furnishingStatus: property.furnishStatus || '',
            propertyAge: property.property_age || '',
            floorNumber: property.floorNumber || '',
            totalFloors: property.totalFloors || '',
            facingDirection: property.facing || '',
            address: property.address || '',
            city: property.city || '',
            locality: property.locality || '',
            pincode: property.pincode || '',
            title: property.post_title || '',
            description: property.post_description || '',
            price: property.price || '',
            priceUnit: property.priceUnit || 'lakh',
            area: property.area || '',
            areaUnit: property.areaUnit || 'sqft',
            amenities: property.amenities || [],
            // For image fields we keep them null initially, as they need to be File objects
            // for upload, and we'll only upload new images if the user selects them
            postImage: null,
            floorPlanImage: null,
            galleryImages: [],
            latitude: property.location?.coordinates ? property.location.coordinates[1] : property.latitude || '',
            longitude: property.location?.coordinates ? property.location.coordinates[0] : property.longitude || '',
            purpose: property.purpose || 'buy',
            usp: property.usp || [],
            ownerName: property.ownerName || '',
            contactList: property.contactList || [],
            superBuiltupArea: property.superBuiltupArea || '',
            carpetArea: property.carpetArea || '',
            pricePerSqFt: property.pricePerSqFt || '',
            estimatedEMI: property.estimatedEMI || '',
            reraStatus: property.reraStatus || '',
            reraRegistrationNumber: property.reraRegistrationNumber || '',
            reraWebsite: property.reraWebsite || '',
            configuration: property.configuration || '',
            facing: property.facing || '',
            overlookingAmenities: property.overlookingAmenities || [],
            possessionDate: property.possessionDate ? new Date(property.possessionDate).toISOString().split('T')[0] : '',
            transactionType: property.transactionType || '',
            propertyOwnership: property.propertyOwnership || '',
            flooring: property.flooring || '',
            parking: property.parking || '',
            propertyCode: property.propertyCode || property.post_id || '',
            widthOfFacingRoad: property.widthOfFacingRoad || '',
            gatedCommunity: property.gatedCommunity || false,
            waterSource: property.waterSource || [],
            powerBackup: property.powerBackup || '',
            petFriendly: property.petFriendly || false,
            agreement: property.agreement || '',
            priceOnRequest: property.priceOnRequest || false,
            verified: property.verified || false,
            anyConstraint: property.anyConstraint || [],
            propertyTypes: property.propertyTypes || [],
            propertyFeatures: property.propertyFeatures || [],
            viewTypes: property.viewTypes || [],
            propertyConditions: property.propertyConditions || [],
            legalStatuses: property.legalStatuses || [],
            constructionStatuses: property.constructionStatuses || [],
            ownershipTypes: property.ownershipTypes || [],
            financingOptions: property.financingOptions || [],
            environmentalCertifications: property.environmentalCertifications || [],
            propertyManagementServices: property.propertyManagementServices || [],
            investmentStrategies: property.investmentStrategies || [],
            tags: property.tags || [],
            facilities: property.facilities || [],
            location_advantage: property.location_advantage || [],
            construction_status: property.construction_status || '',
            possession: property.possession || '',
            region: property.region || '',
            broker_status: property.broker_status || '',
            furnishStatus: property.furnishStatus || '',
            whatsappAlerts: property.whatsappAlerts || false,
            whatsappContact: property.whatsappContact || '',
            profoProxyAllowed: property.profoProxyAllowed || false,
        };
    };

    // Function to prepare draft data for editing - similar to what's already in PropertyAdd
    const prepareDraftDataForEdit = (draftData) => {
        // Function to convert Base64 to File
        const base64ToFile = (base64String, fileName, mimeType) => {
            const byteString = atob(base64String.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);

            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new File([ab], fileName, { type: mimeType || 'image/jpeg' });
        };

        // Process the draft data to restore images
        const processedDraftData = { ...draftData };

        // Restore main image if available
        if (processedDraftData.postImageBase64) {
            try {
                processedDraftData.postImage = base64ToFile(
                    processedDraftData.postImageBase64,
                    processedDraftData.postImageName || 'main-image.jpg'
                );
                // Clean up Base64 data to save memory
                delete processedDraftData.postImageBase64;
            } catch (e) {
                console.error('Failed to restore main image:', e);
            }
        }

        // Restore floor plan image if available
        if (processedDraftData.floorPlanImageBase64) {
            try {
                processedDraftData.floorPlanImage = base64ToFile(
                    processedDraftData.floorPlanImageBase64,
                    processedDraftData.floorPlanImageName || 'floor-plan.jpg'
                );
                // Clean up Base64 data
                delete processedDraftData.floorPlanImageBase64;
            } catch (e) {
                console.error('Failed to restore floor plan image:', e);
            }
        }

        // Restore gallery images if available
        if (processedDraftData.galleryImagesBase64 && Array.isArray(processedDraftData.galleryImagesBase64)) {
            const restoredGallery = [];

            processedDraftData.galleryImagesBase64.forEach((base64String, index) => {
                try {
                    const fileName = processedDraftData.galleryImageNames?.[index] || `gallery-image-${index}.jpg`;
                    const file = base64ToFile(base64String, fileName);
                    restoredGallery.push(file);
                } catch (e) {
                    console.error(`Failed to restore gallery image ${index}:`, e);
                }
            });

            processedDraftData.galleryImages = restoredGallery;
            // Clean up Base64 data
            delete processedDraftData.galleryImagesBase64;
        }

        return processedDraftData;
    };

    // Form state initialization
    const [formData, setFormData] = useState(() => {
        // Check if we have property data from navigation state (from PropertyManagement)
        if (location.state && location.state.property) {
            setIsEditMode(true);
            return preparePropertyDataForEdit(location.state.property);
        }
        // Check if we have draft data from navigation
        else if (location.state && location.state.draftData) {
            const draftData = location.state.draftData;
            return prepareDraftDataForEdit(draftData);
        }

        // Otherwise use the default initial state for new property
        return getDefaultFormData();
    });

    

    

   
    // If in edit mode and propertyId is in the URL, fetch property data if not provided in state
    useEffect(() => {
        if (propertyId && !isEditMode) {
            // Fetch property data by ID
            const fetchPropertyData = async () => {
                setLoading(true);
                try {
                    const details = JSON.parse(localStorage.getItem('user'));
                    const response = await fetch(`${base_url}/api/properties/${propertyId}`, {
                        headers: {
                            'Authorization': `Bearer ${details?.token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch property data');
                    }

                    const data = await response.json();
                    if (data.property) {
                        setIsEditMode(true);
                        setFormData(preparePropertyDataForEdit(data.property));
                    } else {
                        toast.error('Property not found');
                        navigate('/property-management');
                    }
                } catch (error) {
                    console.error('Error fetching property data:', error);
                    toast.error('Failed to load property data');
                    navigate('/property-management');
                } finally {
                    setLoading(false);
                }
            };

            fetchPropertyData();
        }
    }, [propertyId]);

    console.log("formData", formData);
    console.log("isEditMode", isEditMode);

    // Available options for select fields - keep as they were in PropertyAdd
    const propertyTypes = ['Apartment', 'House', 'Shops', 'Warehouses', 'Halls', 'Land'];
    const propertyCategories = ['Residential', 'Commercial', 'Industrial', 'Agricultural'];
    const furnishingOptions = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];
    const directionOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
    const amenitiesOptions = [
        'Parking', 'Lift', 'Power Backup', 'Gas Pipeline', 'Swimming Pool', 'Gym',
        'Club House', 'Children\'s Play Area', 'Garden', 'Security', 'CCTV',
        'Intercom', 'Fire Safety', 'Rain Water Harvesting'
    ];
    const purposeOptions = ['sale', 'rent', 'buy'];
    const transactionTypeOptions = ['New Property', 'Resale'];
    const ownershipOptions = ['Freehold', 'Leasehold', 'Power of Attorney', 'Co-operative Society'];
    const reraStatusOptions = ['Registered', 'Applied', 'Not Applicable'];
    const waterSourceOptions = ['Municipal', 'Borewell', 'Tanker', 'Well'];
    const powerBackupOptions = ['None', 'Partial', 'Full'];
    const flooringOptions = ['Marble', 'Vitrified', 'Wooden', 'Ceramic Tiles', 'Cement', 'Granite', 'Stone'];
    const parkingOptions = ['Open', 'Covered', 'None'];
    const constructionStatusOptions = ['Under Construction', 'Ready to Move', 'New Launch'];
    const configurationOptions = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', '4+ BHK', 'Studio Apartment'];

    // Handle form field changes - same as in PropertyAdd
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            // Handle amenities checkboxes
            if (checked) {
                setFormData({
                    ...formData,
                    amenities: [...formData.amenities, value]
                });
            } else {
                setFormData({
                    ...formData,
                    amenities: formData.amenities.filter(item => item !== value)
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Keep the image handlers - but update them to preserve previous images
    const handlePostImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                postImage: e.target.files[0]
            });
        }
    };

    const handleFloorPlanImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                floorPlanImage: e.target.files[0]
            });
        }
    };

    const handleGalleryImagesUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            galleryImages: [...formData.galleryImages, ...files]
        });
    };

    // Image removal handlers
    const handleRemovePostImage = () => {
        setFormData({
            ...formData,
            postImage: null
        });
    };

    const handleRemoveFloorPlanImage = () => {
        setFormData({
            ...formData,
            floorPlanImage: null
        });
    };

    const handleRemoveGalleryImage = (index) => {
        const newGalleryImages = [...formData.galleryImages];
        newGalleryImages.splice(index, 1);
        setFormData({
            ...formData,
            galleryImages: newGalleryImages
        });
    };

    // Keep other helpers from PropertyAdd
    const handleArrayFieldChange = (e, fieldName) => {
        const { value } = e.target;
        const items = value.split(',').map(item => item.trim()).filter(item => item !== '');

        setFormData({
            ...formData,
            [fieldName]: items
        });
    };

    const handleNumericArrayFieldChange = (e, fieldName) => {
        const { value } = e.target;
        const items = value.split(',')
            .map(item => item.trim())
            .filter(item => item !== '')
            .map(item => Number(item));

        setFormData({
            ...formData,
            [fieldName]: items
        });
    };

    const handleCheckboxArrayChange = (value, fieldName, checked) => {
        if (checked) {
            setFormData({
                ...formData,
                [fieldName]: [...formData[fieldName], value]
            });
        } else {
            setFormData({
                ...formData,
                [fieldName]: formData[fieldName].filter(item => item !== value)
            });
        }
    };

    // Add a function to handle location selection from the map
    const handleLocationSelect = (position) => {
        setFormData({
            ...formData,
            latitude: position.lat,
            longitude: position.lng
        });
    };

    // Navigation steps
    const nextStep = () => {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
    };

    // Draft saving functionality - keep as is
    const saveDraft = () => {
        try {
            // Create a deep copy of the form data without the File objects
            const draftData = { ...formData };

            // Function to convert a File to Base64
            const fileToBase64 = (file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            };

            // Since FileReader is async, we need to use Promise.all
            const prepareDataForStorage = async () => {
                // Handle main image
                if (draftData.postImage instanceof File) {
                    draftData.postImageBase64 = await fileToBase64(draftData.postImage);
                    draftData.postImageName = draftData.postImage.name;
                    draftData.postImage = null; // Clear the File object
                }

                // Handle floor plan image
                if (draftData.floorPlanImage instanceof File) {
                    draftData.floorPlanImageBase64 = await fileToBase64(draftData.floorPlanImage);
                    draftData.floorPlanImageName = draftData.floorPlanImage.name;
                    draftData.floorPlanImage = null;
                }

                // Handle gallery images
                if (draftData.galleryImages && draftData.galleryImages.length > 0) {
                    const galleryBase64 = [];
                    const galleryNames = [];

                    for (const img of draftData.galleryImages) {
                        if (img instanceof File) {
                            galleryBase64.push(await fileToBase64(img));
                            galleryNames.push(img.name);
                        }
                    }

                    draftData.galleryImagesBase64 = galleryBase64;
                    draftData.galleryImageNames = galleryNames;
                    draftData.galleryImages = [];
                }

                // Add draft metadata
                draftData.draftId = `draft_${Date.now()}`;
                draftData.lastUpdated = new Date().toISOString();

                // Get existing drafts
                const existingDrafts = JSON.parse(localStorage.getItem('propertyDrafts') || '[]');

                // Add new draft
                localStorage.setItem('propertyDrafts', JSON.stringify([...existingDrafts, draftData]));

                console.log('Draft saved successfully');
                toast.success('Draft saved successfully');
            };

            prepareDataForStorage();
        } catch (error) {
            console.error('Error saving draft:', error);
            toast.error('Error saving draft: ' + error.message);
        }
    };

    // Submit the form - modify to handle both create and update
    const handleSubmit = async () => {
        setLoading(true);

        try {
            // Prepare form data for API submission
            const propertyData = new FormData();

            // Create main data object for the property
            const mainData = {
                type_name: formData.propertyType,
                post_title: formData.title,
                post_description: formData.description,
                price: formData.price,
                priceUnit: formData.priceUnit,
                area: formData.area,
                areaUnit: formData.areaUnit,
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                balconies: formData.balconies,
                furnishStatus: formData.furnishingStatus,
                property_age: formData.propertyAge,
                floorNumber: formData.floorNumber,
                totalFloors: formData.totalFloors,
                facing: formData.facingDirection,
                address: formData.address,
                city: formData.city,
                locality: formData.locality,
                pincode: formData.pincode,
                amenities: formData.amenities,
                latitude: formData.latitude,
                longitude: formData.longitude,
                purpose: formData.purpose,
                usp: formData.usp,
                ownerName: formData.ownerName,
                contactList: formData.contactList,
                superBuiltupArea: formData.superBuiltupArea,
                carpetArea: formData.carpetArea,
                pricePerSqFt: formData.pricePerSqFt,
                estimatedEMI: formData.estimatedEMI,
                reraStatus: formData.reraStatus,
                reraRegistrationNumber: formData.reraRegistrationNumber,
                reraWebsite: formData.reraWebsite,
                configuration: formData.configuration,
                overlookingAmenities: formData.overlookingAmenities,
                possessionDate: formData.possessionDate ? new Date(formData.possessionDate) : undefined,
                transactionType: formData.transactionType,
                propertyOwnership: formData.propertyOwnership,
                flooring: formData.flooring,
                parking: formData.parking,
                propertyCode: formData.propertyCode,
                widthOfFacingRoad: formData.widthOfFacingRoad,
                gatedCommunity: formData.gatedCommunity,
                waterSource: formData.waterSource,
                powerBackup: formData.powerBackup,
                petFriendly: formData.petFriendly,
                agreement: formData.agreement,
                priceOnRequest: formData.priceOnRequest,
                tags: formData.tags,
                facilities: formData.facilities,
                location_advantage: formData.location_advantage,
                construction_status: formData.construction_status,
                possession: formData.possession,
                region: formData.region,
                category: categoryMap[formData.propertyCategory] || 0,
                broker_status: formData.broker_status,
                propertyTypes: [formData.propertyType],
                propertyFeatures: formData.propertyFeatures,
                viewTypes: formData.viewTypes,
                propertyConditions: formData.propertyConditions,
                legalStatuses: formData.legalStatuses,
                constructionStatuses: [formData.construction_status].filter(Boolean),
                ownershipTypes: [formData.propertyOwnership].filter(Boolean),
                financingOptions: formData.financingOptions,
                environmentalCertifications: formData.environmentalCertifications,
                propertyManagementServices: formData.propertyManagementServices,
                investmentStrategies: formData.investmentStrategies,
                whatsappAlerts: formData.whatsappAlerts || false,
                whatsappContact: formData.whatsappContact || '',
                profoProxyAllowed: formData.profoProxyAllowed || false,
            };

            // Add user information
            if (user && user.id) {
                mainData.user_id = user.id;
            }

            // For new properties, generate a post_id
            if (!isEditMode) {
                mainData.post_id = `PROP${Date.now()}`;
            }

            // Append the main data as a JSON string
            propertyData.append('data', JSON.stringify(mainData));

            // Add images only if they've been selected (for new uploads)
            if (formData.postImage) {
                propertyData.append('post_image', formData.postImage);
            }

            if (formData.floorPlanImage) {
                propertyData.append('floor_plan_image', formData.floorPlanImage);
            }

            // Add gallery images
            if (formData.galleryImages && formData.galleryImages.length > 0) {
                formData.galleryImages.forEach(image => {
                    propertyData.append('galleryList', image);
                });
            }

            // Get auth token
            const details = JSON.parse(localStorage.getItem('user'));

            // Determine if we're creating or updating
            let url, method;
            if (isEditMode) {
                // Update existing property
                url = `${base_url}/api/properties/${propertyId || formData.propertyCode}`;
                method = 'PUT';
            } else {
                // Create new property
                url = `${base_url}/api/upload/property`;
                method = 'POST';
            }

            // Submit to API
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${details?.token}`
                },
                body: propertyData,
            });

            const data = await response.json();
            console.log("API Response:", data);

            if (data?.success === true) {
                toast.success(isEditMode ? 'Property updated successfully!' : 'Property submitted successfully!');
                // Navigate to property management after successful submission
                setFormData({});
                navigate('/property-management');
            } else {
                toast.error(`${isEditMode ? 'Update' : 'Submission'} failed: ${data.message || 'Unknown error'}`);
                if (data.error) {
                    toast.error(`${data.error}`);
                }
                console.error(`Error ${isEditMode ? 'updating' : 'submitting'} property:`, data);
            }
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'submitting'} property:`, error);
            toast.error(`Failed to ${isEditMode ? 'update' : 'submit'} property: ${error.message}`);
        } finally {
            // Always set loading to false regardless of success/failure
            setLoading(false);
        }
    };

    // Render form with conditional heading for add vs edit
    return (
        <div className="">
            {/* Header */}
            <div className="mx-auto">
                {/* Add AutofillOptions here */}
                <div className="mx-auto ">
                    <AutofillOptions
                        onSelect={(data) => {
                            setFormData({
                                ...formData,
                                ...data
                            });
                        }}
                    />
                </div>
                <Steps
                    current={currentStep - 1}
                    percent={((currentStep - 1) / 3) * 100}
                    items={[
                        {
                            title: 'Basic Details',
                            description: currentStep === 1 ? 'Current step' : '',
                        },
                        {
                            title: 'Location',
                            description: currentStep === 2 ? 'Current step' : '',
                        },
                        {
                            title: 'Property Details',
                            description: currentStep === 3 ? 'Current step' : '',
                        },
                        {
                            title: 'Photos & Amenities',
                            description: currentStep === 4 ? 'Current step' : '',
                        },
                        {
                            title: 'Ownership & Legal',
                            description: currentStep === 5 ? 'Current step' : '',
                        },
                        {
                            title: 'Additional Features',
                            description: currentStep === 6 ? 'Current step' : '',
                        },
                        {
                            title: 'USP & Tags',
                            description: currentStep === 7 ? 'Current step' : '',
                        }
                    ]}
                />
            </div>

            {/* Form content */}
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-2">
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    {/* Title for Add/Edit mode */}
                    <h1 className="text-xl font-bold text-gray-900 mb-4">
                        {isEditMode ? 'Edit Property' : 'Add New Property'}
                    </h1>

                    {isEditMode && (
                        <div className="bg-blue-50 p-4 rounded-md mb-6">
                            <p className="text-sm text-blue-700">
                                You are editing property <strong>{formData.propertyCode || propertyId}</strong>.
                                Only fields you change will be updated. Images will only be updated if you select new ones.
                            </p>
                            {originalImages.postImage && (
                                <div className="mt-2">
                                    <p className="text-xs text-blue-600">Current main image:
                                        <a href={originalImages.postImage} target="_blank" rel="noopener noreferrer" className="underline ml-1">View</a>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    {currentStep === 7 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Unique Selling Points & Tags</h2>

                            <div className="mb-6">
                                <label htmlFor="usp" className="block text-sm font-medium text-gray-700 mb-1">
                                    Unique Selling Points
                                </label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {['Close to metro', 'Spacious rooms', '24x7 security', 'Clubhouse access', 'Corner property', 'Garden view'].map((point) => (
                                        <div key={point} className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id={`usp-${point}`}
                                                    name="usp"
                                                    type="checkbox"
                                                    value={point}
                                                    checked={formData?.usp?.includes(point)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormData({
                                                                ...formData,
                                                                usp: [...(formData.usp || []), point]
                                                            });
                                                        } else {
                                                            setFormData({
                                                                ...formData,
                                                                usp: (formData.usp || []).filter(item => item !== point)
                                                            });
                                                        }
                                                    }}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="ml-2 text-sm">
                                                <label htmlFor={`usp-${point}`} className="text-gray-700">
                                                    {point}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3">
                                    <label htmlFor="customUsp" className="block text-sm font-medium text-gray-700 mb-1">
                                        Add Custom USP
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            id="customUsp"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="E.g. Near international school"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                const customUsp = document.getElementById('customUsp').value.trim();
                                                if (customUsp && !(formData.usp || []).includes(customUsp)) {
                                                    setFormData({
                                                        ...formData,
                                                        usp: [...(formData.usp || []), customUsp]
                                                    });
                                                    document.getElementById('customUsp').value = '';
                                                }
                                            }}
                                            className="px-3 py-2 border-y border-r border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {formData?.usp?.length > 0 && (
                                    <div className="mt-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Selected USPs:</label>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.usp.map((point, index) => (
                                                <div key={index} className="bg-blue-100 px-3 py-1 rounded-full flex items-center">
                                                    <span className="text-sm text-blue-800">{point}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({
                                                                ...formData,
                                                                usp: formData.usp.filter((_, i) => i !== index)
                                                            });
                                                        }}
                                                        className="ml-1 text-blue-800 hover:text-blue-900"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mb-6">
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tags
                                </label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {['Spacious', 'Corner unit', 'Garden view', 'Well ventilated', 'Vastu compliant', 'Luxury', 'Investment']?.map((tag) => (
                                        <div key={tag} className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id={`tag-${tag}`}
                                                    name="tags"
                                                    type="checkbox"
                                                    value={tag}
                                                    checked={(formData?.tags || []).includes(tag)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormData({
                                                                ...formData,
                                                                tags: [...(formData.tags || []), tag]
                                                            });
                                                        } else {
                                                            setFormData({
                                                                ...formData,
                                                                tags: (formData?.tags || []).filter(item => item !== tag)
                                                            });
                                                        }
                                                    }}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="ml-2 text-sm">
                                                <label htmlFor={`tag-${tag}`} className="text-gray-700">
                                                    {tag}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3">
                                    <label htmlFor="customTag" className="block text-sm font-medium text-gray-700 mb-1">
                                        Add Custom Tag
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            id="customTag"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="E.g. Newly renovated"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                const customTag = document.getElementById('customTag').value.trim();
                                                if (customTag && !(formData.tags || []).includes(customTag)) {
                                                    setFormData({
                                                        ...formData,
                                                        tags: [...(formData.tags || []), customTag]
                                                    });
                                                    document.getElementById('customTag').value = '';
                                                }
                                            }}
                                            className="px-3 py-2 border-y border-r border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {(formData?.tags || []).length > 0 && (
                                    <div className="mt-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Selected Tags:</label>
                                        <div className="flex flex-wrap gap-2">
                                            {(formData?.tags || []).map((tag, index) => (
                                                <div key={index} className="bg-green-100 px-3 py-1 rounded-full flex items-center">
                                                    <span className="text-sm text-green-800">{tag}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({
                                                                ...formData,
                                                                tags: formData.tags.filter((_, i) => i !== index)
                                                            });
                                                        }}
                                                        className="ml-1 text-green-800 hover:text-green-900"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mb-6">
                                <label htmlFor="overlookingAmenities" className="block text-sm font-medium text-gray-700 mb-1">
                                    Overlooking Amenities
                                </label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {['Pool', 'Garden', 'Park', 'Main Road', 'Lake', 'Sea', 'Mountain'].map((amenity) => (
                                        <div key={amenity} className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id={`overlook-${amenity}`}
                                                    name="overlookingAmenities"
                                                    type="checkbox"
                                                    value={amenity}
                                                    checked={(formData.overlookingAmenities || []).includes(amenity)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormData({
                                                                ...formData,
                                                                overlookingAmenities: [...(formData.overlookingAmenities || []), amenity]
                                                            });
                                                        } else {
                                                            setFormData({
                                                                ...formData,
                                                                overlookingAmenities: (formData.overlookingAmenities || []).filter(item => item !== amenity)
                                                            });
                                                        }
                                                    }}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="ml-2 text-sm">
                                                <label htmlFor={`overlook-${amenity}`} className="text-gray-700">
                                                    {amenity}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="location_advantage" className="block text-sm font-medium text-gray-700 mb-1">
                                    Location Advantages
                                </label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {['Near School', 'Shopping Mall', 'Hospital', 'Metro Station', 'Bus Stop', 'Airport', 'Railway Station'].map((advantage) => (
                                        <div key={advantage} className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id={`location-${advantage}`}
                                                    name="location_advantage"
                                                    type="checkbox"
                                                    value={advantage}
                                                    checked={(formData.location_advantage || []).includes(advantage)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormData({
                                                                ...formData,
                                                                location_advantage: [...(formData.location_advantage || []), advantage]
                                                            });
                                                        } else {
                                                            setFormData({
                                                                ...formData,
                                                                location_advantage: (formData.location_advantage || []).filter(item => item !== advantage)
                                                            });
                                                        }
                                                    }}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="ml-2 text-sm">
                                                <label htmlFor={`location-${advantage}`} className="text-gray-700">
                                                    {advantage}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3">
                                    <label htmlFor="customAdvantage" className="block text-sm font-medium text-gray-700 mb-1">
                                        Add Custom Location Advantage
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            id="customAdvantage"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="E.g. Near international school"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                const customAdvantage = document.getElementById('customAdvantage').value.trim();
                                                if (customAdvantage && !(formData.location_advantage || []).includes(customAdvantage)) {
                                                    setFormData({
                                                        ...formData,
                                                        location_advantage: [...(formData.location_advantage || []), customAdvantage]
                                                    });
                                                    document.getElementById('customAdvantage').value = '';
                                                }
                                            }}
                                            className="px-3 py-2 border-y border-r border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="contactList" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Numbers
                                </label>
                                <div className="mb-2">
                                    <input
                                        type="tel"
                                        id="contactNumber"
                                        placeholder="Enter contact number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        pattern="[0-9]{10}"
                                        maxLength="10"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Enter a 10-digit mobile number
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const contactNumberInput = document.getElementById('contactNumber');
                                        const contactNumber = contactNumberInput.value.trim();
                                        if (contactNumber && contactNumber.length === 10 && !isNaN(contactNumber)) {
                                            const contactListArray = formData.contactList || [];
                                            if (!contactListArray.includes(Number(contactNumber))) {
                                                setFormData({
                                                    ...formData,
                                                    contactList: [...contactListArray, Number(contactNumber)]
                                                });
                                                contactNumberInput.value = '';
                                            }
                                        }
                                    }}
                                    className="mb-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Add Contact Number
                                </button>

                                {(formData.contactList || []).length > 0 && (
                                    <div className="mt-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Added Contact Numbers:</label>
                                        <div className="flex flex-wrap gap-2">
                                            {(formData.contactList || []).map((number, index) => (
                                                <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                                                    <span className="text-sm text-gray-800">{number}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({
                                                                ...formData,
                                                                contactList: (formData.contactList || []).filter((_, i) => i !== index)
                                                            });
                                                        }}
                                                        className="ml-1 text-gray-600 hover:text-gray-900"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* WhatsApp and ProxiPro Options */}
                            <div className="mt-6 border-t pt-6">
                                <h3 className="text-md font-medium text-gray-800 mb-4">Communication Preferences</h3>

                                <div className="space-y-4">
                                    {/* WhatsApp Alerts */}
                                    <div className="flex items-center">
                                        <input
                                            id="whatsappAlerts"
                                            name="whatsappAlerts"
                                            type="checkbox"
                                            checked={formData.whatsappAlerts || false}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                whatsappAlerts: e.target.checked
                                            })}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="whatsappAlerts" className="ml-2 block text-sm text-gray-700">
                                            Enable WhatsApp alerts for property inquiries
                                        </label>
                                    </div>

                                    {/* WhatsApp Contact Number - only show if whatsappAlerts is true */}
                                    {formData.whatsappAlerts && (
                                        <div>
                                            <label htmlFor="whatsappContact" className="block text-sm font-medium text-gray-700 mb-1">
                                                WhatsApp Contact Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="whatsappContact"
                                                name="whatsappContact"
                                                value={formData.whatsappContact || ''}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter WhatsApp number"
                                                pattern="[0-9]{10}"
                                                maxLength="10"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Enter a 10-digit WhatsApp number where you want to receive alerts
                                            </p>
                                        </div>
                                    )}

                                    {/* ProxiPro Allowed */}
                                    <div className="flex items-center">
                                        <input
                                            id="profoProxyAllowed"
                                            name="profoProxyAllowed"
                                            type="checkbox"
                                            checked={formData.profoProxyAllowed || false}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                profoProxyAllowed: e.target.checked
                                            })}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="profoProxyAllowed" className="ml-2 block text-sm text-gray-700">
                                            Allow ProxiPro agents to represent this property
                                        </label>
                                        <span className="ml-1 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                            Recommended
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 ml-6">
                                        When enabled, certified ProxiPro agents can represent your property to potential buyers/tenants, increasing your chances of a successful deal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}                    {/* Step 6: Additional Property Features */}
                    {currentStep === 6 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Additional Property Features</h2>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="carpetArea" className="block text-sm font-medium text-gray-700 mb-1">
                                        Carpet Area
                                    </label>
                                    <input
                                        type="number"
                                        id="carpetArea"
                                        name="carpetArea"
                                        value={formData.carpetArea}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Carpet Area"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="superBuiltupArea" className="block text-sm font-medium text-gray-700 mb-1">
                                        Super Built-up Area
                                    </label>
                                    <input
                                        type="number"
                                        id="superBuiltupArea"
                                        name="superBuiltupArea"
                                        value={formData.superBuiltupArea}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Super Built-up Area"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="flooring" className="block text-sm font-medium text-gray-700 mb-1">
                                        Flooring
                                    </label>
                                    <select
                                        id="flooring"
                                        name="flooring"
                                        value={formData.flooring}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {flooringOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="parking" className="block text-sm font-medium text-gray-700 mb-1">
                                        Parking
                                    </label>
                                    <select
                                        id="parking"
                                        name="parking"
                                        value={formData.parking}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {parkingOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="powerBackup" className="block text-sm font-medium text-gray-700 mb-1">
                                        Power Backup
                                    </label>
                                    <select
                                        id="powerBackup"
                                        name="powerBackup"
                                        value={formData.powerBackup}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {powerBackupOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="widthOfFacingRoad" className="block text-sm font-medium text-gray-700 mb-1">
                                        Width of Facing Road (in feet)
                                    </label>
                                    <input
                                        type="number"
                                        id="widthOfFacingRoad"
                                        name="widthOfFacingRoad"
                                        value={formData.widthOfFacingRoad}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Road Width"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Water Sources
                                    </label>
                                    <div className="space-y-2">
                                        {waterSourceOptions.map((source) => (
                                            <div key={source} className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id={`water-${source}`}
                                                        name="waterSource"
                                                        type="checkbox"
                                                        value={source}
                                                        checked={formData?.waterSource?.includes(source)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFormData({
                                                                    ...formData,
                                                                    waterSource: [...(formData.waterSource || []), source]
                                                                });
                                                            } else {
                                                                setFormData({
                                                                    ...formData,
                                                                    waterSource: (formData.waterSource || []).filter(item => item !== source)
                                                                });
                                                            }
                                                        }}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="ml-2 text-sm">
                                                    <label htmlFor={`water-${source}`} className="text-gray-700">
                                                        {source}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            id="gatedCommunity"
                                            name="gatedCommunity"
                                            type="checkbox"
                                            checked={formData.gatedCommunity}
                                            onChange={(e) => setFormData({ ...formData, gatedCommunity: e.target.checked })}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="gatedCommunity" className="ml-2 block text-sm text-gray-700">
                                            Gated Community
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="petFriendly"
                                            name="petFriendly"
                                            type="checkbox"
                                            checked={formData.petFriendly}
                                            onChange={(e) => setFormData({ ...formData, petFriendly: e.target.checked })}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="petFriendly" className="ml-2 block text-sm text-gray-700">
                                            Pet Friendly
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}                    {/* Step 5: Ownership & Legal Details */}
                    {currentStep === 5 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Ownership & Legal Details</h2>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Owner Name
                                    </label>
                                    <input
                                        type="text"
                                        id="ownerName"
                                        name="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Property Owner's Name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="propertyOwnership" className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Ownership
                                    </label>
                                    <select
                                        id="propertyOwnership"
                                        name="propertyOwnership"
                                        value={formData.propertyOwnership}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {ownershipOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700 mb-1">
                                        Transaction Type
                                    </label>
                                    <select
                                        id="transactionType"
                                        name="transactionType"
                                        value={formData.transactionType}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {transactionTypeOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="reraStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                        RERA Status
                                    </label>
                                    <select
                                        id="reraStatus"
                                        name="reraStatus"
                                        value={formData.reraStatus}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {reraStatusOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                {formData.reraStatus === 'Registered' && (
                                    <div>
                                        <label htmlFor="reraRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                            RERA Registration Number
                                        </label>
                                        <input
                                            type="text"
                                            id="reraRegistrationNumber"
                                            name="reraRegistrationNumber"
                                            value={formData.reraRegistrationNumber}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="RERA Registration Number"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="possession" className="block text-sm font-medium text-gray-700 mb-1">
                                        Possession
                                    </label>
                                    <input
                                        type="date"
                                        id="possessionDate"
                                        name="possessionDate"
                                        value={formData.possessionDate}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="construction_status" className="block text-sm font-medium text-gray-700 mb-1">
                                        Construction Status
                                    </label>
                                    <select
                                        id="construction_status"
                                        name="construction_status"
                                        value={formData.construction_status}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {constructionStatusOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex items-center">
                                    <input
                                        id="priceOnRequest"
                                        name="priceOnRequest"
                                        type="checkbox"
                                        checked={formData.priceOnRequest}
                                        onChange={(e) => setFormData({ ...formData, priceOnRequest: e.target.checked })}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="priceOnRequest" className="ml-2 block text-sm text-gray-700">
                                        Price on Request (Hide actual price)
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}{/* Step 1: Basic Details */}
                    {currentStep === 1 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Details</h2>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Type*
                                    </label>
                                    <select
                                        id="propertyType"
                                        name="propertyType"
                                        value={formData.propertyType}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Property Type</option>
                                        {propertyTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="propertyCategory" className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Category*
                                    </label>
                                    <select
                                        id="propertyCategory"
                                        name="propertyCategory"
                                        value={formData.propertyCategory}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Category</option>
                                        {propertyCategories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                                        Bedrooms
                                    </label>
                                    <select
                                        id="bedrooms"
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {[1, 2, 3, 4, 5, '5+'].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                                        Bathrooms
                                    </label>
                                    <select
                                        id="bathrooms"
                                        name="bathrooms"
                                        value={formData.bathrooms}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {[1, 2, 3, 4, 5, '5+'].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="balconies" className="block text-sm font-medium text-gray-700 mb-1">
                                        Balconies
                                    </label>
                                    <select
                                        id="balconies"
                                        name="balconies"
                                        value={formData.balconies}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {[0, 1, 2, 3, 4, '4+'].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="furnishingStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                        Furnishing Status
                                    </label>
                                    <select
                                        id="furnishingStatus"
                                        name="furnishingStatus"
                                        value={formData.furnishingStatus}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {furnishingOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                                        Purpose*
                                    </label>
                                    <select
                                        id="purpose"
                                        name="purpose"
                                        value={formData.purpose}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {purposeOptions.map(option => (
                                            <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="configuration" className="block text-sm font-medium text-gray-700 mb-1">
                                        Configuration
                                    </label>
                                    <select
                                        id="configuration"
                                        name="configuration"
                                        value={formData.configuration}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {configurationOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Location Details */}
                    {currentStep === 2 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Location Details</h2>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                        Address*
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Street address"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                            City*
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="City"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="locality" className="block text-sm font-medium text-gray-700 mb-1">
                                            Locality/Area*
                                        </label>
                                        <input
                                            type="text"
                                            id="locality"
                                            name="locality"
                                            value={formData.locality}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Locality"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                                            PIN Code*
                                        </label>
                                        <input
                                            type="text"
                                            id="pincode"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="PIN Code"
                                            pattern="[0-9]*"
                                            maxLength="6"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="facingDirection" className="block text-sm font-medium text-gray-700 mb-1">
                                            Facing Direction
                                        </label>
                                        <select
                                            id="facingDirection"
                                            name="facingDirection"
                                            value={formData.facingDirection}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select</option>
                                            {directionOptions.map(direction => (
                                                <option key={direction} value={direction}>{direction}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Google Maps Location Picker Integration */}
                                <LocationPicker
                                    address={formData.address}
                                    city={formData.city}
                                    initialLatitude={formData.latitude}
                                    initialLongitude={formData.longitude}
                                    onLocationSelect={handleLocationSelect}
                                />

                                {/* Display selected coordinates */}
                                {formData.latitude && formData.longitude && (
                                    <div className="text-sm text-gray-700">
                                        <p>Selected location coordinates: {typeof formData.latitude === 'number' ? formData.latitude.toFixed(6) : formData.latitude}, {typeof formData.longitude === 'number' ? formData.longitude.toFixed(6) : formData.longitude}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            These coordinates will be used to show your property's location on maps.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Property Details */}
                    {currentStep === 3 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Property Details</h2>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Title*
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g. 3BHK Apartment in Civil Lines"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description*
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Describe your property..."
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                            Price*
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                required
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Amount"
                                            />
                                            <select
                                                name="priceUnit"
                                                value={formData.priceUnit}
                                                onChange={handleChange}
                                                className="w-24 border-y border-r border-gray-300 rounded-r-md bg-gray-50 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="thousand">Thousand</option>
                                                <option value="lakh">Lakh</option>
                                                <option value="crore">Crore</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                                            Area*
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="number"
                                                id="area"
                                                name="area"
                                                value={formData.area}
                                                onChange={handleChange}
                                                required
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Area"
                                            />
                                            <select
                                                name="areaUnit"
                                                value={formData.areaUnit}
                                                onChange={handleChange}
                                                className="w-24 border-y border-r border-gray-300 rounded-r-md bg-gray-50 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="sqft">sq.ft</option>
                                                <option value="sqm">sq.m</option>
                                                <option value="acres">acres</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="propertyAge" className="block text-sm font-medium text-gray-700 mb-1">
                                            Property Age
                                        </label>
                                        <select
                                            id="propertyAge"
                                            name="propertyAge"
                                            value={formData.propertyAge}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="new">New Construction</option>
                                            <option value="<5">Less than 5 years</option>
                                            <option value="5-10">5-10 years</option>
                                            <option value="10+">10+ years</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="floorNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                                Floor Number
                                            </label>
                                            <input
                                                type="number"
                                                id="floorNumber"
                                                name="floorNumber"
                                                value={formData.floorNumber}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Floor"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="totalFloors" className="block text-sm font-medium text-gray-700 mb-1">
                                                Total Floors
                                            </label>
                                            <input
                                                type="number"
                                                id="totalFloors"
                                                name="totalFloors"
                                                value={formData.totalFloors}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Total Floors"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Photos & Amenities */}
                    {currentStep === 4 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Photos & Amenities</h2>

                            {/* Main Property Image */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Main Property Image{isEditMode ? '' : '*'}
                                </label>
                                {isEditMode && originalImages.postImage && (
                                    <div className="mb-2 p-2 bg-gray-50 rounded-md">
                                        <div className="flex items-center">
                                            <img
                                                src={originalImages.postImage}
                                                alt="Current main image"
                                                className="h-20 w-20 object-cover rounded mr-3"
                                            />
                                            <div>
                                                <p className="text-sm text-gray-700">Current main image</p>
                                                <p className="text-xs text-gray-500">Upload a new image to replace it</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    {formData.postImage ? (
                                        <div className="relative rounded-lg overflow-hidden h-40 mb-2">
                                            {typeof formData.postImage === 'object' && formData.postImage instanceof File ? (
                                                <img
                                                    src={URL.createObjectURL(formData.postImage)}
                                                    alt="Main property image"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Image needs to be re-uploaded
                                                    </p>
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={handleRemovePostImage}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {isEditMode
                                                    ? 'Upload a new main image (optional)'
                                                    : 'Upload the main image of your property (required)'}
                                            </p>
                                            <div className="mt-4">
                                                <label htmlFor="post-image-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                    <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    Upload Main Image
                                                </label>
                                                <input
                                                    id="post-image-upload"
                                                    name="post-image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePostImageUpload}
                                                    className="sr-only"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Floor Plan Image */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Floor Plan Image
                                </label>
                                {isEditMode && originalImages.floorPlanImage && (
                                    <div className="mb-2 p-2 bg-gray-50 rounded-md">
                                        <div className="flex items-center">
                                            <img
                                                src={originalImages.floorPlanImage}
                                                alt="Current floor plan"
                                                className="h-20 w-20 object-cover rounded mr-3"
                                            />
                                            <div>
                                                <p className="text-sm text-gray-700">Current floor plan</p>
                                                <p className="text-xs text-gray-500">Upload a new image to replace it</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    {formData.floorPlanImage ? (
                                        <div className="relative rounded-lg overflow-hidden h-40 mb-2">
                                            {typeof formData.floorPlanImage === 'object' && formData.floorPlanImage instanceof File ? (
                                                <img
                                                    src={URL.createObjectURL(formData.floorPlanImage)}
                                                    alt="Floor plan"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                    </svg>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Floor plan needs to be re-uploaded
                                                    </p>
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={handleRemoveFloorPlanImage}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {isEditMode
                                                    ? 'Upload a new floor plan (optional)'
                                                    : 'Upload your property\'s floor plan'}
                                            </p>
                                            <div className="mt-4">
                                                <label htmlFor="floor-plan-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                    <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    Upload Floor Plan
                                                </label>
                                                <input
                                                    id="floor-plan-upload"
                                                    name="floor-plan-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFloorPlanImageUpload}
                                                    className="sr-only"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Gallery Images */}
                            <div className="mb-8">
                                <div className="mb-2 flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Gallery Images
                                    </label>
                                    <span className="text-xs text-gray-500">
                                        {formData?.galleryImages?.length || 0} of 10 photos added
                                    </span>
                                </div>

                                {isEditMode && originalImages.galleryImages && originalImages.galleryImages.length > 0 && (
                                    <div className="mb-3 p-2 bg-gray-50 rounded-md">
                                        <p className="text-sm text-gray-700 mb-2">Current gallery images:</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {originalImages.galleryImages.slice(0, 4).map((imgUrl, idx) => (
                                                <img
                                                    key={idx}
                                                    src={imgUrl}
                                                    alt={`Gallery image ${idx + 1}`}
                                                    className="h-16 w-full object-cover rounded"
                                                />
                                            ))}
                                            {originalImages.galleryImages.length > 4 && (
                                                <div className="h-16 flex items-center justify-center bg-gray-100 rounded">
                                                    <p className="text-xs text-gray-500">+{originalImages.galleryImages.length - 4} more</p>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {isEditMode
                                                ? "New uploads will be added to the gallery. Existing images can only be managed after updating."
                                                : ""}
                                        </p>
                                    </div>
                                )}

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    {formData.galleryImages && formData.galleryImages.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-4">
                                            {formData?.galleryImages?.map((image, index) => (
                                                <div key={index} className="relative rounded-lg overflow-hidden h-24">
                                                    {typeof image === 'object' && image instanceof File ? (
                                                        <img
                                                            src={URL.createObjectURL(image)}
                                                            alt={`Gallery image ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                            <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveGalleryImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}

                                    {(formData.galleryImages?.length || 0) < 10 && (
                                        <div>
                                            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Upload up to 10 additional property photos
                                            </p>
                                            <div className="mt-4">
                                                <label htmlFor="gallery-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                    <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    Upload Gallery Photos
                                                </label>
                                                <input
                                                    id="gallery-upload"
                                                    name="gallery-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleGalleryImagesUpload}
                                                    className="sr-only"
                                                />
                                            </div>
                                            <p className="mt-2 text-xs text-gray-500">
                                                PNG, JPG, GIF up to 5MB each
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Amenities section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amenities
                                </label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                    {amenitiesOptions.map((amenity) => (
                                        <div key={amenity} className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id={`amenity-${amenity}`}
                                                    name="amenities"
                                                    type="checkbox"
                                                    value={amenity}
                                                    checked={formData.amenities?.includes(amenity)}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="ml-2 text-sm">
                                                <label htmlFor={`amenity-${amenity}`} className="text-gray-700">
                                                    {amenity}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation buttons with conditional text for Edit/Add modes */}
                    <div className="flex justify-between mt-8">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Previous
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {currentStep < 7 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Next
                                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        ) : (
                            <div className='flex gap-2'>
                                {/* Return to property management without saving */}
                                <button
                                    type="button"
                                    onClick={() => navigate('/property-management')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={() => saveDraft()}
                                    disabled={loading}
                                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    Save As Draft
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {isEditMode ? 'Updating...' : 'Submitting...'}
                                        </>
                                    ) : (
                                        <>
                                            {isEditMode ? 'Update Property' : 'Submit Property'}
                                            <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyAddEdit; 