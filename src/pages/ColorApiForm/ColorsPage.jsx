import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ColorSection from '../../components/ColorApi/ColorSection';
import ConstantDataSection from '../../components/ColorApi/ColorSection';
import AdsSection from '../../components/Ads/AdsSection';
import axios from 'axios';
import { base_url } from '../../../utils/base_url';

const ColorsPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        header: {
            startColor: '#ffffff',
            endColor: '#ffffff'
        },
        button: {
            startColor: '#ee0979',
            endColor: '#ff6a00'
        },
        buttonBackground: {
            startColor: '#ee0979',
            endColor: '#ff6a00'
        },
        list_title_size: {
            color: '#333333',
            backgroundColor: '#f2f2f2'
        },
        listbackground: {
            backgroundColor: '#ededed'
        },
        search_filter: {
            backgroundColor: '#000000'
        },
        list_price_size: 14,
        markerColor: '#e1faeb',
        constantData: {
            autoPlayAds: false,
            headerBackgroundImage: '',
            progressGif: '',
            listEndImage: '',
            listAds: '',
            searchAds: '',
            maxListAds: '',
            isPropertyUpload: false,
            homeUrls: [],
            isStrokeFilter: false,
            isMaterialElevation: false,
            headerHeight: 400,
            appPackageName: '',
            defaultLanguage: '',
            currencyCode: '',
            appName: '',
            appEmail: '',
            appLogo: '',
            appCompany: '',
            appWebsite: '',
            appContact: '',
            facebookLink: '',
            twitterLink: '',
            instagramLink: '',
            youtubeLink: '',
            googlePlayLink: '',
            appleStoreLink: '',
            appVersion: '',
            appUpdateHideShow: '',
            appUpdateVersionCode: 0,
            appUpdateDesc: '',
            appUpdateLink: '',
            appUpdateCancelOption: '',
            priceColor: '#000000',
            callButtonColor: '#e1faeb',
            DetailPageButtonColor: {
                startColor: '#e1faeb',
                endColor: '#e1faeb'
            },
            isCallDirect: false,
            homePageLayoutOrder: [1, 3, 4, 5, 6],
            shadowOnImage: false
        },
        ads: []
    });

    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        fetchColorsData();
    }, []);

    const fetchColorsData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${base_url}/api/colors`);
            if (response.data) {
                setFormData(response.data);
            }
        } catch (error) {
            console.error('Error fetching colors data:', error);
            showNotification('Failed to load colors data', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleColorChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleNestedColorChange = (section, subsection, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subsection]: {
                    ...prev[section]?.[subsection],
                    [field]: value
                }
            }
        }));
    };

    const handleInputChange = (name, value) => {
        if (name.includes('.')) {
            const [section, field] = name.split('.');
            handleColorChange(section, field, value);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleConstantDataChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            constantData: {
                ...prev.constantData,
                [field]: value
            }
        }));
    };

    const handleDetailPageButtonColorChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            constantData: {
                ...prev.constantData,
                DetailPageButtonColor: {
                    ...prev.constantData.DetailPageButtonColor,
                    [field]: value
                }
            }
        }));
    };

    const handleAddAd = (ad) => {
        setFormData(prev => ({
            ...prev,
            ads: [...prev.ads, ad]
        }));
    };

    const handleUpdateAd = (index, updatedAd) => {
        setFormData(prev => {
            const newAds = [...prev.ads];
            newAds[index] = updatedAd;
            return {
                ...prev,
                ads: newAds
            };
        });
    };

    const handleRemoveAd = (index) => {
        setFormData(prev => ({
            ...prev,
            ads: prev.ads.filter((_, i) => i !== index)
        }));
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${base_url}/api/colors/update`, formData);

            if (response.status === 200) {
                showNotification('Colors updated successfully', 'success');
            } else {
                throw new Error('Failed to update colors');
            }
        } catch (error) {
            console.error('Error updating colors:', error);
            showNotification('Failed to update colors', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className=" mx-auto ">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Update Colors API Form</h1>

            {notification.show && (
                <div className={`p-4 mb-6 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {notification.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <ColorSection
                            title="Header"
                            section="header"
                            startColor={formData.header.startColor}
                            endColor={formData.header.endColor}
                            onStartColorChange={(value) => handleColorChange('header', 'startColor', value)}
                            onEndColorChange={(value) => handleColorChange('header', 'endColor', value)}
                        />

                        <ColorSection
                            title="Button"
                            section="button"
                            startColor={formData.button.startColor}
                            endColor={formData.button.endColor}
                            onStartColorChange={(value) => handleColorChange('button', 'startColor', value)}
                            onEndColorChange={(value) => handleColorChange('button', 'endColor', value)}
                        />

                        <ColorSection
                            title="Button Background"
                            section="buttonBackground"
                            startColor={formData.buttonBackground.startColor}
                            endColor={formData.buttonBackground.endColor}
                            onStartColorChange={(value) => handleColorChange('buttonBackground', 'startColor', value)}
                            onEndColorChange={(value) => handleColorChange('buttonBackground', 'endColor', value)}
                        />
                    </div>

                    <div className="space-y-6">
                        <ColorSection
                            title="List Title"
                            section="list_title_size"
                            startColor={formData.list_title_size.color}
                            endColor={formData.list_title_size.backgroundColor}
                            startLabel="Color"
                            endLabel="Background Color"
                            onStartColorChange={(value) => handleColorChange('list_title_size', 'color', value)}
                            onEndColorChange={(value) => handleColorChange('list_title_size', 'backgroundColor', value)}
                        />

                        <div className="p-6 bg-white shadow-md rounded-md">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">List Background</h2>
                            <div className="flex items-center space-x-4">
                                <label className="block text-gray-700 min-w-[150px]">Background Color</label>
                                <div className="flex items-center space-x-2 flex-1">
                                    <input
                                        type="color"
                                        value={formData.listbackground.backgroundColor}
                                        onChange={(e) => handleColorChange('listbackground', 'backgroundColor', e.target.value)}
                                        className="h-10 w-16 p-1 border border-gray-300 rounded"
                                    />
                                    <input
                                        type="text"
                                        value={formData.listbackground.backgroundColor}
                                        onChange={(e) => handleColorChange('listbackground', 'backgroundColor', e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white shadow-md rounded-md">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Search Filter</h2>
                            <div className="flex items-center space-x-4">
                                <label className="block text-gray-700 min-w-[150px]">Background Color</label>
                                <div className="flex items-center space-x-2 flex-1">
                                    <input
                                        type="color"
                                        value={formData.search_filter.backgroundColor}
                                        onChange={(e) => handleColorChange('search_filter', 'backgroundColor', e.target.value)}
                                        className="h-10 w-16 p-1 border border-gray-300 rounded"
                                    />
                                    <input
                                        type="text"
                                        value={formData.search_filter.backgroundColor}
                                        onChange={(e) => handleColorChange('search_filter', 'backgroundColor', e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white shadow-md rounded-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Other Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 mb-2">List Price Size</label>
                            <input
                                type="number"
                                value={formData.list_price_size}
                                onChange={(e) => handleInputChange('list_price_size', parseInt(e.target.value) || 0)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Marker Color</label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={formData.markerColor}
                                    onChange={(e) => handleInputChange('markerColor', e.target.value)}
                                    className="h-10 w-16 p-1 border border-gray-300 rounded"
                                />
                                <input
                                    type="text"
                                    value={formData.markerColor}
                                    onChange={(e) => handleInputChange('markerColor', e.target.value)}
                                    className="flex-1 p-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <ConstantDataSection
                    constantData={formData.constantData}
                    onChange={handleConstantDataChange}
                    onDetailPageButtonColorChange={handleDetailPageButtonColorChange}
                />

                <AdsSection
                    ads={formData.ads}
                    onAddAd={handleAddAd}
                    onUpdateAd={handleUpdateAd}
                    onRemoveAd={handleRemoveAd}
                />

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            <div className="mt-8 flex justify-between">
                <button
                    onClick={() => navigate('/ads')}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                    Manage Ads Separately
                </button>

                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default ColorsPage;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ColorSection from '../../components/ColorApi/ColorSection';
// import ConstantDataSection from '../../components/ColorApi/ColorSection';
// import AdsSection from '../../components/Ads/AdsSection';
// import axios from 'axios';
// import { base_url } from '../../../utils/base_url';

// const ColorsPage = () => {
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('colors');
//     const [formData, setFormData] = useState({
//         header: {
//             startColor: '#ffffff',
//             endColor: '#ffffff'
//         },
//         button: {
//             startColor: '#ee0979',
//             endColor: '#ff6a00'
//         },
//         buttonBackground: {
//             startColor: '#ee0979',
//             endColor: '#ff6a00'
//         },
//         list_title_size: {
//             color: '#333333',
//             backgroundColor: '#f2f2f2'
//         },
//         listbackground: {
//             backgroundColor: '#ededed'
//         },
//         search_filter: {
//             backgroundColor: '#000000'
//         },
//         list_price_size: 14,
//         markerColor: '#e1faeb',
//         constantData: {
//             autoPlayAds: false,
//             headerBackgroundImage: '',
//             progressGif: '',
//             listEndImage: '',
//             listAds: '',
//             searchAds: '',
//             maxListAds: '',
//             isPropertyUpload: false,
//             homeUrls: [],
//             isStrokeFilter: false,
//             isMaterialElevation: false,
//             headerHeight: 400,
//             appPackageName: '',
//             defaultLanguage: '',
//             currencyCode: '',
//             appName: '',
//             appEmail: '',
//             appLogo: '',
//             appCompany: '',
//             appWebsite: '',
//             appContact: '',
//             facebookLink: '',
//             twitterLink: '',
//             instagramLink: '',
//             youtubeLink: '',
//             googlePlayLink: '',
//             appleStoreLink: '',
//             appVersion: '',
//             appUpdateHideShow: '',
//             appUpdateVersionCode: 0,
//             appUpdateDesc: '',
//             appUpdateLink: '',
//             appUpdateCancelOption: '',
//             priceColor: '#000000',
//             callButtonColor: '#e1faeb',
//             DetailPageButtonColor: {
//                 startColor: '#e1faeb',
//                 endColor: '#e1faeb'
//             },
//             isCallDirect: false,
//             homePageLayoutOrder: [1, 3, 4, 5, 6],
//             shadowOnImage: false
//         },
//         ads: []
//     });

//     const [notification, setNotification] = useState({ show: false, message: '', type: '' });

//     useEffect(() => {
//         fetchColorsData();
//     }, []);

//     const fetchColorsData = async () => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${base_url}/api/colors`);
//             if (response.data) {
//                 setFormData(response.data);
//             }
//         } catch (error) {
//             console.error('Error fetching colors data:', error);
//             showNotification('Failed to load colors data', 'error');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleColorChange = (section, field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [section]: {
//                 ...prev[section],
//                 [field]: value
//             }
//         }));
//     };

//     const handleNestedColorChange = (section, subsection, field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [section]: {
//                 ...prev[section],
//                 [subsection]: {
//                     ...prev[section]?.[subsection],
//                     [field]: value
//                 }
//             }
//         }));
//     };

//     const handleInputChange = (name, value) => {
//         if (name.includes('.')) {
//             const [section, field] = name.split('.');
//             handleColorChange(section, field, value);
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: value
//             }));
//         }
//     };

//     const handleConstantDataChange = (field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             constantData: {
//                 ...prev.constantData,
//                 [field]: value
//             }
//         }));
//     };

//     const handleDetailPageButtonColorChange = (field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             constantData: {
//                 ...prev.constantData,
//                 DetailPageButtonColor: {
//                     ...prev.constantData.DetailPageButtonColor,
//                     [field]: value
//                 }
//             }
//         }));
//     };

//     const handleAddAd = (ad) => {
//         setFormData(prev => ({
//             ...prev,
//             ads: [...prev.ads, ad]
//         }));
//     };

//     const handleUpdateAd = (index, updatedAd) => {
//         setFormData(prev => {
//             const newAds = [...prev.ads];
//             newAds[index] = updatedAd;
//             return {
//                 ...prev,
//                 ads: newAds
//             };
//         });
//     };

//     const handleRemoveAd = (index) => {
//         setFormData(prev => ({
//             ...prev,
//             ads: prev.ads.filter((_, i) => i !== index)
//         }));
//     };

//     const showNotification = (message, type = 'success') => {
//         setNotification({ show: true, message, type });
//         setTimeout(() => {
//             setNotification({ show: false, message: '', type: '' });
//         }, 3000);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);

//         try {
//             const response = await axios.post(`${base_url}/api/colors/update`, formData);

//             if (response.status === 200) {
//                 showNotification('Colors updated successfully', 'success');
//             } else {
//                 throw new Error('Failed to update colors');
//             }
//         } catch (error) {
//             console.error('Error updating colors:', error);
//             showNotification('Failed to update colors', 'error');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Preview component for showing color effects
//     const ColorPreview = ({ title, startColor, endColor, type = 'gradient', textColor = null }) => {
//         let style = {};

//         if (type === 'gradient') {
//             style = {
//                 background: `linear-gradient(to right, ${startColor}, ${endColor})`,
//                 color: textColor || (isLightColor(startColor) ? '#000' : '#fff')
//             };
//         } else if (type === 'solid') {
//             style = {
//                 backgroundColor: startColor,
//                 color: textColor || (isLightColor(startColor) ? '#000' : '#fff')
//             };
//         } else if (type === 'text-bg') {
//             style = {
//                 backgroundColor: endColor,
//                 color: startColor
//             };
//         }

//         return (
//             <div className="mt-4 rounded-md overflow-hidden">
//                 <div className="text-sm font-medium text-gray-500 mb-1">Preview</div>
//                 <div
//                     className="h-20 flex items-center justify-center rounded-md shadow-sm transition-all duration-300"
//                     style={style}
//                 >
//                     <span className="font-medium">{title} Preview</span>
//                 </div>
//             </div>
//         );
//     };

//     // Helper function to determine if a color is light or dark
//     const isLightColor = (color) => {
//         const hex = color.replace('#', '');
//         const r = parseInt(hex.substr(0, 2), 16);
//         const g = parseInt(hex.substr(2, 2), 16);
//         const b = parseInt(hex.substr(4, 2), 16);
//         const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
//         return brightness > 155;
//     };

//     // Enhanced ColorPickerField component
//     const ColorPickerField = ({ label, color, onChange }) => (
//         <div className="flex flex-col space-y-1">
//             <label className="text-sm font-medium text-gray-600">{label}</label>
//             <div className="flex items-center space-x-2">
//                 <div className="relative">
//                     <input
//                         type="color"
//                         value={color}
//                         onChange={(e) => onChange(e.target.value)}
//                         className="h-10 w-10 cursor-pointer rounded-full border-2 border-gray-300 p-1 transition-all hover:border-blue-500 overflow-hidden"
//                     />
//                 </div>
//                 <input
//                     type="text"
//                     value={color}
//                     onChange={(e) => onChange(e.target.value)}
//                     className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//             </div>
//         </div>
//     );

//     // Enhanced ColorSection component
//     const EnhancedColorSection = ({
//         title,
//         section,
//         startColor,
//         endColor,
//         startLabel = "Start Color",
//         endLabel = "End Color",
//         onStartColorChange,
//         onEndColorChange,
//         previewType = 'gradient'
//     }) => (
//         <div className="p-6 bg-white shadow rounded-lg transition-all duration-300 hover:shadow-md">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">{title}</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <ColorPickerField
//                     label={startLabel}
//                     color={startColor}
//                     onChange={onStartColorChange}
//                 />
//                 <ColorPickerField
//                     label={endLabel}
//                     color={endColor}
//                     onChange={onEndColorChange}
//                 />
//             </div>
//             <ColorPreview
//                 title={title}
//                 startColor={startColor}
//                 endColor={endColor}
//                 type={previewType}
//             />
//         </div>
//     );

//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen bg-gray-50">
//                 <div className="flex flex-col items-center">
//                     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
//                     <p className="mt-4 text-gray-600">Loading your color settings...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header with navigation */}
//                 <div className="flex justify-between items-center mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-800">App Theme Designer</h1>
//                         <p className="text-gray-600 mt-1">Customize your app's appearance with our intuitive designer</p>
//                     </div>
//                     <div className="flex space-x-4">
//                         <button
//                             onClick={() => navigate('/dashboard')}
//                             className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition flex items-center"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                                 <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//                             </svg>
//                             Dashboard
//                         </button>
//                         <button
//                             onClick={() => navigate('/ads')}
//                             className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition flex items-center"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
//                             </svg>
//                             Ads Manager
//                         </button>
//                     </div>
//                 </div>

//                 {/* Notification component */}
//                 {notification.show && (
//                     <div
//                         className={`p-4 mb-6 rounded-lg flex items-center justify-between
//                         ${notification.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
//                                 'bg-red-100 text-red-800 border-l-4 border-red-500'}`}
//                     >
//                         <div className="flex items-center">
//                             {notification.type === 'success' ? (
//                                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
//                                 </svg>
//                             ) : (
//                                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
//                                 </svg>
//                             )}
//                             <span>{notification.message}</span>
//                         </div>
//                         <button
//                             onClick={() => setNotification({ ...notification, show: false })}
//                             className="text-gray-500 hover:text-gray-800"
//                         >
//                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
//                             </svg>
//                         </button>
//                     </div>
//                 )}

//                 {/* Tab navigation */}
//                 <div className="bg-white rounded-lg shadow mb-6">
//                     <div className="flex overflow-x-auto scrollbar-hide">
//                         <button
//                             onClick={() => setActiveTab('colors')}
//                             className={`px-6 py-3 font-medium text-sm focus:outline-none flex-1 border-b-2 ${activeTab === 'colors'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                 }`}
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
//                                 <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
//                             </svg>
//                             Color Settings
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('layout')}
//                             className={`px-6 py-3 font-medium text-sm focus:outline-none flex-1 border-b-2 ${activeTab === 'layout'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                 }`}
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
//                                 <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//                             </svg>
//                             App Settings
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('ads')}
//                             className={`px-6 py-3 font-medium text-sm focus:outline-none flex-1 border-b-2 ${activeTab === 'ads'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                 }`}
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
//                                 <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
//                             </svg>
//                             Ad Management
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('preview')}
//                             className={`px-6 py-3 font-medium text-sm focus:outline-none flex-1 border-b-2 ${activeTab === 'preview'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                 }`}
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
//                                 <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                                 <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
//                             </svg>
//                             Live Preview
//                         </button>
//                     </div>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-8">
//                     {activeTab === 'colors' && (
//                         <div className="space-y-6">
//                             <h2 className="text-xl font-semibold text-gray-800 mb-4">Theme Colors</h2>

//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
//                                 <EnhancedColorSection
//                                     title="Header"
//                                     section="header"
//                                     startColor={formData.header.startColor}
//                                     endColor={formData.header.endColor}
//                                     onStartColorChange={(value) => handleColorChange('header', 'startColor', value)}
//                                     onEndColorChange={(value) => handleColorChange('header', 'endColor', value)}
//                                 />

//                                 <EnhancedColorSection
//                                     title="Button"
//                                     section="button"
//                                     startColor={formData.button.startColor}
//                                     endColor={formData.button.endColor}
//                                     onStartColorChange={(value) => handleColorChange('button', 'startColor', value)}
//                                     onEndColorChange={(value) => handleColorChange('button', 'endColor', value)}
//                                 />

//                                 <EnhancedColorSection
//                                     title="Button Background"
//                                     section="buttonBackground"
//                                     startColor={formData.buttonBackground.startColor}
//                                     endColor={formData.buttonBackground.endColor}
//                                     onStartColorChange={(value) => handleColorChange('buttonBackground', 'startColor', value)}
//                                     onEndColorChange={(value) => handleColorChange('buttonBackground', 'endColor', value)}
//                                 />

//                                 <EnhancedColorSection
//                                     title="List Title"
//                                     section="list_title_size"
//                                     startColor={formData.list_title_size.color}
//                                     endColor={formData.list_title_size.backgroundColor}
//                                     startLabel="Text Color"
//                                     endLabel="Background Color"
//                                     onStartColorChange={(value) => handleColorChange('list_title_size', 'color', value)}
//                                     onEndColorChange={(value) => handleColorChange('list_title_size', 'backgroundColor', value)}
//                                     previewType="text-bg"
//                                 />

//                                 <div className="p-6 bg-white shadow rounded-lg transition-all duration-300 hover:shadow-md">
//                                     <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">List Background</h2>
//                                     <ColorPickerField
//                                         label="Background Color"
//                                         color={formData.listbackground.backgroundColor}
//                                         onChange={(value) => handleColorChange('listbackground', 'backgroundColor', value)}
//                                     />
//                                     <ColorPreview
//                                         title="List Background"
//                                         startColor={formData.listbackground.backgroundColor}
//                                         endColor={formData.listbackground.backgroundColor}
//                                         type="solid"
//                                     />
//                                 </div>

//                                 <div className="p-6 bg-white shadow rounded-lg transition-all duration-300 hover:shadow-md">
//                                     <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Search Filter</h2>
//                                     <ColorPickerField
//                                         label="Background Color"
//                                         color={formData.search_filter.backgroundColor}
//                                         onChange={(value) => handleColorChange('search_filter', 'backgroundColor', value)}
//                                     />
//                                     <ColorPreview
//                                         title="Search Filter"
//                                         startColor={formData.search_filter.backgroundColor}
//                                         endColor={formData.search_filter.backgroundColor}
//                                         type="solid"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="p-6 bg-white shadow rounded-lg">
//                                 <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Other Settings</h2>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-600 mb-2">List Price Size</label>
//                                         <div className="flex items-center">
//                                             <input
//                                                 type="range"
//                                                 min="10"
//                                                 max="24"
//                                                 value={formData.list_price_size}
//                                                 onChange={(e) => handleInputChange('list_price_size', parseInt(e.target.value))}
//                                                 className="w-full mr-3"
//                                             />
//                                             <span className="bg-gray-100 px-3 py-1 rounded min-w-[40px] text-center">
//                                                 {formData.list_price_size}px
//                                             </span>
//                                         </div>
//                                         <div className="mt-4 p-4 bg-gray-50 rounded-md">
//                                             <div className="text-sm font-medium text-gray-500 mb-1">Price Preview</div>
//                                             <div
//                                                 className="rounded-md p-2 flex justify-center"
//                                                 style={{ fontSize: `${formData.list_price_size}px` }}
//                                             >
//                                                 <span className="font-medium">$999.99</span>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-600 mb-2">Marker Color</label>
//                                         <ColorPickerField
//                                             label=""
//                                             color={formData.markerColor}
//                                             onChange={(value) => handleInputChange('markerColor', value)}
//                                         />
//                                         <div className="mt-4 p-4 bg-gray-50 rounded-md">
//                                             <div className="text-sm font-medium text-gray-500 mb-1">Marker Preview</div>
//                                             <div className="flex flex-wrap gap-2">
//                                                 <div
//                                                     className="w-6 h-6 rounded-full"
//                                                     style={{ backgroundColor: formData.markerColor }}
//                                                 ></div>
//                                                 <div
//                                                     className="px-3 py-1 rounded-full text-xs"
//                                                     style={{ backgroundColor: formData.markerColor, color: isLightColor(formData.markerColor) ? '#000' : '#fff' }}
//                                                 >
//                                                     Tag
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {activeTab === 'layout' && (
//                         <ConstantDataSection
//                             constantData={formData.constantData}
//                             onChange={handleConstantDataChange}
//                             onDetailPageButtonColorChange={handleDetailPageButtonColorChange}
//                         />
//                     )}

//                     {activeTab === 'ads' && (
//                         <AdsSection
//                             ads={formData.ads}
//                             onAddAd={handleAddAd}
//                             onUpdateAd={handleUpdateAd}
//                             onRemoveAd={handleRemoveAd}
//                         />
//                     )}

//                     {activeTab === 'preview' && (
//                         <div className="bg-white rounded-lg shadow p-6">
//                             <h2 className="text-xl font-semibold mb-4 text-gray-800">App Preview</h2>

//                             <div className="flex flex-col md:flex-row gap-8">
//                                 <div className="flex-1">
//                                     <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg max-w-xs mx-auto">
//                                         {/* Mobile Frame */}
//                                         <div className="border-b border-gray-300 flex justify-center py-2 bg-gray-100">
//                                             <div className="w-20 h-1 bg-gray-300 rounded-full"></div>
//                                         </div>

//                                         {/* App Header */}
//                                         <div
//                                             className="h-32 flex items-center justify-center"
//                                             style={{ background: `linear-gradient(to right, ${formData.header.startColor}, ${formData.header.endColor})` }}
//                                         >
//                                             <h3 className="text-xl font-bold" style={{ color: isLightColor(formData.header.startColor) ? '#000' : '#fff' }}>
//                                                 App Name
//                                             </h3>
//                                         </div>

//                                         {/* Search Bar */}
//                                         <div className="p-3" style={{ backgroundColor: formData.search_filter.backgroundColor }}>
//                                             <div className="bg-white rounded-full px-4 py-2 flex items-center">
//                                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                                 </svg>
//                                                 <span className="text-sm text-gray-400">Search...</span>
//                                             </div>
//                                         </div>

//                                         {/* List Items */}
//                                         <div style={{ backgroundColor: formData.listbackground.backgroundColor }} className="min-h-[300px] p-3">
//                                             <div className="mb-3 bg-white rounded-lg overflow-hidden shadow-sm">
//                                                 <div className="h-24 bg-gray-200"></div>
//                                                 <div className="p-3" style={{ backgroundColor: formData.list_title_size.backgroundColor }}>
//                                                     <h4 className="font-medium" style={{ color: formData.list_title_size.color }}>List Item Title</h4>
//                                                     <div className="flex justify-between items-center mt-2">
//                                                         <div style={{ fontSize: `${formData.list_price_size}px` }} className="font-bold">$199.99</div>
//                                                         <button
//                                                             className="px-3 py-1 rounded-full text-sm font-medium"
//                                                             style={{
//                                                                 background: `linear-gradient(to right, ${formData.button.startColor}, ${formData.button.endColor})`,
//                                                                 color: isLightColor(formData.button.startColor) ? '#000' : '#fff'
//                                                             }}
//                                                         >
//                                                             View
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="mb-3 bg-white rounded-lg overflow-hidden shadow-sm">
//                                                 <div className="h-24 bg-gray-200"></div>
//                                                 <div className="p-3" style={{ backgroundColor: formData.list_title_size.backgroundColor }}>
//                                                     <h4 className="font-medium" style={{ color: formData.list_title_size.color }}>Another Item</h4>
//                                                     <div className="flex justify-between items-center mt-2">
//                                                         <div style={{ fontSize: `${formData.list_price_size}px` }} className="font-bold">$299.99</div>
//                                                         <button
//                                                             className="px-3 py-1 rounded-full text-sm font-medium"
//                                                             style={{
//                                                                 background: `linear-gradient(to right, ${formData.button.startColor}, ${formData.button.endColor})`,
//                                                                 color: isLightColor(formData.button.startColor) ? '#000' : '#fff'
//                                                             }}
//                                                         >
//                                                             View
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="flex-1">
//                                     <h3 className="text-lg font-medium mb-4">Current Theme Components</h3>

//                                     <div className="space-y-6">
//                                         <div className="p-4 bg-gray-50 rounded-lg">
//                                             <h4 className="font-medium text-gray-700 mb-2">Header</h4>
//                                             <div
//                                                 className="h-12 rounded-md"
//                                                 style={{ background: `linear-gradient(to right, ${formData.header.startColor}, ${formData.header.endColor})` }}
//                                             ></div>
//                                             <div className="mt-2 text-sm text-gray-500">
//                                                 Gradient from {formData.header.startColor} to {formData.header.endColor}
//                                             </div>
//                                         </div>

//                                         <div className="p-4 bg-gray-50 rounded-lg">
//                                             <h4 className="font-medium text-gray-700 mb-2">Buttons</h4>
//                                             <div className="flex space-x-2">
//                                                 <button
//                                                     className="px-4 py-2 rounded-md"
//                                                     style={{
//                                                         background: `linear-gradient(to right, ${formData.button.startColor}, ${formData.button.endColor})`,
//                                                         color: isLightColor(formData.button.startColor) ? '#000' : '#fff'
//                                                     }}
//                                                 >
//                                                     Primary
//                                                 </button>
//                                                 <button
//                                                     className="px-4 py-2 rounded-md border"
//                                                     style={{
//                                                         borderColor: formData.button.startColor,
//                                                         color: formData.button.startColor
//                                                     }}
//                                                 >
//                                                     Secondary
//                                                 </button>
//                                             </div>
//                                         </div>

//                                         <div className="p-4 bg-gray-50 rounded-lg">
//                                             <h4 className="font-medium text-gray-700 mb-2">List Items</h4>
//                                             <div className="rounded-md overflow-hidden border border-gray-200">
//                                                 <div
//                                                     className="p-3"
//                                                     style={{ backgroundColor: formData.list_title_size.backgroundColor }}
//                                                 >
//                                                     <span style={{ color: formData.list_title_size.color }}>List Title</span>
//                                                 </div>
//                                                 <div
//                                                     className="p-3"
//                                                     style={{ backgroundColor: formData.listbackground.backgroundColor }}
//                                                 >
//                                                     <span>List Content</span>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="p-4 bg-gray-50 rounded-lg">
//                                             <h4 className="font-medium text-gray-700 mb-2">Markers & Badges</h4>
//                                             <div className="flex space-x-2">
//                                                 <span
//                                                     className="inline-block px-2 py-1 rounded-full text-xs font-medium"
//                                                     style={{
//                                                         backgroundColor: formData.markerColor,
//                                                         color: isLightColor(formData.markerColor) ? '#000' : '#fff'
//                                                     }}
//                                                 >
//                                                     New
//                                                 </span>
//                                                 <span
//                                                     className="inline-block px-2 py-1 rounded-full text-xs font-medium"
//                                                     style={{
//                                                         backgroundColor: formData.markerColor,
//                                                         color: isLightColor(formData.markerColor) ? '#000' : '#fff'
//                                                     }}
//                                                 >
//                                                     Featured
//                                                 </span>
//                                                 <span
//                                                     className="inline-block px-2 py-1 rounded-full text-xs font-medium"
//                                                     style={{
//                                                         backgroundColor: formData.markerColor,
//                                                         color: isLightColor(formData.markerColor) ? '#000' : '#fff'
//                                                     }}
//                                                 >
//                                                     Sale
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     <div className="flex justify-center pt-6">
//                         <button
//                             type="submit"
//                             className="px-8 py-4 rounded-lg shadow-md font-medium text-white transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                             style={{
//                                 background: `linear-gradient(to right, ${formData.button.startColor}, ${formData.button.endColor})`,
//                                 color: isLightColor(formData.button.startColor) ? '#000' : '#fff'
//                             }}
//                             disabled={isLoading}
//                         >
//                             {isLoading ? (
//                                 <div className="flex items-center">
//                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Saving Changes...
//                                 </div>
//                             ) : (
//                                 <div className="flex items-center">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                     </svg>
//                                     Save Changes
//                                 </div>
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ColorsPage;