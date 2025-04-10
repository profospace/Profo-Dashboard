// import React, { useState } from 'react';
// import { Copy, CheckCircle, Link } from 'lucide-react';
// import { base_url } from '../../utils/base_url';

// const DeeplinkGenerator = () => {
//     // Form state
//     const [formValues, setFormValues] = useState({
//         purpose: '',
//         property_type: '',
//         min_price: '',
//         max_price: '',
//         bedrooms: '',
//         bathrooms: '',
//         lat: '',
//         lng: '',
//         amenities: ''
//     });

//     // State for the generated deeplink
//     const [generatedDeeplink, setGeneratedDeeplink] = useState('');

//     // State for copy feedback
//     const [copied, setCopied] = useState(false);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormValues({
//             ...formValues,
//             [name]: value
//         });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         // Create URLSearchParams object
//         const params = new URLSearchParams();

//         // Only add parameters with values to the params object
//         Object.entries(formValues).forEach(([key, value]) => {
//             if (value) {
//                 if (key === 'amenities') {
//                     // Handle comma-separated amenities
//                     const amenitiesArray = value.split(',').map(item => item.trim());
//                     amenitiesArray.forEach((amenity, index) => {
//                         params.append(`amenities[${index}]`, amenity);
//                     });
//                 } else {
//                     params.append(key, value);
//                 }
//             }
//         });

//         // Generate the deeplink
//         const deeplink = `${base_url}/filter?${params.toString()}`;
//         setGeneratedDeeplink(deeplink);
//     };

//     const copyToClipboard = async () => {
//         try {
//             await navigator.clipboard.writeText(generatedDeeplink);
//             setCopied(true);

//             // Reset copied state after 2 seconds
//             setTimeout(() => {
//                 setCopied(false);
//             }, 2000);
//         } catch (err) {
//             console.error('Failed to copy: ', err);
//             alert('Failed to copy to clipboard. Please try again.');
//         }
//     };

//     return (
//         <div className="mx-auto">
//             <div className="mb-6">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-2">Deeplink Generator</h1>
//                 <p className="text-gray-600">Create custom deeplinks for filtering properties in the mobile app.</p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Form Section */}
//                 <div className="md:col-span-2">
//                     <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter Criteria</h2>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             {/* Purpose */}
//                             <div>
//                                 <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Purpose
//                                 </label>
//                                 <select
//                                     id="purpose"
//                                     name="purpose"
//                                     value={formValues.purpose}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     <option value="">Select Purpose</option>
//                                     <option value="Rent">Rent</option>
//                                     <option value="Buy">Buy</option>
//                                 </select>
//                             </div>

//                             {/* Property Type */}
//                             <div>
//                                 <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Property Type
//                                 </label>
//                                 <select
//                                     id="property_type"
//                                     name="property_type"
//                                     value={formValues.property_type}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     <option value="">Select Property Type</option>
//                                     <option value="Apartment">Apartment</option>
//                                     <option value="House">House</option>
//                                     <option value="Villa">Villa</option>
//                                     <option value="Office">Office</option>
//                                     <option value="Shop">Shop</option>
//                                     <option value="Warehouse">Warehouse</option>
//                                     <option value="Factory">Factory</option>
//                                     <option value="Plot">Plot</option>
//                                     <option value="Room">Room</option>
//                                 </select>
//                             </div>

//                             {/* Min Price */}
//                             <div>
//                                 <label htmlFor="min_price" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Min Price
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="min_price"
//                                     name="min_price"
//                                     value={formValues.min_price}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>

//                             {/* Max Price */}
//                             <div>
//                                 <label htmlFor="max_price" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Max Price
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="max_price"
//                                     name="max_price"
//                                     value={formValues.max_price}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>

//                             {/* Bedrooms */}
//                             <div>
//                                 <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Bedrooms
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="bedrooms"
//                                     name="bedrooms"
//                                     value={formValues.bedrooms}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>

//                             {/* Bathrooms */}
//                             <div>
//                                 <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Bathrooms
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="bathrooms"
//                                     name="bathrooms"
//                                     value={formValues.bathrooms}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>

//                             {/* Latitude */}
//                             <div>
//                                 <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Latitude
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="lat"
//                                     name="lat"
//                                     step="any"
//                                     value={formValues.lat}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>

//                             {/* Longitude */}
//                             <div>
//                                 <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Longitude
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="lng"
//                                     name="lng"
//                                     step="any"
//                                     value={formValues.lng}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>

//                             {/* Amenities */}
//                             <div className="sm:col-span-2">
//                                 <label htmlFor="amenities" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Amenities (comma-separated)
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="amenities"
//                                     name="amenities"
//                                     value={formValues.amenities}
//                                     onChange={handleInputChange}
//                                     placeholder="e.g. Swimming Pool, Gym, Garden"
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>
//                         </div>

//                         <button
//                             type="submit"
//                             className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center space-x-2"
//                         >
//                             <Link className="w-4 h-4" />
//                             <span>Generate Deeplink</span>
//                         </button>
//                     </form>
//                 </div>

//                 {/* Result Section */}
//                 <div className="md:col-span-1">
//                     <div className="bg-gray-50 p-4 rounded-lg h-full">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-4">Generated Deeplink</h3>

//                         {generatedDeeplink ? (
//                             <>
//                                 <div className="p-3 bg-white border border-gray-200 rounded-md mb-4 break-all">
//                                     <p className="text-gray-800 text-sm font-mono">{generatedDeeplink}</p>
//                                 </div>

//                                 <button
//                                     onClick={copyToClipboard}
//                                     className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${copied
//                                             ? 'bg-green-500 text-white'
//                                             : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
//                                         }`}
//                                 >
//                                     {copied ? (
//                                         <>
//                                             <CheckCircle className="w-4 h-4" />
//                                             <span>Copied!</span>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Copy className="w-4 h-4" />
//                                             <span>Copy Deeplink</span>
//                                         </>
//                                     )}
//                                 </button>

//                                 <div className="mt-6">
//                                     <h4 className="text-sm font-medium text-gray-700 mb-2">Testing Instructions</h4>
//                                     <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
//                                         <li>Copy the generated deeplink</li>
//                                         <li>Open it in a compatible mobile app</li>
//                                         <li>Verify that the filters are applied correctly</li>
//                                     </ol>
//                                 </div>
//                             </>
//                         ) : (
//                             <div className="flex flex-col items-center justify-center h-48 text-gray-500">
//                                 <Link className="w-8 h-8 mb-2 opacity-50" />
//                                 <p className="text-center">Fill in the filter criteria and generate a deeplink to see it here.</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DeeplinkGenerator;


// import React, { useState } from 'react';
// import { Copy, CheckCircle, Link } from 'lucide-react';

// // Updated base URL to match the manifest
// const base_url = "https://www.profospace.in";
// // Alternative schemes
// const app_scheme = "profo";

// const DeeplinkGenerator = () => {
//     // Form state
//     const [formValues, setFormValues] = useState({
//         purpose: '',
//         property_type: '',
//         min_price: '',
//         max_price: '',
//         bedrooms: '',
//         bathrooms: '',
//         lat: '',
//         lng: '',
//         amenities: '',
//         urlType: 'web' // Default to web URL, can be 'app' for direct app scheme
//     });

//     // State for the generated deeplink
//     const [generatedDeeplink, setGeneratedDeeplink] = useState('');

//     // State for copy feedback
//     const [copied, setCopied] = useState(false);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormValues({
//             ...formValues,
//             [name]: value
//         });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         // Create URLSearchParams object
//         const params = new URLSearchParams();

//         // Only add parameters with values to the params object
//         Object.entries(formValues).forEach(([key, value]) => {
//             // Skip urlType as it's used for switching between web and app URLs
//             if (value && key !== 'urlType') {
//                 if (key === 'amenities') {
//                     // Handle comma-separated amenities
//                     const amenitiesArray = value.split(',').map(item => item.trim());
//                     amenitiesArray.forEach((amenity, index) => {
//                         params.append(`amenities[${index}]`, amenity);
//                     });
//                 } else {
//                     params.append(key, value);
//                 }
//             }
//         });

//         // Generate the deeplink based on urlType
//         let deeplink;
//         if (formValues.urlType === 'app') {
//             // Generate an app scheme URL (profo://)
//             deeplink = `${app_scheme}://filter?${params.toString()}`;
//         } else {
//             // Generate a web URL
//             deeplink = `${base_url}/filter?${params.toString()}`;
//         }

//         setGeneratedDeeplink(deeplink);
//     };

//     const copyToClipboard = async () => {
//         try {
//             await navigator.clipboard.writeText(generatedDeeplink);
//             setCopied(true);

//             // Reset copied state after 2 seconds
//             setTimeout(() => {
//                 setCopied(false);
//             }, 2000);
//         } catch (err) {
//             console.error('Failed to copy: ', err);
//             alert('Failed to copy to clipboard. Please try again.');
//         }
//     };

//     return (
//         <div className="mx-auto">
//             <div className="mb-6">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-2">Deeplink Generator</h1>
//                 <p className="text-gray-600">Create custom deeplinks for filtering properties in the mobile app.</p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Form Section */}
//                 <div className="md:col-span-2">
//                     <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter Criteria</h2>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             {/* URL Type */}
//                             <div className="sm:col-span-2">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     URL Type
//                                 </label>
//                                 <div className="flex space-x-4">
//                                     <label className="inline-flex items-center">
//                                         <input
//                                             type="radio"
//                                             name="urlType"
//                                             value="web"
//                                             checked={formValues.urlType === 'web'}
//                                             onChange={handleInputChange}
//                                             className="form-radio h-4 w-4 text-blue-600"
//                                         />
//                                         <span className="ml-2 text-gray-700">Web URL (https://)</span>
//                                     </label>
//                                     <label className="inline-flex items-center">
//                                         <input
//                                             type="radio"
//                                             name="urlType"
//                                             value="app"
//                                             checked={formValues.urlType === 'app'}
//                                             onChange={handleInputChange}
//                                             className="form-radio h-4 w-4 text-blue-600"
//                                         />
//                                         <span className="ml-2 text-gray-700">App URL (profo://)</span>
//                                     </label>
//                                 </div>
//                             </div>

//                             {/* Purpose */}
//                             <div>
//                                 <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Purpose
//                                 </label>
//                                 <select
//                                     id="purpose"
//                                     name="purpose"
//                                     value={formValues.purpose}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     <option value="">Select Purpose</option>
//                                     <option value="Rent">Rent</option>
//                                     <option value="Buy">Buy</option>
//                                 </select>
//                             </div>

//                             {/* Property Type */}
//                             <div>
//                                 <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Property Type
//                                 </label>
//                                 <select
//                                     id="property_type"
//                                     name="property_type"
//                                     value={formValues.property_type}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     <option value="">Select Property Type</option>
//                                     <option value="Apartment">Apartment</option>
//                                     <option value="House">House</option>
//                                     <option value="Villa">Villa</option>
//                                     <option value="Office">Office</option>
//                                     <option value="Shop">Shop</option>
//                                     <option value="Warehouse">Warehouse</option>
//                                     <option value="Factory">Factory</option>
//                                     <option value="Plot">Plot</option>
//                                     <option value="Room">Room</option>
//                                 </select>
//                             </div>

//                             {/* Min Price */}
//                             <div>
//                                 <label htmlFor="min_price" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Min Price
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="min_price"
//                                     name="min_price"
//                                     value={formValues.min_price}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>

//                             {/* Max Price */}
//                             <div>
//                                 <label htmlFor="max_price" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Max Price
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="max_price"
//                                     name="max_price"
//                                     value={formValues.max_price}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>

//                             {/* Bedrooms */}
//                             <div>
//                                 <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Bedrooms
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="bedrooms"
//                                     name="bedrooms"
//                                     value={formValues.bedrooms}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>

//                             {/* Bathrooms */}
//                             <div>
//                                 <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Bathrooms
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="bathrooms"
//                                     name="bathrooms"
//                                     value={formValues.bathrooms}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>

//                             {/* Latitude */}
//                             <div>
//                                 <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Latitude
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="lat"
//                                     name="lat"
//                                     step="any"
//                                     value={formValues.lat}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>

//                             {/* Longitude */}
//                             <div>
//                                 <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Longitude
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="lng"
//                                     name="lng"
//                                     step="any"
//                                     value={formValues.lng}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>

//                             {/* Amenities */}
//                             <div className="sm:col-span-2">
//                                 <label htmlFor="amenities" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Amenities (comma-separated)
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="amenities"
//                                     name="amenities"
//                                     value={formValues.amenities}
//                                     onChange={handleInputChange}
//                                     placeholder="e.g. Swimming Pool, Gym, Garden"
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>
//                         </div>

//                         <button
//                             type="submit"
//                             className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center space-x-2"
//                         >
//                             <Link className="w-4 h-4" />
//                             <span>Generate Deeplink</span>
//                         </button>
//                     </form>
//                 </div>

//                 {/* Result Section */}
//                 <div className="md:col-span-1">
//                     <div className="bg-gray-50 p-4 rounded-lg h-full">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-4">Generated Deeplink</h3>

//                         {generatedDeeplink ? (
//                             <>
//                                 <div className="p-3 bg-white border border-gray-200 rounded-md mb-4 break-all">
//                                     <p className="text-gray-800 text-sm font-mono">{generatedDeeplink}</p>
//                                 </div>

//                                 <button
//                                     onClick={copyToClipboard}
//                                     className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${copied
//                                         ? 'bg-green-500 text-white'
//                                         : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
//                                         }`}
//                                 >
//                                     {copied ? (
//                                         <>
//                                             <CheckCircle className="w-4 h-4" />
//                                             <span>Copied!</span>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Copy className="w-4 h-4" />
//                                             <span>Copy Deeplink</span>
//                                         </>
//                                     )}
//                                 </button>

//                                 <div className="mt-6">
//                                     <h4 className="text-sm font-medium text-gray-700 mb-2">Testing Instructions</h4>
//                                     <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
//                                         <li>Copy the generated deeplink</li>
//                                         <li>Open it in a compatible mobile app</li>
//                                         <li>Verify that the filters are applied correctly</li>
//                                     </ol>
//                                 </div>
//                             </>
//                         ) : (
//                             <div className="flex flex-col items-center justify-center h-48 text-gray-500">
//                                 <Link className="w-8 h-8 mb-2 opacity-50" />
//                                 <p className="text-center">Fill in the filter criteria and generate a deeplink to see it here.</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DeeplinkGenerator;


import React, { useState } from 'react';
import { Copy, CheckCircle, Link, MapPin, Map, Sliders } from 'lucide-react';
import LocationMapSelector from '../../components/Deeplink/LocationMapSelector';

// Updated base URL to match the manifest
const base_url = "https://www.profospace.in";
// Alternative schemes
const app_scheme = "profo";

const DeeplinkGenerator = () => {
    // Form state
    const [formValues, setFormValues] = useState({
        purpose: '',
        property_type: '',
        min_price: '',
        max_price: '',
        bedrooms: '',
        bathrooms: '',
        lat: '',
        lng: '',
        radius: '500',
        amenities: '',
        urlType: 'web' // Default to web URL, can be 'app' for direct app scheme
    });

    // State for the generated deeplink
    const [generatedDeeplink, setGeneratedDeeplink] = useState('');

    // State for copy feedback
    const [copied, setCopied] = useState(false);

    // State for map visibility
    const [showMap, setShowMap] = useState(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleLocationChange = (lat, lng) => {
        setFormValues({
            ...formValues,
            lat: lat,
            lng: lng
        });
    };

    const handleRadiusChange = (radius) => {
        setFormValues({
            ...formValues,
            radius: radius.toString()
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create URLSearchParams object
        const params = new URLSearchParams();

        // Only add parameters with values to the params object
        Object.entries(formValues).forEach(([key, value]) => {
            // Skip urlType as it's used for switching between web and app URLs
            if (value && key !== 'urlType') {
                if (key === 'amenities') {
                    // Handle comma-separated amenities
                    const amenitiesArray = value.split(',').map(item => item.trim());
                    amenitiesArray.forEach((amenity, index) => {
                        params.append(`amenities[${index}]`, amenity);
                    });
                } else {
                    params.append(key, value);
                }
            }
        });

        // Generate the deeplink based on urlType
        let deeplink;
        if (formValues.urlType === 'app') {
            // Generate an app scheme URL (profo://)
            deeplink = `${app_scheme}://filter?${params.toString()}`;
        } else {
            // Generate a web URL
            deeplink = `${base_url}/filter?${params.toString()}`;
        }

        setGeneratedDeeplink(deeplink);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedDeeplink);
            setCopied(true);

            // Reset copied state after 2 seconds
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        }
    };

    return (
            <div className="">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-4 px-6">
                            <h2 className="text-lg font-semibold text-white flex items-center">
                                <Sliders className="mr-2 h-5 w-5" />
                                Deeplink Generator
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* URL Type */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    URL Type
                                </label>
                                <div className="flex space-x-6">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="urlType"
                                            value="web"
                                            checked={formValues.urlType === 'web'}
                                            onChange={handleInputChange}
                                            className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                        />
                                        <span className="ml-2 text-gray-700">Web URL (https://)</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="urlType"
                                            value="app"
                                            checked={formValues.urlType === 'app'}
                                            onChange={handleInputChange}
                                            className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                        />
                                        <span className="ml-2 text-gray-700">App URL (profo://)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Location Section */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <h3 className="text-md font-medium text-gray-700 flex items-center">
                                        <MapPin className="mr-2 h-4 w-4 text-indigo-500" />
                                        Location Parameters
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowMap(!showMap)}
                                        className="px-3 py-1 text-xs font-medium rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus:outline-none flex items-center"
                                    >
                                        <Map className="mr-1 h-3 w-3" />
                                        {showMap ? 'Hide Map' : 'Show Map'}
                                    </button>
                                </div>

                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
                                                Latitude
                                            </label>
                                            <input
                                                type="number"
                                                id="lat"
                                                name="lat"
                                                step="any"
                                                value={formValues.lat}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="e.g. 28.6139"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">
                                                Longitude
                                            </label>
                                            <input
                                                type="number"
                                                id="lng"
                                                name="lng"
                                                step="any"
                                                value={formValues.lng}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="e.g. 77.2090"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
                                                Radius (meters)
                                            </label>
                                            <input
                                                type="number"
                                                id="radius"
                                                name="radius"
                                                value={formValues.radius}
                                                onChange={handleInputChange}
                                                min="100"
                                                max="5000"
                                                step="100"
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="e.g. 500"
                                            />
                                        </div>
                                    </div>

                                    {showMap && (
                                        <div className="mt-4 h-150">
                                            <LocationMapSelector
                                                latitude={formValues.lat ? parseFloat(formValues.lat) : undefined}
                                                longitude={formValues.lng ? parseFloat(formValues.lng) : undefined}
                                                radius={formValues.radius ? parseInt(formValues.radius) : 500}
                                                onLocationChange={handleLocationChange}
                                                onRadiusChange={handleRadiusChange}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Property Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Purpose */}
                                <div>
                                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                                        Purpose
                                    </label>
                                    <select
                                        id="purpose"
                                        name="purpose"
                                        value={formValues.purpose}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Select Purpose</option>
                                        <option value="Rent">Rent</option>
                                        <option value="Buy">Buy</option>
                                    </select>
                                </div>

                                {/* Property Type */}
                                <div>
                                    <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Type
                                    </label>
                                    <select
                                        id="property_type"
                                        name="property_type"
                                        value={formValues.property_type}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Select Property Type</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="House">House</option>
                                        <option value="Villa">Villa</option>
                                        <option value="Office">Office</option>
                                        <option value="Shop">Shop</option>
                                        <option value="Warehouse">Warehouse</option>
                                        <option value="Factory">Factory</option>
                                        <option value="Plot">Plot</option>
                                        <option value="Room">Room</option>
                                    </select>
                                </div>

                                {/* Min Price */}
                                <div>
                                    <label htmlFor="min_price" className="block text-sm font-medium text-gray-700 mb-1">
                                        Min Price
                                    </label>
                                    <input
                                        type="number"
                                        id="min_price"
                                        name="min_price"
                                        value={formValues.min_price}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Minimum price"
                                    />
                                </div>

                                {/* Max Price */}
                                <div>
                                    <label htmlFor="max_price" className="block text-sm font-medium text-gray-700 mb-1">
                                        Max Price
                                    </label>
                                    <input
                                        type="number"
                                        id="max_price"
                                        name="max_price"
                                        value={formValues.max_price}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Maximum price"
                                    />
                                </div>

                                {/* Bedrooms */}
                                <div>
                                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                                        Bedrooms
                                    </label>
                                    <input
                                        type="number"
                                        id="bedrooms"
                                        name="bedrooms"
                                        value={formValues.bedrooms}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Number of bedrooms"
                                    />
                                </div>

                                {/* Bathrooms */}
                                <div>
                                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                                        Bathrooms
                                    </label>
                                    <input
                                        type="number"
                                        id="bathrooms"
                                        name="bathrooms"
                                        value={formValues.bathrooms}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Number of bathrooms"
                                    />
                                </div>
                            </div>

                            {/* Amenities */}
                            <div>
                                <label htmlFor="amenities" className="block text-sm font-medium text-gray-700 mb-1">
                                    Amenities (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    id="amenities"
                                    name="amenities"
                                    value={formValues.amenities}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Swimming Pool, Gym, Garden"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium rounded-md shadow-md transition-colors flex items-center justify-center space-x-2"
                            >
                                <Link className="w-5 h-5" />
                                <span>Generate Deeplink</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Result Section */}
                <div className="lg:col-span-1 mt-6">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-4 px-6">
                            <h3 className="text-lg font-semibold text-white">Generated Deeplink</h3>
                        </div>

                        <div className="p-6 h-full flex flex-col">
                            {generatedDeeplink ? (
                                <>
                                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md mb-4 break-all flex-grow">
                                        <p className="text-gray-800 text-sm font-mono">{generatedDeeplink}</p>
                                    </div>

                                    <button
                                        onClick={copyToClipboard}
                                        className={`w-full py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2 ${copied
                                            ? 'bg-green-500 text-white'
                                            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                                            }`}
                                    >
                                        {copied ? (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-5 h-5" />
                                                <span>Copy Deeplink</span>
                                            </>
                                        )}
                                    </button>

                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Testing Instructions</h4>
                                        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                                            <li>Copy the generated deeplink</li>
                                            <li>Open it in the ProfoSpace mobile app</li>
                                            <li>Verify that the filters are applied correctly</li>
                                            <li>Check that the location and radius are shown on the map</li>
                                        </ol>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 px-4 flex-grow">
                                    <div className="bg-gray-50 rounded-full p-6 mb-4">
                                        <Link className="w-12 h-12 text-indigo-400" />
                                    </div>
                                    <p className="text-center text-gray-500 mb-6">Fill in the filter criteria and generate a deeplink to see it here.</p>
                                    <p className="text-sm text-gray-400 text-center">You can use the map to easily select a location!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default DeeplinkGenerator;
