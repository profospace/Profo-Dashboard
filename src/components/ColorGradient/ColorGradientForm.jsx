import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { base_url } from '../../../utils/base_url';

const ColorGradientForm = ({ onSubmitSuccess }) => {
    // Form state
    const [formData, setFormData] = useState({
        header: {
            startColor: "#ffffff",
            endColor: "#ffffff"
        },
        button: {
            startColor: "#ee0979",
            endColor: "#ff6a00"
        },
        buttonBackground: {
            startColor: "#ee0979",
            endColor: "#ff6a00"
        },
        list_title_size: {
            color: "#333333",
            backgroundColor: "#f2f2f2"
        },
        listbackground: {
            backgroundColor: "#ededed"
        },
        search_filter: {
            backgroundColor: "#000000"
        },
        list_price_size: 14,
        markerColor: "#e1faeb",
        constantData: {
            filterUnselectedColor: "",
            filterSelectedColor: "",
            fabColor: "",
            loaderIcon: "",
            headerText: "",
            iosAppStoreLink:"",
            progressGif: "",
            listEndImage: "",
            listAds: "",
            searchAds: "",
            maxListAds: "",
            autoPlayAds: false,
            iosUpdateType : false,
            androidUpdateType : false,
            headerBackgroundImage: "",
            iosAppVersion:"",
            isPropertyUpload: false,
            homeUrls: [],
            isStrokeFilter: false,
            isMaterialElevation: false,
            headerHeight: 400,
            appPackageName: "",
            defaultLanguage: "",
            currencyCode: "",
            appName: "",
            appEmail: "",
            appLogo: "",
            appCompany: "",
            appWebsite: "",
            appContact: "",
            facebookLink: "",
            twitterLink: "",
            instagramLink: "",
            youtubeLink: "",
            googlePlayLink: "",
            appleStoreLink: "",
            appVersion: "",
            appUpdateHideShow: "",
            appUpdateVersionCode: 0,
            appUpdateDesc: "",
            appUpdateLink: "",
            appUpdateCancelOption: "",
            priceColor: "#000000",
            callButtonColor: "#e1faeb",
            DetailPageButtonColor: {
                startColor: "#e1faeb",
                endColor: "#e1faeb"
            },
            isCallDirect: false,
            homePageLayoutOrder: [1, 3, 4, 5, 6],
            shadowOnImage: false,

            progressGif: "",
            listEndImage: "",
            listAds: "",
            searchAds: "",
            maxListAds: "",

            userprofileHeader: "",
            bottomImage: ""
        },

       
    });

    // Active section state for accordion
    const [activeSection, setActiveSection] = useState('header');

    // Loading states
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Color palette suggestions
    const [showPalette, setShowPalette] = useState(false);

    // Color palettes
    const colorPalettes = useMemo(() => [
        {
            name: "Ocean Blue",
            header: { startColor: "#0575E6", endColor: "#021B79" },
            button: { startColor: "#02AABD", endColor: "#00CDAC" },
            accent: "#5EFCE8",
            text: "#2C3E50",
            background: "#F8FAFC"
        },
        {
            name: "Sunset Orange",
            header: { startColor: "#FF512F", endColor: "#DD2476" },
            button: { startColor: "#FF8008", endColor: "#FFC837" },
            accent: "#FEF9E7",
            text: "#4A4A4A",
            background: "#FFFCF9"
        },
        {
            name: "Forest Green",
            header: { startColor: "#56ab2f", endColor: "#a8e063" },
            button: { startColor: "#02AAB0", endColor: "#00CDAC" },
            accent: "#E2F0CB",
            text: "#4A453F",
            background: "#FBFEF9"
        },
        {
            name: "Royal Purple",
            header: { startColor: "#8E2DE2", endColor: "#4A00E0" },
            button: { startColor: "#DA22FF", endColor: "#9733EE" },
            accent: "#F8F0FC",
            text: "#2D2D2D",
            background: "#FCFAFF"
        }
    ], []);

    // Fetch color data when component mounts
    useEffect(() => {
        fetchColorData();
    }, []);

    // Function to fetch existing color data
    const fetchColorData = async () => {
        try {
            const response = await axios.get(`${base_url}/api/colors`);
            if (response.data) {
                // Merge the response data with the default state, keeping default values for missing fields
                setFormData(prevState => {
                    // Helper function to deep merge objects
                    const mergeDeep = (target, source) => {
                        if (!source) return target;
                        const result = { ...target };
                        Object.keys(source).forEach(key => {
                            if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                                if (typeof target[key] === 'object' && target[key] !== null && !Array.isArray(target[key])) {
                                    result[key] = mergeDeep(target[key], source[key]);
                                } else {
                                    result[key] = { ...source[key] };
                                }
                            } else {
                                if (source[key] !== 'NA') {
                                    result[key] = source[key];
                                }
                            }
                        });
                        return result;
                    };
                    return mergeDeep(prevState, response.data);
                });

                // Pass the initial data to parent for preview
                if (onSubmitSuccess && typeof onSubmitSuccess === 'function') {
                    onSubmitSuccess(response.data);
                }
            }
        } catch (error) {
            console.error('Error fetching color data:', error);
            toast.error('Failed to load existing color settings');
        } finally {
            setInitialLoading(false);
        }
    };

    // Handle input change for color pickers and text inputs
    const handleColorChange = (section, field, value) => {
        setFormData(prevState => {
            if (section) {
                return {
                    ...prevState,
                    [section]: {
                        ...prevState[section],
                        [field]: value
                    }
                };
            } else {
                return {
                    ...prevState,
                    [field]: value
                };
            }
        });
    };

    // Handle input change for constantData
    const handleConstantDataChange = (field, value) => {
        setFormData(prevState => ({
            ...prevState,
            constantData: {
                ...prevState.constantData,
                [field]: value
            }
        }));
    };


    // Handle pageLink input changes
    const handlePageLinkChange = (field, value) => {
        setFormData(prevState => ({
            ...prevState,
            pageLink: {
                ...prevState.pageLink,
                [field]: value
            }
        }));
    };


    // Handle DetailPageButtonColor changes
    const handleDetailButtonColorChange = (field, value) => {
        setFormData(prevState => ({
            ...prevState,
            constantData: {
                ...prevState.constantData,
                DetailPageButtonColor: {
                    ...prevState.constantData.DetailPageButtonColor,
                    [field]: value
                }
            }
        }));
    };

    // Handle boolean toggle inputs
    const handleToggleChange = (field) => {
        setFormData(prevState => ({
            ...prevState,
            constantData: {
                ...prevState.constantData,
                [field]: !prevState.constantData[field]
            }
        }));
    };

    // Apply a color palette
    const applyPalette = (palette) => {
        setFormData(prevState => ({
            ...prevState,
            header: {
                ...prevState.header,
                startColor: palette.header.startColor,
                endColor: palette.header.endColor
            },
            button: {
                ...prevState.button,
                startColor: palette.button.startColor,
                endColor: palette.button.endColor
            },
            buttonBackground: {
                ...prevState.buttonBackground,
                startColor: palette.button.startColor,
                endColor: palette.button.endColor
            },
            list_title_size: {
                ...prevState.list_title_size,
                color: palette.text
            },
            listbackground: {
                ...prevState.listbackground,
                backgroundColor: palette.background
            },
            markerColor: palette.accent,
            constantData: {
                ...prevState.constantData,
                priceColor: palette.text,
                callButtonColor: palette.accent,
                DetailPageButtonColor: {
                    startColor: palette.button.startColor,
                    endColor: palette.button.endColor
                }
            }
        }));

        setShowPalette(false);
        toast.success(`Applied "${palette.name}" color palette`);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Process homeUrls if it's a string
            const processedFormData = { ...formData };

            // ADD THIS CODE: Remove ads from the payload
            if (processedFormData.ads) {
                delete processedFormData.ads;
            }
            if (typeof processedFormData.constantData.homeUrls === 'string') {
                processedFormData.constantData.homeUrls = processedFormData.constantData.homeUrls
                    .split(',')
                    .map(url => url.trim())
                    .filter(Boolean);
            }

            // Format homePageLayoutOrder if it's a string
            if (typeof processedFormData.constantData.homePageLayoutOrder === 'string') {
                processedFormData.constantData.homePageLayoutOrder = processedFormData.constantData.homePageLayoutOrder
                    .split(',')
                    .map(num => parseInt(num.trim()))
                    .filter(num => !isNaN(num));
            }

            const response = await axios.post(`${base_url}/api/colors/update`, processedFormData);
            toast.success('Colors updated successfully!');
            console.log('Server response:', response.data);

            // Call the success callback if provided
            if (onSubmitSuccess && typeof onSubmitSuccess === 'function') {
                onSubmitSuccess(response.data);
            }
        } catch (error) {
            console.error('Error updating colors:', error);
            toast.error(`Failed to update colors: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Component for color input with color picker and text field
    const ColorInput = ({ section, field, label, value, onChange }) => (
        <div className="mb-4 flex items-center">
            <label className="min-w-40 block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(section, field, e.target.value)}
                        className="w-12 h-8 p-0 border border-gray-300 rounded cursor-pointer"
                    />
                    <div className="absolute inset-0 rounded pointer-events-none border border-gray-300 shadow-sm" style={{ backgroundColor: value }}></div>
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(section, field, e.target.value)}
                    className="w-28 p-2 border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        </div>
    );

    // Accordion Section component
    const AccordionSection = ({ id, title, children }) => (
        <div className="mb-4 border rounded-lg overflow-scroll bg-white shadow-sm">
            <button
                className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => setActiveSection(activeSection === id ? null : id)}
            >
                <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transform transition-transform ${activeSection === id ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div
                className={`px-4 py-3 transition-all duration-300 ${activeSection === id ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
                {children}
            </div>
        </div>
    );

    return (
        <div className="mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Color Settings</h1>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowPalette(!showPalette)}
                        className="px-3 py-1.5 text-sm rounded-md bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        🎨 Color Palettes
                    </button>
                </div>
            </div>

            {/* Color Palette Dialog */}
            {showPalette && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Color Palettes</h3>
                                <button
                                    onClick={() => setShowPalette(false)}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <p className="text-gray-600 mb-4">Select a pre-designed color palette to quickly update your app's appearance.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {colorPalettes.map((palette, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => applyPalette(palette)}
                                    >
                                        <div
                                            className="h-24 p-4 flex flex-col justify-between"
                                            style={{ background: `linear-gradient(to right, ${palette.header.startColor}, ${palette.header.endColor})` }}
                                        >
                                            <div className="text-white font-medium">{palette.name}</div>
                                            <div className="flex space-x-2">
                                                <button
                                                    className="px-2 py-1 rounded text-xs text-white"
                                                    style={{ background: `linear-gradient(to right, ${palette.button.startColor}, ${palette.button.endColor})` }}
                                                >
                                                    Button
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-3 flex justify-between items-center" style={{ backgroundColor: palette.background }}>
                                            <div className="text-sm" style={{ color: palette.text }}>Sample Text</div>
                                            <div
                                                className="w-6 h-6 rounded-full"
                                                style={{ backgroundColor: palette.accent }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 flex justify-end">
                            <button
                                onClick={() => setShowPalette(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Quick Controls */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6">
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Primary Color</label>
                            <input
                                type="color"
                                value={formData.button.startColor}
                                onChange={(e) => {
                                    const color = e.target.value;
                                    handleColorChange('button', 'startColor', color);
                                    handleColorChange('buttonBackground', 'startColor', color);
                                    handleDetailButtonColorChange('startColor', color);
                                }}
                                className="h-10 w-16 p-1 border border-gray-300 rounded cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Secondary Color</label>
                            <input
                                type="color"
                                value={formData.button.endColor}
                                onChange={(e) => {
                                    const color = e.target.value;
                                    handleColorChange('button', 'endColor', color);
                                    handleColorChange('buttonBackground', 'endColor', color);
                                    handleDetailButtonColorChange('endColor', color);
                                }}
                                className="h-10 w-16 p-1 border border-gray-300 rounded cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Accent Color</label>
                            <input
                                type="color"
                                value={formData.markerColor}
                                onChange={(e) => {
                                    const color = e.target.value;
                                    handleColorChange(null, 'markerColor', color);
                                    handleConstantDataChange('callButtonColor', color);
                                }}
                                className="h-10 w-16 p-1 border border-gray-300 rounded cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Background</label>
                            <input
                                type="color"
                                value={formData.listbackground.backgroundColor}
                                onChange={(e) => handleColorChange('listbackground', 'backgroundColor', e.target.value)}
                                className="h-10 w-16 p-1 border border-gray-300 rounded cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Accordion Sections */}
                <AccordionSection id="header" title="Header">
                    <ColorInput
                        section="header"
                        field="startColor"
                        label="Start Color"
                        value={formData.header.startColor}
                        onChange={handleColorChange}
                    />
                    <ColorInput
                        section="header"
                        field="endColor"
                        label="End Color"
                        value={formData.header.endColor}
                        onChange={handleColorChange}
                    />
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Header Background Image:</label>
                        <input
                            type="text"
                            value={formData.constantData.headerBackgroundImage || ''}
                            onChange={(e) => handleConstantDataChange('headerBackgroundImage', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter image URL"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Header Height:</label>
                        <input
                            type="number"
                            value={formData.constantData.headerHeight || 0}
                            onChange={(e) => handleConstantDataChange('headerHeight', parseInt(e.target.value) || 0)}
                            className="w-20 p-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>
                </AccordionSection>

                {/* more info */}
                <AccordionSection id="more" title="More">
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ios App Store Link:</label>
                        <input
                            type="text"
                            value={formData.constantData.iosAppStoreLink || ''}
                            onChange={(e) => handleConstantDataChange('iosAppStoreLink', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter IOS App Store Link"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prod BaseUrl:</label>
                        <input
                            type="text"
                            value={formData.constantData.prodBaseUrl || ''}
                            onChange={(e) => handleConstantDataChange('prodBaseUrl', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter prod Base Url"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">IOS App Version:</label>
                        <input
                            type="text"
                            value={formData.constantData.iosAppVersion || ''}
                            onChange={(e) => handleConstantDataChange('iosAppVersion', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter Ios App Version"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter UnselectedColor:</label>
                        <input
                            type="text"
                            value={formData.constantData.filterUnselectedColor || ''}
                            onChange={(e) => handleConstantDataChange('filterUnselectedColor', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter Filter UnselectedColor"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter SelectedColor:</label>
                        <input
                            type="text"
                            value={formData.constantData.filterSelectedColor || ''}
                            onChange={(e) => handleConstantDataChange('filterSelectedColor', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter Filter SelectedColor"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fab Color:</label>
                        <input
                            type="text"
                            value={formData.constantData.fabColor || ''}
                            onChange={(e) => handleConstantDataChange('fabColor', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter fabColor"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Loader Icon:</label>
                        <input
                            type="text"
                            value={formData.constantData.loaderIcon || ''}
                            onChange={(e) => handleConstantDataChange('loaderIcon', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter loaderIcon"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Header Text:</label>
                        <input
                            type="text"
                            value={formData.constantData.headerText || ''}
                            onChange={(e) => handleConstantDataChange('headerText', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter Header Text"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image Above BottomSheet Link:</label>
                        <input
                            type="text"
                            value={formData.constantData.imageAboveBottomSheet || ''}
                            onChange={(e) => handleConstantDataChange('imageAboveBottomSheet', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter imageAboveBottomSheet Text"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">User Profile Header:</label>
                        <input
                            type="text"
                            value={formData.constantData.userprofileHeader || ''}
                            onChange={(e) => handleConstantDataChange('userprofileHeader', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter user profile Header"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bottom Image:</label>
                        <input
                            type="text"
                            value={formData.constantData.bottomImage || ''}
                            onChange={(e) => handleConstantDataChange('bottomImage', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter bottom Image"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Progress Gif:</label>
                        <input
                            type="text"
                            value={formData.constantData.progressGif || ''}
                            onChange={(e) => handleConstantDataChange('progressGif', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter Progress GIF URL"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">App Website:</label>
                        <input
                            type="text"
                            value={formData.constantData.appWebsite || ''}
                            onChange={(e) => handleConstantDataChange('appWebsite', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter App Webiste URL"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">List End Image:</label>
                        <input
                            type="text"
                            value={formData.constantData.listEndImage || ''}
                            onChange={(e) => handleConstantDataChange('listEndImage', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter List End Image URL"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">List Ads:</label>
                        <input
                            type="text"
                            value={formData.constantData.listAds || ''}
                            onChange={(e) => handleConstantDataChange('listAds', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter List Ads URL"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search Ads:</label>
                        <input
                            type="text"
                            value={formData.constantData.searchAds || ''}
                            onChange={(e) => handleConstantDataChange('searchAds', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter Search Ads URL"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max List Ads:</label>
                        <input
                            type="text"
                            value={formData.constantData.maxListAds || ''}
                            onChange={(e) => handleConstantDataChange('maxListAds', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter Max List Ads URL"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Base URL:</label>
                        <input
                            type="text"
                            value={formData.constantData.baseURL || ''}
                            onChange={(e) => handleConstantDataChange('baseURL', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter Base URL"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Condition URL:</label>
                        <input
                            type="text"
                            value={formData.constantData.termsAndCondition || ''}
                            onChange={(e) => handleConstantDataChange('termsAndCondition', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter terms And Condition URL"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Support Page Link:</label>
                        <input
                            type="text"
                            value={formData.constantData.supportPageLink || ''}
                            onChange={(e) => handleConstantDataChange('supportPageLink', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter Support Page Link"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property OnBoarding Link:</label>
                        <input
                            type="text"
                            value={formData.constantData.propertyOnboardingLink || ''}
                            onChange={(e) => handleConstantDataChange('propertyOnboardingLink', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter Support Page Link"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">App Rating Playstore Link:</label>
                        <input
                            type="text"
                            value={formData.constantData.appRatingPlaystoreLink || ''}
                            onChange={(e) => handleConstantDataChange('appRatingPlaystoreLink', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter Support Page Link"
                        />
                    </div>
                    
                </AccordionSection>

                {/* page Link */}
                <AccordionSection id="pageLink" title="Page Link">
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID:</label>
                        <input
                            type="text"
                            value={formData.pageLink?.id || ''}
                            onChange={(e) => handlePageLinkChange('id', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter Page ID"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Page Name:</label>
                        <input
                            type="text"
                            value={formData.pageLink?.name || ''}
                            onChange={(e) => handlePageLinkChange('name', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter Page Name"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Page Deeplink:</label>
                        <input
                            type="text"
                            value={formData.pageLink?.deepLink || ''}
                            onChange={(e) => handlePageLinkChange('deepLink', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter Page Deeplink"
                        />
                    </div>
                   

                </AccordionSection>

                <AccordionSection id="buttons" title="Buttons">
                    <h3 className="text-md font-semibold mb-3 text-gray-700">Main Buttons</h3>
                    <ColorInput
                        section="button"
                        field="startColor"
                        label="Start Color"
                        value={formData.button.startColor}
                        onChange={handleColorChange}
                    />
                    <ColorInput
                        section="button"
                        field="endColor"
                        label="End Color"
                        value={formData.button.endColor}
                        onChange={handleColorChange}
                    />

                    <h3 className="text-md font-semibold mt-6 mb-3 text-gray-700">Button Background</h3>
                    <ColorInput
                        section="buttonBackground"
                        field="startColor"
                        label="Start Color"
                        value={formData.buttonBackground.startColor}
                        onChange={handleColorChange}
                    />
                    <ColorInput
                        section="buttonBackground"
                        field="endColor"
                        label="End Color"
                        value={formData.buttonBackground.endColor}
                        onChange={handleColorChange}
                    />

                    <h3 className="text-md font-semibold mt-6 mb-3 text-gray-700">Detail Page Button</h3>
                    <div className="mb-4 flex items-center">
                        <label className="min-w-40 block text-sm font-medium text-gray-700">Start Color</label>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="color"
                                    value={formData.constantData.DetailPageButtonColor.startColor}
                                    onChange={(e) => handleDetailButtonColorChange('startColor', e.target.value)}
                                    className="w-12 h-8 p-0 border border-gray-300 rounded"
                                />
                                <div className="absolute inset-0 rounded pointer-events-none" style={{ backgroundColor: formData.constantData.DetailPageButtonColor.startColor }}></div>
                            </div>
                            <input
                                type="text"
                                value={formData.constantData.DetailPageButtonColor.startColor}
                                onChange={(e) => handleDetailButtonColorChange('startColor', e.target.value)}
                                className="w-28 p-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>
                    </div>
                    <div className="mb-4 flex items-center">
                        <label className="min-w-40 block text-sm font-medium text-gray-700">End Color</label>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="color"
                                    value={formData.constantData.DetailPageButtonColor.endColor}
                                    onChange={(e) => handleDetailButtonColorChange('endColor', e.target.value)}
                                    className="w-12 h-8 p-0 border border-gray-300 rounded"
                                />
                                <div className="absolute inset-0 rounded pointer-events-none" style={{ backgroundColor: formData.constantData.DetailPageButtonColor.endColor }}></div>
                            </div>
                            <input
                                type="text"
                                value={formData.constantData.DetailPageButtonColor.endColor}
                                onChange={(e) => handleDetailButtonColorChange('endColor', e.target.value)}
                                className="w-28 p-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>
                    </div>

                    <h3 className="text-md font-semibold mt-6 mb-3 text-gray-700">Call Button</h3>
                    <ColorInput
                        section="constantData"
                        field="callButtonColor"
                        label="Call Button Color"
                        value={formData.constantData.callButtonColor}
                        onChange={handleConstantDataChange}
                    />
                </AccordionSection>

                <AccordionSection id="list" title="List Items">
                    <h3 className="text-md font-semibold mb-3 text-gray-700">Title Style</h3>
                    <ColorInput
                        section="list_title_size"
                        field="color"
                        label="Text Color"
                        value={formData.list_title_size.color}
                        onChange={handleColorChange}
                    />
                    <ColorInput
                        section="list_title_size"
                        field="backgroundColor"
                        label="Background Color"
                        value={formData.list_title_size.backgroundColor}
                        onChange={handleColorChange}
                    />

                    <h3 className="text-md font-semibold mt-6 mb-3 text-gray-700">List Background</h3>
                    <ColorInput
                        section="listbackground"
                        field="backgroundColor"
                        label="Background Color"
                        value={formData.listbackground.backgroundColor}
                        onChange={handleColorChange}
                    />

                    <h3 className="text-md font-semibold mt-6 mb-3 text-gray-700">Price Style</h3>
                    <div className="mb-4 flex items-center">
                        <label className="min-w-40 block text-sm font-medium text-gray-700">Price Size:</label>
                        <input
                            type="number"
                            value={formData.list_price_size}
                            onChange={(e) => handleColorChange(null, 'list_price_size', parseInt(e.target.value) || 0)}
                            className="w-20 p-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>
                    <ColorInput
                        section="constantData"
                        field="priceColor"
                        label="Price Color"
                        value={formData.constantData.priceColor}
                        onChange={handleConstantDataChange}
                    />

                    <h3 className="text-md font-semibold mt-6 mb-3 text-gray-700">Markers</h3>
                    <ColorInput
                        section={null}
                        field="markerColor"
                        label="Marker Color"
                        value={formData.markerColor}
                        onChange={handleColorChange}
                    />

                    <div className="flex items-center mt-4">
                        <label className="inline-flex relative items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.constantData.shadowOnImage}
                                onChange={() => handleToggleChange('shadowOnImage')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-700">Shadow On Images</span>
                        </label>
                    </div>
                    
                </AccordionSection>

                <AccordionSection id="search" title="Search Filter">
                    <ColorInput
                        section="search_filter"
                        field="backgroundColor"
                        label="Background Color"
                        value={formData.search_filter.backgroundColor}
                        onChange={handleColorChange}
                    />
                </AccordionSection>

                <AccordionSection id="app" title="App Settings">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">App Update Hide/Show:</label>
                            <input
                                type="text"
                                value={formData.constantData.appUpdateHideShow || ''}
                                onChange={(e) => handleConstantDataChange('appUpdateHideShow', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">App Update Version Code:</label>
                            <input
                                type="number"
                                value={formData.constantData.appUpdateVersionCode || 0}
                                onChange={(e) => handleConstantDataChange('appUpdateVersionCode', parseInt(e.target.value) || 0)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">App Update Link:</label>
                            <input
                                type="url"
                                value={formData.constantData.appUpdateLink || ''}
                                onChange={(e) => handleConstantDataChange('appUpdateLink', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">App Update Cancel Option:</label>
                            <input
                                type="text"
                                value={formData.constantData.appUpdateCancelOption || ''}
                                onChange={(e) => handleConstantDataChange('appUpdateCancelOption', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">App Update Description:</label>
                        <textarea
                            value={formData.constantData.appUpdateDesc || ''}
                            onChange={(e) => handleConstantDataChange('appUpdateDesc', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Home URLs (comma-separated):</label>
                        <textarea
                            value={Array.isArray(formData.constantData.homeUrls) ? formData.constantData.homeUrls.join(', ') : formData.constantData.homeUrls || ''}
                            onChange={(e) => handleConstantDataChange('homeUrls', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Home Page Layout Order (comma-separated):</label>
                        <input
                            type="text"
                            value={Array.isArray(formData.constantData.homePageLayoutOrder) ? formData.constantData.homePageLayoutOrder.join(', ') : formData.constantData.homePageLayoutOrder || ''}
                            onChange={(e) => handleConstantDataChange('homePageLayoutOrder', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>

                    {/* Toggle Switches */}
                    <div className="my-6 space-y-4">
                        <h3 className="text-md font-semibold text-gray-700">Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                            <div className="flex items-center">
                                <label className="inline-flex relative items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.constantData.iosUpdateType}
                                        onChange={() => handleToggleChange('iosUpdateType')}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">IOS Update Type</span>
                                </label>
                            </div>
                            <div className="flex items-center">
                                <label className="inline-flex relative items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.constantData.androidUpdateType}
                                        onChange={() => handleToggleChange('androidUpdateType')}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">Android Update Type</span>
                                </label>
                            </div>
                            <div className="flex items-center">
                                <label className="inline-flex relative items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.constantData.autoPlayAds}
                                        onChange={() => handleToggleChange('autoPlayAds')}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">Autoplay Ads</span>
                                </label>
                            </div>

                            <div className="flex items-center">
                                <label className="inline-flex relative items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.constantData.isPropertyUpload}
                                        onChange={() => handleToggleChange('isPropertyUpload')}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">Is Property Upload</span>
                                </label>
                            </div>

                            <div className="flex items-center">
                                <label className="inline-flex relative items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.constantData.isStrokeFilter}
                                        onChange={() => handleToggleChange('isStrokeFilter')}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">Is Stroke Filter</span>
                                </label>
                            </div>

                            <div className="flex items-center">
                                <label className="inline-flex relative items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.constantData.isMaterialElevation}
                                        onChange={() => handleToggleChange('isMaterialElevation')}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">Is Material Elevation</span>
                                </label>
                            </div>

                            <div className="flex items-center">
                                <label className="inline-flex relative items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.constantData.isCallDirect}
                                        onChange={() => handleToggleChange('isCallDirect')}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">Is Call Direct</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </AccordionSection>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        className={`px-6 py-2 rounded-md text-white font-medium text-sm shadow-sm ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Update Colors
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </div>

    )
}

export default ColorGradientForm;