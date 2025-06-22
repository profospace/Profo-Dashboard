

// import React, { useState } from 'react';
// import { Copy, CheckCircle, Link, MapPin, Map, Sliders } from 'lucide-react';
// import LocationMapSelector from '../../components/Deeplink/LocationMapSelector';
// import { base_url } from '../../../utils/base_url';


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
//         radius: '500',
//         amenities: '',
//         urlType: 'web' // Default to web URL, can be 'app' for direct app scheme
//     });

//     // State for the generated deeplink
//     const [generatedDeeplink, setGeneratedDeeplink] = useState('');

//     // State for copy feedback
//     const [copied, setCopied] = useState(false);

//     // State for map visibility
//     const [showMap, setShowMap] = useState(true);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormValues({
//             ...formValues,
//             [name]: value
//         });
//     };

//     const handleLocationChange = (lat, lng) => {
//         setFormValues({
//             ...formValues,
//             lat: lat,
//             lng: lng
//         });
//     };

//     const handleRadiusChange = (radius) => {
//         setFormValues({
//             ...formValues,
//             radius: radius.toString()
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
//             <div className="">
//                 {/* Form Section */}
//                 <div className="lg:col-span-2">
//                     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                         <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-4 px-6">
//                             <h2 className="text-lg font-semibold text-white flex items-center">
//                                 <Sliders className="mr-2 h-5 w-5" />
//                                 Deeplink Generator
//                             </h2>
//                         </div>

//                         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                             {/* URL Type */}
//                             <div className="p-4 bg-gray-50 rounded-lg">
//                                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                                     URL Type
//                                 </label>
//                                 <div className="flex space-x-6">
//                                     <label className="inline-flex items-center">
//                                         <input
//                                             type="radio"
//                                             name="urlType"
//                                             value="web"
//                                             checked={formValues.urlType === 'web'}
//                                             onChange={handleInputChange}
//                                             className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
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
//                                             className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                                         />
//                                         <span className="ml-2 text-gray-700">App URL (profo://)</span>
//                                     </label>
//                                 </div>
//                             </div>

//                             {/* Location Section */}
//                             <div className="border border-gray-200 rounded-lg overflow-hidden">
//                                 <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
//                                     <h3 className="text-md font-medium text-gray-700 flex items-center">
//                                         <MapPin className="mr-2 h-4 w-4 text-indigo-500" />
//                                         Location Parameters
//                                     </h3>
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowMap(!showMap)}
//                                         className="px-3 py-1 text-xs font-medium rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus:outline-none flex items-center"
//                                     >
//                                         <Map className="mr-1 h-3 w-3" />
//                                         {showMap ? 'Hide Map' : 'Show Map'}
//                                     </button>
//                                 </div>

//                                 <div className="p-4">
//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                         <div>
//                                             <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Latitude
//                                             </label>
//                                             <input
//                                                 type="number"
//                                                 id="lat"
//                                                 name="lat"
//                                                 step="any"
//                                                 value={formValues.lat}
//                                                 onChange={handleInputChange}
//                                                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                                 placeholder="e.g. 28.6139"
//                                             />
//                                         </div>

//                                         <div>
//                                             <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Longitude
//                                             </label>
//                                             <input
//                                                 type="number"
//                                                 id="lng"
//                                                 name="lng"
//                                                 step="any"
//                                                 value={formValues.lng}
//                                                 onChange={handleInputChange}
//                                                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                                 placeholder="e.g. 77.2090"
//                                             />
//                                         </div>

//                                         <div>
//                                             <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Radius (meters)
//                                             </label>
//                                             <input
//                                                 type="number"
//                                                 id="radius"
//                                                 name="radius"
//                                                 value={formValues.radius}
//                                                 onChange={handleInputChange}
//                                                 min="100"
//                                                 max="5000"
//                                                 step="100"
//                                                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                                 placeholder="e.g. 500"
//                                             />
//                                         </div>
//                                     </div>

//                                     {showMap && (
//                                         <div className="mt-4 h-150">
//                                             <LocationMapSelector
//                                                 latitude={formValues.lat ? parseFloat(formValues.lat) : undefined}
//                                                 longitude={formValues.lng ? parseFloat(formValues.lng) : undefined}
//                                                 radius={formValues.radius ? parseInt(formValues.radius) : 500}
//                                                 onLocationChange={handleLocationChange}
//                                                 onRadiusChange={handleRadiusChange}
//                                             />
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Property Details */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {/* Purpose */}
//                                 <div>
//                                     <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Purpose
//                                     </label>
//                                     <select
//                                         id="purpose"
//                                         name="purpose"
//                                         value={formValues.purpose}
//                                         onChange={handleInputChange}
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                     >
//                                         <option value="">Select Purpose</option>
//                                         <option value="Rent">Rent</option>
//                                         <option value="Buy">Buy</option>
//                                     </select>
//                                 </div>

//                                 {/* Property Type */}
//                                 <div>
//                                     <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Property Type
//                                     </label>
//                                     <select
//                                         id="property_type"
//                                         name="property_type"
//                                         value={formValues.property_type}
//                                         onChange={handleInputChange}
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                     >
//                                         <option value="">Select Property Type</option>
//                                         <option value="Apartment">Apartment</option>
//                                         <option value="House">House</option>
//                                         <option value="Villa">Villa</option>
//                                         <option value="Office">Office</option>
//                                         <option value="Shop">Shop</option>
//                                         <option value="Warehouse">Warehouse</option>
//                                         <option value="Factory">Factory</option>
//                                         <option value="Plot">Plot</option>
//                                         <option value="Room">Room</option>
//                                     </select>
//                                 </div>

//                                 {/* Min Price */}
//                                 <div>
//                                     <label htmlFor="min_price" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Min Price
//                                     </label>
//                                     <input
//                                         type="number"
//                                         id="min_price"
//                                         name="min_price"
//                                         value={formValues.min_price}
//                                         onChange={handleInputChange}
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                         placeholder="Minimum price"
//                                     />
//                                 </div>

//                                 {/* Max Price */}
//                                 <div>
//                                     <label htmlFor="max_price" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Max Price
//                                     </label>
//                                     <input
//                                         type="number"
//                                         id="max_price"
//                                         name="max_price"
//                                         value={formValues.max_price}
//                                         onChange={handleInputChange}
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                         placeholder="Maximum price"
//                                     />
//                                 </div>

//                                 {/* Bedrooms */}
//                                 <div>
//                                     <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Bedrooms
//                                     </label>
//                                     <input
//                                         type="number"
//                                         id="bedrooms"
//                                         name="bedrooms"
//                                         value={formValues.bedrooms}
//                                         onChange={handleInputChange}
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                         placeholder="Number of bedrooms"
//                                     />
//                                 </div>

//                                 {/* Bathrooms */}
//                                 <div>
//                                     <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Bathrooms
//                                     </label>
//                                     <input
//                                         type="number"
//                                         id="bathrooms"
//                                         name="bathrooms"
//                                         value={formValues.bathrooms}
//                                         onChange={handleInputChange}
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                         placeholder="Number of bathrooms"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Amenities */}
//                             <div>
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
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                 />
//                             </div>

//                             <button
//                                 type="submit"
//                                 className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium rounded-md shadow-md transition-colors flex items-center justify-center space-x-2"
//                             >
//                                 <Link className="w-5 h-5" />
//                                 <span>Generate Deeplink</span>
//                             </button>
//                         </form>
//                     </div>
//                 </div>

//                 {/* Result Section */}
//                 <div className="lg:col-span-1 mt-6">
//                     <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
//                         <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-4 px-6">
//                             <h3 className="text-lg font-semibold text-white">Generated Deeplink</h3>
//                         </div>

//                         <div className="p-6 h-full flex flex-col">
//                             {generatedDeeplink ? (
//                                 <>
//                                     <div className="p-4 bg-gray-50 border border-gray-200 rounded-md mb-4 break-all flex-grow">
//                                         <p className="text-gray-800 text-sm font-mono">{generatedDeeplink}</p>
//                                     </div>

//                                     <button
//                                         onClick={copyToClipboard}
//                                         className={`w-full py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2 ${copied
//                                             ? 'bg-green-500 text-white'
//                                             : 'bg-indigo-500 hover:bg-indigo-600 text-white'
//                                             }`}
//                                     >
//                                         {copied ? (
//                                             <>
//                                                 <CheckCircle className="w-5 h-5" />
//                                                 <span>Copied!</span>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <Copy className="w-5 h-5" />
//                                                 <span>Copy Deeplink</span>
//                                             </>
//                                         )}
//                                     </button>

//                                     <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
//                                         <h4 className="text-sm font-semibold text-gray-700 mb-3">Testing Instructions</h4>
//                                         <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
//                                             <li>Copy the generated deeplink</li>
//                                             <li>Open it in the ProfoSpace mobile app</li>
//                                             <li>Verify that the filters are applied correctly</li>
//                                             <li>Check that the location and radius are shown on the map</li>
//                                         </ol>
//                                     </div>
//                                 </>
//                             ) : (
//                                 <div className="flex flex-col items-center justify-center py-12 px-4 flex-grow">
//                                     <div className="bg-gray-50 rounded-full p-6 mb-4">
//                                         <Link className="w-12 h-12 text-indigo-400" />
//                                     </div>
//                                     <p className="text-center text-gray-500 mb-6">Fill in the filter criteria and generate a deeplink to see it here.</p>
//                                     <p className="text-sm text-gray-400 text-center">You can use the map to easily select a location!</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//     );
// };

// export default DeeplinkGenerator;


// import React, { useState } from 'react';
// import { Copy, CheckCircle, Link, MapPin, Map, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
// // import { base_url } from '../../../utils/base_url';
// import LocationMapSelector from '../../components/Deeplink/LocationMapSelector';


// const base_url = "https://www.profospace.in";
// const app_scheme = "profo";


// const DeeplinkGenerator = () => {
//     // Form state with all property fields
//     const [formValues, setFormValues] = useState({
//         purpose: '',
//         property_type: '',
//         min_price: '',
//         max_price: '',
//         bedrooms: '',
//         bathrooms: '',
//         lat: '',
//         lng: '',
//         radius: '500',
//         amenities: '',
//         construction_status: '',
//         possession: '',
//         vastuCompliance: '',
//         loanApprovalStatus: '',
//         builderReputation: '',
//         broker_status: '',
//         facilities: '',
//         location_advantage: '',
//         overlookingAmenities: '',
//         transactionType: '',
//         propertyOwnership: '',
//         flooring: '',
//         parking: '',
//         gatedCommunity: '',
//         waterSource: '',
//         powerBackup: '',
//         petFriendly: '',
//         religiousNearby: '',
//         inProximity: '',
//         propertyAge: '',
//         propertyTypes: '',
//         propertyFeatures: '',
//         viewTypes: '',
//         legalClearance: '',
//         propertyConditions: '',
//         legalStatuses: '',
//         environmentalFactors: '',
//         kitchenType: '',
//         bathroomFeatures: '',
//         specialCategories: '',
//         flooringType: '',
//         socialInfrastructure: '',
//         constructionStatuses: '',
//         ownershipTypes: '',
//         financingOptions: '',
//         propertyTaxClasses: '',
//         environmentalCertifications: '',
//         propertyManagementServices: '',
//         investmentStrategies: '',
//         urlType: 'web'
//     });

//     // State for the generated deeplink
//     const [generatedDeeplink, setGeneratedDeeplink] = useState('');

//     // State for copy feedback
//     const [copied, setCopied] = useState(false);

//     // State for map visibility
//     const [showMap, setShowMap] = useState(true);

//     // State for section visibility
//     const [expandedSections, setExpandedSections] = useState({
//         basic: true,
//         location: true,
//         property: false,
//         amenities: false,
//         legal: false,
//         financial: false,
//         environmental: false
//     });

//     // Field options for dropdowns and multi-select
//     const fieldOptions = {
//         purpose: ['Rent', 'Buy', 'Investment'],
//         property_type: ['Apartment', 'House', 'Villa', 'Office', 'Shop', 'Warehouse', 'Factory', 'Plot', 'Room'],
//         construction_status: ['Under Construction', 'Ready to Move', 'New Launch', 'Nearing Completion', 'Foundation Laid', 'Structure Complete'],
//         possession: ['Immediate', 'Within 3 Months', 'Within 6 Months', 'Within 1 Year', 'Within 2 Years', 'Ready'],
//         vastuCompliance: ['East Facing', 'Proper Ventilation', 'Main Door Direction', 'North East Water Source', 'South West Heavy Items', 'Kitchen in South East'],
//         loanApprovalStatus: ['SBI Approved', 'HDFC Approved', 'ICICI Approved', 'Axis Bank Approved', 'Pre-approved by Major Banks', '90% Loan Available'],
//         builderReputation: ['Premium Builder', 'Trusted Developer', 'Award Winning', 'ISO Certified', 'Established Builder', 'Quality Constructor'],
//         broker_status: ['Owner Direct', 'Authorized Dealer', 'Exclusive Agent', 'Builder Direct', 'Channel Partner', 'Verified Broker'],
//         facilities: ['24/7 Security', 'CCTV Surveillance', 'Power Backup', 'Water Supply', 'Elevator', 'Parking', 'Club House', 'Swimming Pool', 'Gym', 'Garden'],
//         location_advantage: ['Near Metro Station', 'IT Hub Proximity', 'Airport Connectivity', 'Shopping Mall Nearby', 'School Zone', 'Hospital Area', 'Business District'],
//         overlookingAmenities: ['Garden View', 'Pool View', 'Club House View', 'Park View', 'City View', 'Road View', 'Greenery View'],
//         transactionType: ['New Booking', 'Resale', 'Rental', 'Lease', 'Investment', 'End Use'],
//         propertyOwnership: ['Freehold', 'Leasehold', 'Cooperative Society', 'Power of Attorney', 'Clear Title', 'Society Ownership'],
//         flooring: ['Marble', 'Granite', 'Vitrified Tiles', 'Ceramic Tiles', 'Wooden Flooring', 'Italian Marble'],
//         parking: ['Covered Parking', 'Open Parking', 'Stilt Parking', 'Basement Parking', 'Multi Level Parking', 'Reserved Parking'],
//         gatedCommunity: ['Yes', 'No'],
//         waterSource: ['Corporation Water', 'Bore Well', 'Water Tanker', 'Treated Water', 'RO System', 'Municipal Supply', 'Rainwater Harvesting'],
//         powerBackup: ['100% Power Backup', 'DG Backup', 'Solar Power', 'UPS System', 'Generator Backup', 'Inverter Backup'],
//         petFriendly: ['Yes', 'No'],
//         religiousNearby: ['Hanuman Temple', 'Shiv Temple', 'Krishna Temple', 'Gurudwara', 'Church', 'Mosque'],
//         inProximity: ['Metro Station 2km', 'Airport 15km', 'Shopping Mall 1km', 'Hospital 2km', 'School 500m', 'IT Park 3km'],
//         propertyTypes: ['Apartment', 'Villa', 'Independent House', 'Duplex', 'Penthouse', 'Studio', 'Row House'],
//         propertyFeatures: ['Spacious Rooms', 'Modern Kitchen', 'Attached Bathroom', 'Balcony', 'Terrace', 'Garden Area', 'Servant Room'],
//         viewTypes: ['City View', 'Garden View', 'Pool View', 'Park View', 'River View', 'Hill View', 'Road View'],
//         legalClearance: ['Clear Title', 'NOC Approved', 'Bank Approved', 'Municipality Approved', 'RERA Approved', 'Legal Verification Done'],
//         propertyConditions: ['Brand New', 'Excellent Condition', 'Well Maintained', 'Good Condition', 'Recently Renovated', 'Furnished'],
//         legalStatuses: ['Clear Title', 'Registered Property', 'Freehold', 'Leasehold', 'RERA Registered', 'No Litigation'],
//         environmentalFactors: ['Green Building', 'Eco Friendly', 'Energy Efficient', 'Rainwater Harvesting', 'Solar Power', 'Pollution Free'],
//         kitchenType: ['Modular Kitchen', 'Open Kitchen', 'Closed Kitchen', 'L-Shaped Kitchen', 'U-Shaped Kitchen', 'Island Kitchen'],
//         bathroomFeatures: ['Attached Bathroom', 'Western Toilet', 'Modern Fixtures', 'Hot Water', 'Shower Cubicle', 'Bathtub'],
//         specialCategories: ['Luxury Property', 'Premium Segment', 'Affordable Housing', 'Investment Property', 'NRI Friendly', 'Pet Friendly'],
//         flooringType: ['Marble Flooring', 'Granite Flooring', 'Vitrified Tiles', 'Ceramic Tiles', 'Wooden Flooring', 'Italian Marble'],
//         socialInfrastructure: ['School Nearby', 'Hospital Available', 'Shopping Complex', 'Bank & ATM', 'Transportation Hub', 'Entertainment Zone'],
//         constructionStatuses: ['Completed', 'Under Construction', 'About to Launch', 'Foundation Stage', 'Structure Complete', 'Ready for Possession'],
//         ownershipTypes: ['Individual', 'Joint Ownership', 'Company Owned', 'Society Property', 'Cooperative Housing', 'Trust Property'],
//         financingOptions: ['Home Loan Available', 'Easy EMI Options', 'Zero Down Payment', 'Flexible Payment', 'Government Subsidy', 'Bank Tie-up'],
//         propertyTaxClasses: ['Residential Property Tax', 'Commercial Property Tax', 'Low Tax Zone', 'Standard Tax', 'Municipal Tax'],
//         environmentalCertifications: ['Green Building Certified', 'LEED Certified', 'Energy Star', 'Eco Friendly Certificate', 'Solar Certified'],
//         propertyManagementServices: ['24/7 Maintenance', 'Security Services', 'Housekeeping', 'Facility Management', 'Property Care'],
//         investmentStrategies: ['Capital Appreciation', 'Rental Income', 'Long Term Investment', 'Tax Benefits', 'Wealth Creation', 'Value Investment']
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormValues({
//             ...formValues,
//             [name]: value
//         });
//     };

//     const handleLocationChange = (lat, lng) => {
//         setFormValues({
//             ...formValues,
//             lat: lat,
//             lng: lng
//         });
//     };

//     const handleRadiusChange = (radius) => {
//         setFormValues({
//             ...formValues,
//             radius: radius.toString()
//         });
//     };

//     const toggleSection = (section) => {
//         setExpandedSections(prev => ({
//             ...prev,
//             [section]: !prev[section]
//         }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const params = new URLSearchParams();

//         Object.entries(formValues).forEach(([key, value]) => {
//             if (value && key !== 'urlType') {
//                 if (key === 'amenities' || key === 'facilities' || key === 'waterSource' || key === 'vastuCompliance' ||
//                     key === 'loanApprovalStatus' || key === 'location_advantage' || key === 'overlookingAmenities' ||
//                     key === 'religiousNearby' || key === 'inProximity' || key === 'propertyFeatures' || key === 'viewTypes' ||
//                     key === 'legalClearance' || key === 'environmentalFactors' || key === 'bathroomFeatures' ||
//                     key === 'socialInfrastructure' || key === 'financingOptions') {
//                     // Handle comma-separated values
//                     const valuesArray = value.split(',').map(item => item.trim()).filter(item => item);
//                     valuesArray.forEach((item, index) => {
//                         params.append(`${key}[${index}]`, item);
//                     });
//                 } else {
//                     params.append(key, value);
//                 }
//             }
//         });

//         let deeplink;
//         if (formValues.urlType === 'app') {
//             deeplink = `${app_scheme}://filter?${params.toString()}`;
//         } else {
//             deeplink = `${base_url}/filter?${params.toString()}`;
//         }

//         setGeneratedDeeplink(deeplink);
//     };

//     const copyToClipboard = async () => {
//         try {
//             await navigator.clipboard.writeText(generatedDeeplink);
//             setCopied(true);
//             setTimeout(() => setCopied(false), 2000);
//         } catch (err) {
//             console.error('Failed to copy: ', err);
//             alert('Failed to copy to clipboard. Please try again.');
//         }
//     };

//     const renderSection = (title, sectionKey, children) => (
//         <div className="border border-gray-200 rounded-lg overflow-hidden">
//             <button
//                 type="button"
//                 onClick={() => toggleSection(sectionKey)}
//                 className="w-full flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200 hover:bg-gray-100 focus:outline-none"
//             >
//                 <h3 className="text-md font-medium text-gray-700">{title}</h3>
//                 {expandedSections[sectionKey] ?
//                     <ChevronUp className="h-4 w-4 text-gray-500" /> :
//                     <ChevronDown className="h-4 w-4 text-gray-500" />
//                 }
//             </button>
//             {expandedSections[sectionKey] && (
//                 <div className="p-4">
//                     {children}
//                 </div>
//             )}
//         </div>
//     );

//     const renderSelectField = (name, label, options, placeholder = `Select ${label}`) => (
//         <div>
//             <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
//                 {label}
//             </label>
//             <select
//                 id={name}
//                 name={name}
//                 value={formValues[name]}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             >
//                 <option value="">{placeholder}</option>
//                 {options.map(option => (
//                     <option key={option} value={option}>{option}</option>
//                 ))}
//             </select>
//         </div>
//     );

//     const renderTextArea = (name, label, placeholder) => (
//         <div>
//             <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
//                 {label} (comma-separated)
//             </label>
//             <textarea
//                 id={name}
//                 name={name}
//                 value={formValues[name]}
//                 onChange={handleInputChange}
//                 placeholder={placeholder}
//                 rows={3}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             />
//         </div>
//     );

//     return (
//         <div className="max-w-7xl mx-auto">
//             <div className="flex flex-col gap-6">
//                 {/* Form Section */}
//                 <div className="lg:col-span-2">
//                     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                         <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-4 px-6">
//                             <h2 className="text-lg font-semibold text-white flex items-center">
//                                 <Sliders className="mr-2 h-5 w-5" />
//                                 Enhanced Deeplink Generator
//                             </h2>
//                         </div>

//                         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                             {/* URL Type */}
//                             <div className="p-4 bg-gray-50 rounded-lg">
//                                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                                     URL Type
//                                 </label>
//                                 <div className="flex space-x-6">
//                                     <label className="inline-flex items-center">
//                                         <input
//                                             type="radio"
//                                             name="urlType"
//                                             value="web"
//                                             checked={formValues.urlType === 'web'}
//                                             onChange={handleInputChange}
//                                             className="form-radio h-4 w-4 text-indigo-600"
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
//                                             className="form-radio h-4 w-4 text-indigo-600"
//                                         />
//                                         <span className="ml-2 text-gray-700">App URL (profo://)</span>
//                                     </label>
//                                 </div>
//                             </div>

//                             {/* Basic Property Details */}
//                             {renderSection("Basic Property Details", "basic",
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     {renderSelectField('purpose', 'Purpose', fieldOptions.purpose)}
//                                     {renderSelectField('property_type', 'Property Type', fieldOptions.property_type)}
//                                     <div>
//                                         <label htmlFor="min_price" className="block text-sm font-medium text-gray-700 mb-1">
//                                             Min Price
//                                         </label>
//                                         <input
//                                             type="number"
//                                             id="min_price"
//                                             name="min_price"
//                                             value={formValues.min_price}
//                                             onChange={handleInputChange}
//                                             className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                             placeholder="Minimum price"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label htmlFor="max_price" className="block text-sm font-medium text-gray-700 mb-1">
//                                             Max Price
//                                         </label>
//                                         <input
//                                             type="number"
//                                             id="max_price"
//                                             name="max_price"
//                                             value={formValues.max_price}
//                                             onChange={handleInputChange}
//                                             className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                             placeholder="Maximum price"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
//                                             Bedrooms
//                                         </label>
//                                         <input
//                                             type="number"
//                                             id="bedrooms"
//                                             name="bedrooms"
//                                             value={formValues.bedrooms}
//                                             onChange={handleInputChange}
//                                             className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                             placeholder="Number of bedrooms"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
//                                             Bathrooms
//                                         </label>
//                                         <input
//                                             type="number"
//                                             id="bathrooms"
//                                             name="bathrooms"
//                                             value={formValues.bathrooms}
//                                             onChange={handleInputChange}
//                                             className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                             placeholder="Number of bathrooms"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label htmlFor="propertyAge" className="block text-sm font-medium text-gray-700 mb-1">
//                                             Property Age (years)
//                                         </label>
//                                         <input
//                                             type="number"
//                                             id="propertyAge"
//                                             name="propertyAge"
//                                             value={formValues.propertyAge}
//                                             onChange={handleInputChange}
//                                             className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                             placeholder="Age in years"
//                                         />
//                                     </div>
//                                     {renderSelectField('gatedCommunity', 'Gated Community', fieldOptions.gatedCommunity)}
//                                     {renderSelectField('petFriendly', 'Pet Friendly', fieldOptions.petFriendly)}
//                                 </div>
//                             )}

//                             {/* Location Parameters */}
//                             {renderSection("Location Parameters", "location",
//                                 <>
//                                     <div className="flex items-center justify-between mb-4">
//                                         <h4 className="text-sm font-medium text-gray-700 flex items-center">
//                                             <MapPin className="mr-2 h-4 w-4 text-indigo-500" />
//                                             Map Selection
//                                         </h4>
//                                         <button
//                                             type="button"
//                                             onClick={() => setShowMap(!showMap)}
//                                             className="px-3 py-1 text-xs font-medium rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus:outline-none flex items-center"
//                                         >
//                                             <Map className="mr-1 h-3 w-3" />
//                                             {showMap ? 'Hide Map' : 'Show Map'}
//                                         </button>
//                                     </div>

//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                                         <div>
//                                             <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Latitude
//                                             </label>
//                                             <input
//                                                 type="number"
//                                                 id="lat"
//                                                 name="lat"
//                                                 step="any"
//                                                 value={formValues.lat}
//                                                 onChange={handleInputChange}
//                                                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                                 placeholder="e.g. 28.6139"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Longitude
//                                             </label>
//                                             <input
//                                                 type="number"
//                                                 id="lng"
//                                                 name="lng"
//                                                 step="any"
//                                                 value={formValues.lng}
//                                                 onChange={handleInputChange}
//                                                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                                 placeholder="e.g. 77.2090"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Radius (meters)
//                                             </label>
//                                             <input
//                                                 type="number"
//                                                 id="radius"
//                                                 name="radius"
//                                                 value={formValues.radius}
//                                                 onChange={handleInputChange}
//                                                 min="100"
//                                                 max="5000"
//                                                 step="100"
//                                                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                                 placeholder="e.g. 500"
//                                             />
//                                         </div>
//                                     </div>

//                                     {showMap && (
//                                          <div className="mt-4 h-150">
//                                              <LocationMapSelector
//                                                  latitude={formValues.lat ? parseFloat(formValues.lat) : undefined}
//                                                  longitude={formValues.lng ? parseFloat(formValues.lng) : undefined}
//                                                  radius={formValues.radius ? parseInt(formValues.radius) : 500}
//                                                  onLocationChange={handleLocationChange}
//                                                  onRadiusChange={handleRadiusChange}
//                                              />
//                                          </div>
//                                      )}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                                         {renderTextArea('location_advantage', 'Location Advantages', 'e.g. Near Metro Station, IT Hub Proximity')}
//                                         {renderTextArea('inProximity', 'In Proximity', 'e.g. Metro Station 2km, Shopping Mall 1km')}
//                                         {renderTextArea('religiousNearby', 'Religious Places Nearby', 'e.g. Hanuman Temple, Gurudwara')}
//                                     </div>
//                                 </>
//                             )}

//                             {/* Property Features & Amenities */}
//                             {renderSection("Property Features & Amenities", "amenities",
//                                 <div className="space-y-4">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         {renderSelectField('construction_status', 'Construction Status', fieldOptions.construction_status)}
//                                         {renderSelectField('possession', 'Possession', fieldOptions.possession)}
//                                         {renderSelectField('flooring', 'Flooring', fieldOptions.flooring)}
//                                         {renderSelectField('parking', 'Parking', fieldOptions.parking)}
//                                         {renderSelectField('powerBackup', 'Power Backup', fieldOptions.powerBackup)}
//                                         {renderSelectField('kitchenType', 'Kitchen Type', fieldOptions.kitchenType)}
//                                     </div>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         {renderTextArea('amenities', 'Amenities', 'e.g. Swimming Pool, Gym, Garden')}
//                                         {renderTextArea('facilities', 'Facilities', 'e.g. 24/7 Security, CCTV Surveillance')}
//                                         {renderTextArea('waterSource', 'Water Source', 'e.g. Corporation Water, Bore Well')}
//                                         {renderTextArea('vastuCompliance', 'Vastu Compliance', 'e.g. East Facing, Proper Ventilation')}
//                                         {renderTextArea('overlookingAmenities', 'Overlooking Amenities', 'e.g. Garden View, Pool View')}
//                                         {renderTextArea('propertyFeatures', 'Property Features', 'e.g. Spacious Rooms, Modern Kitchen')}
//                                         {renderTextArea('viewTypes', 'View Types', 'e.g. City View, Garden View')}
//                                         {renderTextArea('bathroomFeatures', 'Bathroom Features', 'e.g. Attached Bathroom, Modern Fixtures')}
//                                         {renderTextArea('socialInfrastructure', 'Social Infrastructure', 'e.g. School Nearby, Hospital Available')}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Property Classification */}
//                             {renderSection("Property Classification", "property",
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     {renderSelectField('transactionType', 'Transaction Type', fieldOptions.transactionType)}
//                                     {renderSelectField('propertyOwnership', 'Property Ownership', fieldOptions.propertyOwnership)}
//                                     {renderSelectField('builderReputation', 'Builder Reputation', fieldOptions.builderReputation)}
//                                     {renderSelectField('broker_status', 'Broker Status', fieldOptions.broker_status)}
//                                     {renderTextArea('propertyTypes', 'Property Types', 'e.g. Apartment, Villa')}
//                                     {renderTextArea('specialCategories', 'Special Categories', 'e.g. Luxury Property, Pet Friendly')}
//                                     {renderTextArea('flooringType', 'Flooring Type', 'e.g. Marble Flooring, Granite Flooring')}
//                                     {renderTextArea('constructionStatuses', 'Construction Statuses', 'e.g. Completed, Under Construction')}
//                                     {renderTextArea('ownershipTypes', 'Ownership Types', 'e.g. Individual, Joint Ownership')}
//                                     {renderTextArea('propertyConditions', 'Property Conditions', 'e.g. Brand New, Excellent Condition')}
//                                 </div>
//                             )}

//                             {/* Legal & Documentation */}
//                             {renderSection("Legal & Documentation", "legal",
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     {renderTextArea('legalClearance', 'Legal Clearance', 'e.g. Clear Title, NOC Approved')}
//                                     {renderTextArea('legalStatuses', 'Legal Statuses', 'e.g. RERA Registered, No Litigation')}
//                                     {renderTextArea('propertyTaxClasses', 'Property Tax Classes', 'e.g. Residential Property Tax, Low Tax Zone')}
//                                 </div>
//                             )}

//                             {/* Financial Options */}
//                             {renderSection("Financial Options", "financial",
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     {renderTextArea('loanApprovalStatus', 'Loan Approval Status', 'e.g. SBI Approved, HDFC Approved')}
//                                     {renderTextArea('financingOptions', 'Financing Options', 'e.g. Home Loan Available, Easy EMI Options')}
//                                     {renderTextArea('investmentStrategies', 'Investment Strategies', 'e.g. Capital Appreciation, Rental Income')}
//                                 </div>
//                             )}

//                             {/* Environmental & Services */}
//                             {renderSection("Environmental & Services", "environmental",
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     {renderTextArea('environmentalFactors', 'Environmental Factors', 'e.g. Green Building, Eco Friendly')}
//                                     {renderTextArea('environmentalCertifications', 'Environmental Certifications', 'e.g. Green Building Certified, LEED Certified')}
//                                     {renderTextArea('propertyManagementServices', 'Property Management Services', 'e.g. 24/7 Maintenance, Security Services')}
//                                 </div>
//                             )}

//                             <button
//                                 type="submit"
//                                 className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium rounded-md shadow-md transition-colors flex items-center justify-center space-x-2"
//                             >
//                                 <Link className="w-5 h-5" />
//                                 <span>Generate Enhanced Deeplink</span>
//                             </button>
//                         </form>
//                     </div>
//                 </div>

//                 {/* Result Section */}
//                 <div className="lg:col-span-1">
//                     <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
//                         <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-4 px-6">
//                             <h3 className="text-lg font-semibold text-white">Generated Deeplink</h3>
//                         </div>

//                         <div className="p-6 h-full flex flex-col">
//                             {generatedDeeplink ? (
//                                 <>
//                                     <div className="p-4 bg-gray-50 border border-gray-200 rounded-md mb-4 break-all flex-grow overflow-y-auto max-h-64">
//                                         <p className="text-gray-800 text-sm font-mono">{generatedDeeplink}</p>
//                                     </div>

//                                     <button
//                                         onClick={copyToClipboard}
//                                         className={`w-full py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2 ${copied
//                                             ? 'bg-green-500 text-white'
//                                             : 'bg-indigo-500 hover:bg-indigo-600 text-white'
//                                             }`}
//                                     >
//                                         {copied ? (
//                                             <>
//                                                 <CheckCircle className="w-5 h-5" />
//                                                 <span>Copied!</span>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <Copy className="w-5 h-5" />
//                                                 <span>Copy Deeplink</span>
//                                             </>
//                                         )}
//                                     </button>

//                                     <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
//                                         <h4 className="text-sm font-semibold text-gray-700 mb-3">Enhanced Features</h4>
//                                         <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
//                                             <li>All property schema fields supported</li>
//                                             <li>Multi-value parameters (arrays)</li>
//                                             <li>Location-based filtering with radius</li>
//                                             <li>Comprehensive amenities & features</li>
//                                             <li>Legal & financial parameters</li>
//                                             <li>Environmental & certification filters</li>
//                                         </ul>
//                                     </div>

//                                     <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
//                                         <h4 className="text-sm font-semibold text-gray-700 mb-3">Testing Instructions</h4>
//                                         <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
//                                             <li>Copy the generated deeplink</li>
//                                             <li>Test in both web browser and mobile app</li>
//                                             <li>Verify all filters are applied correctly</li>
//                                             <li>Check array parameters are parsed properly</li>
//                                             <li>Validate location and radius on map</li>
//                                             <li>Confirm search results match criteria</li>
//                                         </ol>
//                                     </div>

//                                     {/* Parameter Summary */}
//                                     <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
//                                         <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Parameters</h4>
//                                         <div className="text-xs text-gray-600 space-y-1">
//                                             {Object.entries(formValues).map(([key, value]) => {
//                                                 if (value && key !== 'urlType') {
//                                                     return (
//                                                         <div key={key} className="flex justify-between">
//                                                             <span className="font-medium">{key}:</span>
//                                                             <span className="text-right max-w-32 truncate">{value}</span>
//                                                         </div>
//                                                     );
//                                                 }
//                                                 return null;
//                                             })}
//                                         </div>
//                                     </div>
//                                 </>
//                             ) : (
//                                 <div className="flex flex-col items-center justify-center py-12 px-4 flex-grow">
//                                     <div className="bg-gray-50 rounded-full p-6 mb-4">
//                                         <Link className="w-12 h-12 text-indigo-400" />
//                                     </div>
//                                     <p className="text-center text-gray-500 mb-6">Configure your property filters using the comprehensive form to generate an enhanced deeplink.</p>
//                                     <div className="text-sm text-gray-400 text-center space-y-2">
//                                         <p>✨ Supports all property schema fields</p>
//                                         <p>🗺️ Interactive map for location selection</p>
//                                         <p>🔧 Advanced filtering capabilities</p>
//                                         <p>📱 Both web and app URL generation</p>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DeeplinkGenerator;


import React, { useState } from 'react';
import { Copy, CheckCircle, Link, MapPin, Map, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { Select, Space, Tag } from 'antd';
import LocationMapSelector from '../../components/Deeplink/LocationMapSelector';



const { Option } = Select;

const base_url = "https://www.profospace.in";
const app_scheme = "profo";

const DeeplinkGenerator = () => {
    // Form state with all property fields
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
        amenities: [],
        construction_status: '',
        possession: '',
        vastuCompliance: [],
        loanApprovalStatus: [],
        builderReputation: '',
        broker_status: '',
        facilities: [],
        location_advantage: [],
        overlookingAmenities: [],
        transactionType: '',
        propertyOwnership: '',
        flooring: '',
        parking: '',
        gatedCommunity: '',
        waterSource: [],
        powerBackup: '',
        petFriendly: '',
        religiousNearby: [],
        inProximity: [],
        propertyAge: '',
        propertyTypes: [],
        propertyFeatures: [],
        viewTypes: [],
        legalClearance: [],
        propertyConditions: [],
        legalStatuses: [],
        environmentalFactors: [],
        kitchenType: '',
        bathroomFeatures: [],
        specialCategories: [],
        flooringType: [],
        socialInfrastructure: [],
        constructionStatuses: [],
        ownershipTypes: [],
        financingOptions: [],
        propertyTaxClasses: [],
        environmentalCertifications: [],
        propertyManagementServices: [],
        investmentStrategies: [],
        urlType: 'web'
    });

    // State for the generated deeplink
    const [generatedDeeplink, setGeneratedDeeplink] = useState('');

    // State for copy feedback
    const [copied, setCopied] = useState(false);

    // State for map visibility
    const [showMap, setShowMap] = useState(true);

    // State for section visibility
    const [expandedSections, setExpandedSections] = useState({
        basic: true,
        location: true,
        property: false,
        amenities: false,
        legal: false,
        financial: false,
        environmental: false
    });

    // Field options for dropdowns and multi-select
    // const fieldOptions = {
    //     purpose: ['sale', 'rent', 'buy'],
    //     property_type: ['Apartment', 'House', 'Villa', 'Office', 'Shop', 'Warehouse', 'Factory', 'Plot', 'Room'],
    //     construction_status: ['Under Construction', 'Ready to Move', 'New Launch', 'Nearing Completion', 'Foundation Laid', 'Structure Complete'],
    //     possession: ['Immediate', 'Within 3 Months', 'Within 6 Months', 'Within 1 Year', 'Within 2 Years', 'Ready'],
    //     vastuCompliance: ['East Facing', 'Proper Ventilation', 'Main Door Direction', 'North East Water Source', 'South West Heavy Items', 'Kitchen in South East'],
    //     loanApprovalStatus: ['SBI Approved', 'HDFC Approved', 'ICICI Approved', 'Axis Bank Approved', 'Pre-approved by Major Banks', '90% Loan Available'],
    //     builderReputation: ['Premium Builder', 'Trusted Developer', 'Award Winning', 'ISO Certified', 'Established Builder', 'Quality Constructor'],
    //     broker_status: ['Owner Direct', 'Authorized Dealer', 'Exclusive Agent', 'Builder Direct', 'Channel Partner', 'Verified Broker'],
    //     facilities: ['24/7 Security', 'CCTV Surveillance', 'Power Backup', 'Water Supply', 'Elevator', 'Parking', 'Club House', 'Swimming Pool', 'Gym', 'Garden'],
    //     location_advantage: ['Near Metro Station', 'IT Hub Proximity', 'Airport Connectivity', 'Shopping Mall Nearby', 'School Zone', 'Hospital Area', 'Business District'],
    //     overlookingAmenities: ['Garden View', 'Pool View', 'Club House View', 'Park View', 'City View', 'Road View', 'Greenery View'],
    //     transactionType: ['New Booking', 'Resale', 'Rental', 'Lease', 'Investment', 'End Use'],
    //     propertyOwnership: ['Freehold', 'Leasehold', 'Cooperative Society', 'Power of Attorney', 'Clear Title', 'Society Ownership'],
    //     flooring: ['Marble', 'Granite', 'Vitrified Tiles', 'Ceramic Tiles', 'Wooden Flooring', 'Italian Marble'],
    //     parking: ['Covered Parking', 'Open Parking', 'Stilt Parking', 'Basement Parking', 'Multi Level Parking', 'Reserved Parking'],
    //     gatedCommunity: ['Yes', 'No'],
    //     waterSource: ['Corporation Water', 'Bore Well', 'Water Tanker', 'Treated Water', 'RO System', 'Municipal Supply', 'Rainwater Harvesting'],
    //     powerBackup: ['100% Power Backup', 'DG Backup', 'Solar Power', 'UPS System', 'Generator Backup', 'Inverter Backup'],
    //     petFriendly: ['Yes', 'No'],
    //     religiousNearby: ['Hanuman Temple', 'Shiv Temple', 'Krishna Temple', 'Gurudwara', 'Church', 'Mosque'],
    //     inProximity: ['Metro Station 2km', 'Airport 15km', 'Shopping Mall 1km', 'Hospital 2km', 'School 500m', 'IT Park 3km'],
    //     propertyTypes: ['Apartment', 'Villa', 'Independent House', 'Duplex', 'Penthouse', 'Studio', 'Row House'],
    //     propertyFeatures: ['Spacious Rooms', 'Modern Kitchen', 'Attached Bathroom', 'Balcony', 'Terrace', 'Garden Area', 'Servant Room'],
    //     viewTypes: ['City View', 'Garden View', 'Pool View', 'Park View', 'River View', 'Hill View', 'Road View'],
    //     legalClearance: ['Clear Title', 'NOC Approved', 'Bank Approved', 'Municipality Approved', 'RERA Approved', 'Legal Verification Done'],
    //     propertyConditions: ['Brand New', 'Excellent Condition', 'Well Maintained', 'Good Condition', 'Recently Renovated', 'Furnished'],
    //     legalStatuses: ['Clear Title', 'Registered Property', 'Freehold', 'Leasehold', 'RERA Registered', 'No Litigation'],
    //     environmentalFactors: ['Green Building', 'Eco Friendly', 'Energy Efficient', 'Rainwater Harvesting', 'Solar Power', 'Pollution Free'],
    //     kitchenType: ['Modular Kitchen', 'Open Kitchen', 'Closed Kitchen', 'L-Shaped Kitchen', 'U-Shaped Kitchen', 'Island Kitchen'],
    //     bathroomFeatures: ['Attached Bathroom', 'Western Toilet', 'Modern Fixtures', 'Hot Water', 'Shower Cubicle', 'Bathtub'],
    //     specialCategories: ['Luxury Property', 'Premium Segment', 'Affordable Housing', 'Investment Property', 'NRI Friendly', 'Pet Friendly'],
    //     flooringType: ['Marble Flooring', 'Granite Flooring', 'Vitrified Tiles', 'Ceramic Tiles', 'Wooden Flooring', 'Italian Marble'],
    //     socialInfrastructure: ['School Nearby', 'Hospital Available', 'Shopping Complex', 'Bank & ATM', 'Transportation Hub', 'Entertainment Zone'],
    //     constructionStatuses: ['Completed', 'Under Construction', 'About to Launch', 'Foundation Stage', 'Structure Complete', 'Ready for Possession'],
    //     ownershipTypes: ['Individual', 'Joint Ownership', 'Company Owned', 'Society Property', 'Cooperative Housing', 'Trust Property'],
    //     financingOptions: ['Home Loan Available', 'Easy EMI Options', 'Zero Down Payment', 'Flexible Payment', 'Government Subsidy', 'Bank Tie-up'],
    //     propertyTaxClasses: ['Residential Property Tax', 'Commercial Property Tax', 'Low Tax Zone', 'Standard Tax', 'Municipal Tax'],
    //     environmentalCertifications: ['Green Building Certified', 'LEED Certified', 'Energy Star', 'Eco Friendly Certificate', 'Solar Certified'],
    //     propertyManagementServices: ['24/7 Maintenance', 'Security Services', 'Housekeeping', 'Facility Management', 'Property Care'],
    //     investmentStrategies: ['Capital Appreciation', 'Rental Income', 'Long Term Investment', 'Tax Benefits', 'Wealth Creation', 'Value Investment'],
    //     amenities: ['Swimming Pool', 'Gym', 'Playground', 'Garden', 'Parking', 'Lift', 'Security', 'Power Backup', 'Water Supply', 'CCTV', 'Club House', 'Community Hall', 'Jogging Track', 'Children Play Area', 'Senior Citizen Area', 'Sports Facility', 'Library', 'Meditation Center', 'Yoga Room', 'Spa', 'Salon', 'ATM', 'Shopping Center', 'Restaurant', 'Laundry', 'Housekeeping', 'Medical Center', 'Pharmacy', 'Fire Safety', 'Earthquake Resistant', 'Rainwater Harvesting', 'Solar Power', 'Waste Management', 'Wi-Fi', 'Cable TV', 'Internet', 'Intercom']
    // };

    const fieldOptions = {
        purpose: ['sale', 'rent', 'buy'],
        property_type: ['Apartment', 'House', 'Villa', 'Office', 'Shop', 'Warehouse', 'Factory', 'Plot', 'Room'],
        construction_status: ['Under Construction', 'Ready to Move', 'New Launch', 'Nearing Completion', 'Foundation Laid', 'Structure Complete', 'Finishing Work', 'Final Stage'],
        possession: ['Immediate', 'Within 3 Months', 'Within 6 Months', 'Within 1 Year', 'Within 2 Years', 'Within 3 Years', 'Ready', 'Under Construction'],
        vastuCompliance: ['East Facing', 'Proper Ventilation', 'Main Door Direction', 'North East Water Source', 'South West Heavy Items', 'Kitchen in South East', 'Master Bedroom in South West', 'Prayer Room in North East', 'Staircase in South', 'Balcony in North/East', 'Toilet in West/South', 'Main Entrance Vastu', 'Room Positioning', 'Natural Light', 'Cross Ventilation', 'Positive Energy Flow', 'Vastu Certified', 'Traditional Layout', 'Modern Vastu'],
        loanApprovalStatus: ['Bank Approved Project', 'Pre-Approved Loans', 'Government Subsidy Eligible', 'PMAY Eligible', 'Home Loan Available', 'No Loan Available'],
        builderReputation: ['Premium Builder', 'Trusted Developer', 'Award Winning', 'ISO Certified', 'Established Builder', 'Quality Constructor', 'Reputed Developer', 'Experienced Builder', 'Reliable Developer', 'Top Rated'],
        broker_status: ['Owner Direct', 'Authorized Dealer', 'Exclusive Agent', 'Builder Direct', 'Channel Partner', 'Verified Broker', 'Direct Sale', 'Authorized Channel', 'Premier Partner', 'Certified Agent'],
        facilities: ['24/7 Security', 'CCTV Surveillance', 'Intercom', 'Fire Safety', 'Power Backup', 'Water Supply', 'Sewage Treatment', 'Waste Management', 'Elevator', 'Parking', 'Visitor Parking', 'Maintenance', 'Club House', 'Swimming Pool', 'Gym', 'Garden', 'Community Hall', 'Children Play Area', 'Jogging Track', 'Shopping Area', 'ATM', 'Medical Center', 'School Nearby', 'Transport Connectivity', 'Market Access', 'Hospital Nearby', 'Recreation Facilities', 'Sports Complex', 'Entertainment'],
        location_advantage: ['Near Metro Station', 'IT Hub Proximity', 'Airport Connectivity', 'Shopping Mall Nearby', 'School Zone', 'Hospital Area', 'Business District', 'Commercial Hub', 'Industrial Area', 'Green Belt', 'River Front', 'Hill View', 'City Center', 'Developing Area', 'Prime Location', 'Transport Hub', 'Educational Hub', 'Medical Hub', 'Entertainment Zone', 'Cultural Center', 'Government Area', 'Peaceful Locality', 'Posh Area', 'Investment Zone'],
        overlookingAmenities: ['Garden View', 'Pool View', 'Club House View', 'Park View', 'City View', 'Road View', 'Greenery View', 'Open Space', 'Playground View', 'Temple View', 'Market View', 'School View', 'Hill View', 'River View', 'Lake View', 'Community Area', 'Sports Complex', 'Shopping Area'],
        transactionType: ['New Booking', 'Resale', 'Rental', 'Lease', 'Investment', 'End Use', 'Commercial Use', 'Residential Use'],
        propertyOwnership: ['Freehold', 'Leasehold', 'Cooperative Society', 'Power of Attorney', 'Agreement to Sell', 'Registered Sale Deed', 'Clear Title', 'Society Ownership', 'Individual Ownership', 'Joint Ownership'],
        flooring: ['Marble', 'Granite', 'Vitrified Tiles', 'Ceramic Tiles', 'Wooden Flooring', 'Italian Marble', 'Stone Flooring', 'Polished Concrete', 'Laminated Flooring', 'Designer Tiles'],
        parking: ['Covered Parking', 'Open Parking', 'Stilt Parking', 'Basement Parking', 'Multi Level Parking', 'Mechanical Parking', 'Valet Parking', 'Reserved Parking', 'Visitor Parking', 'Two Wheeler Parking'],
        gatedCommunity: ['Yes', 'No'],
        waterSource: ['Corporation Water', 'Bore Well', 'Water Tanker', 'Treated Water', 'RO System', 'Water Storage', 'Ground Water', 'Packaged Water', 'Filtered Water', 'Municipal Supply', 'Private Tanker', 'Community Well', 'Rainwater Harvesting', '24x7 Water Supply', 'Overhead Tank', 'Underground Tank', 'Dual Water Supply', 'Emergency Backup'],
        powerBackup: ['100% Power Backup', 'DG Backup', 'Solar Power', 'UPS System', 'Generator Backup', 'Inverter Backup', 'No Power Cut', 'Emergency Backup', 'Common Area Backup', 'Full Backup'],
        petFriendly: ['Yes', 'No'],
        religiousNearby: ['Near Temple', 'Near Church', 'Near Mosque', 'Near Gurudwara', 'Pilgrimage Society Proximity'],
        inProximity: ['Airport', 'Near Office Hub', 'Hospital Vicinity', 'Railway Station', 'Metro Station', 'Market Area', 'Near School', 'Near College', 'Shopping Mall', 'Highway Access', 'Cinema Hall', 'Restaurant', 'Pharmacy', 'Post Office', 'IT Park', 'University'],
        propertyTypes: ['Apartment', 'Villa', 'Independent House', 'Duplex', 'Penthouse', 'Studio', 'Row House', 'Townhouse', 'Farmhouse', 'Flat', 'Bungalow', 'Cottage', 'Mansion', 'Luxury Home', 'Premium Apartment', 'Budget Home', 'Affordable Housing', 'Mid-Range'],
        propertyFeatures: ['Spacious Rooms', 'Modern Kitchen', 'Attached Bathroom', 'Balcony', 'Terrace', 'Garden Area', 'Servant Room', 'Study Room', 'Pooja Room', 'Walk-in Closet', 'Storage Room', 'Utility Area', 'Designer Interiors', 'False Ceiling', 'Modern Fixtures', 'Smart Home Features', 'High Ceilings', 'Large Windows'],
        viewTypes: ['City View', 'Garden View', 'Pool View', 'Park View', 'River View', 'Hill View', 'Road View', 'Courtyard View', 'Greenery View', 'Skyline View', 'Open View', 'Panoramic View', 'Street View', 'Complex View', 'Nature View', 'Temple View', 'Market View', 'Peaceful View'],
        legalClearance: ['Clear Title', 'NOC Approved', 'Bank Approved', 'Municipality Approved', 'Fire NOC', 'Environmental Clearance', 'RERA Approved', 'Completion Certificate', 'Occupancy Certificate', 'Building Plan Approved', 'Legal Verification Done', 'Document Verified', 'Title Clear', 'No Legal Issues'],
        propertyConditions: ['Brand New', 'Excellent Condition', 'Well Maintained', 'Good Condition', 'Needs Minor Repair', 'Recently Renovated', 'Furnished', 'Semi Furnished', 'Unfurnished', 'Move-in Ready', 'Under Renovation', 'Basic Condition', 'Luxury Finish', 'Standard Finish', 'Premium Condition'],
        legalStatuses: ['Clear Title', 'Registered Property', 'Freehold', 'Leasehold', 'Society Property', 'Cooperative Housing', 'Individual Ownership', 'Joint Ownership', 'Company Owned', 'Trust Property', 'Government Approved', 'Municipal Approved', 'RERA Registered', 'Legal Verification Done', 'No Litigation'],
        environmentalFactors: ['Green Building', 'Eco Friendly', 'Energy Efficient', 'Rainwater Harvesting', 'Solar Power', 'Waste Management', 'Pollution Free', 'Green Area', 'Fresh Air', 'No Industrial Pollution', 'Clean Environment', 'Healthy Living', 'Sustainable Design', 'Low Carbon Footprint', 'Natural Ventilation', 'Organic Waste Management', 'Water Conservation', 'Green Certification'],
        kitchenType: ['Modular Kitchen', 'Open Kitchen', 'Closed Kitchen', 'L-Shaped Kitchen', 'U-Shaped Kitchen', 'Straight Kitchen', 'Island Kitchen', 'Galley Kitchen', 'Traditional Kitchen', 'Modern Kitchen', 'Designer Kitchen', 'Compact Kitchen', 'Spacious Kitchen', 'Well Ventilated', 'Storage Rich'],
        bathroomFeatures: ['Attached Bathroom', 'Western Toilet', 'Indian Toilet', 'Modern Fixtures', 'Hot Water', 'Geyser', 'Shower Cubicle', 'Bathtub', 'Vanity', 'Exhaust Fan', 'Window', 'Storage', 'Designer Tiles', 'Granite Counter', 'Modern Fittings', 'Separate Dry Area', 'Good Ventilation', 'Premium Sanitary'],
        specialCategories: ['Luxury Property', 'Premium Segment', 'Affordable Housing', 'Investment Property', 'End User', 'NRI Friendly', 'Senior Citizen Friendly', 'Specially Abled Friendly', 'Pet Friendly', 'Family Property', 'Bachelor Friendly', 'Corporate Booking', 'Bulk Booking', 'Group Housing', 'Woman Friendly', 'Student Housing', 'Executive Housing'],
        flooringType: ['Marble Flooring', 'Granite Flooring', 'Vitrified Tiles', 'Ceramic Tiles', 'Wooden Flooring', 'Laminated', 'Italian Marble', 'Designer Tiles', 'Stone Flooring', 'Polished Concrete', 'Mosaic Flooring', 'Terrazzo', 'Vinyl Flooring', 'Rubber Flooring', 'Epoxy Flooring'],
        socialInfrastructure: ['School Nearby', 'Hospital Available', 'Shopping Complex', 'Bank & ATM', 'Transportation Hub', 'Entertainment Zone', 'Sports Facilities', 'Cultural Center', 'Community Hall', 'Library', 'Post Office', 'Police Station', 'Fire Station', 'Market Area', 'Restaurant Zone', 'Cinema Hall', 'Park & Recreation', 'Religious Places'],
        constructionStatuses: ['Completed', 'Under Construction', 'About to Launch', 'Foundation Stage', 'Structure Complete', 'Finishing Work', 'Final Stage', 'Ready for Possession', 'Handover Stage', 'Interior Work', 'External Work', 'Landscaping', 'Quality Check', 'Final Inspection', 'Document Preparation'],
        ownershipTypes: ['Individual', 'Joint Ownership', 'Company Owned', 'Society Property', 'Cooperative Housing', 'Trust Property', 'Partnership Property', 'Family Property', 'Inherited', 'Investment Property', 'Self Owned', 'Registered Property', 'Freehold Property', 'Leasehold Property', 'Government Property'],
        financingOptions: ['Home Loan Available', 'Easy EMI Options', 'Zero Down Payment', 'Flexible Payment', 'Construction Linked', 'Possession Linked', 'Subvention Scheme', 'No Pre-EMI', 'Interest Free Period', 'Government Subsidy', 'Bank Tie-up', 'In-house Financing', 'NRI Financing', 'Quick Loan Approval', 'Multiple Bank Options'],
        propertyTaxClasses: ['Residential Property Tax', 'Commercial Property Tax', 'Mixed Use Tax', 'Agricultural Tax', 'Industrial Tax', 'Institutional Tax', 'Low Tax Zone', 'Standard Tax', 'Premium Tax', 'Tax Exemption', 'Reduced Tax Rate', 'Special Category Tax', 'Municipal Tax', 'Corporation Tax', 'Development Tax'],
        environmentalCertifications: ['Green Building Certified', 'LEED Certified', 'Energy Star', 'Eco Friendly Certificate', 'Sustainable Building', 'Carbon Neutral', 'Solar Certified', 'Water Efficient', 'Waste Management Certified', 'Pollution Control Certified', 'Environmental Impact Assessment', 'Green Rating', 'Sustainable Design Certificate', 'Energy Efficient Building'],
        propertyManagementServices: ['24/7 Maintenance', 'Security Services', 'Housekeeping', 'Facility Management', 'Property Care', 'Maintenance Contract', 'Caretaker Service', 'Emergency Service', 'Repair & Maintenance', 'Cleaning Service', 'Garden Maintenance', 'Equipment Maintenance', 'Property Insurance', 'Rental Management', 'Professional Management', 'Full Service Management', 'Partial Management', 'On-call Service'],
        investmentStrategies: ['Capital Appreciation', 'Rental Income', 'Long Term Investment', 'Short Term Gains', 'Portfolio Diversification', 'Risk Mitigation', 'Tax Benefits', 'Hedge Against Inflation', 'Retirement Planning', 'Wealth Creation', 'Asset Building', 'Income Generation', 'Value Investment', 'Growth Investment', 'Conservative Investment', 'Aggressive Investment', 'Balanced Portfolio', 'Strategic Investment'],
        amenities: ['Swimming Pool', 'Gym', 'Club House', 'Children Play Area', 'Security', 'Power Backup', 'Elevator', 'Parking', 'Garden', 'Jogging Track', 'Yoga Area', 'Community Hall', 'Shopping Complex', 'Medical Center', 'Sports Complex', 'Library', 'Cafeteria', 'Banquet Hall', 'Temple', 'Car Washing', 'Visitor Parking', 'Intercom', 'CCTV', 'Fire Safety', 'Waste Management', 'Rainwater Harvesting', 'Senior Citizen Area', 'Multipurpose Court', 'Amphitheater', 'Business Center', 'Wi-Fi', 'Maintenance Office', 'Pet Area', 'Cycling Track', 'Meditation Center', 'Playground', 'Lift', 'Water Supply', 'Cable TV', 'Internet', 'Laundry', 'Restaurant', 'Salon', 'Spa', 'ATM', 'Shopping Center', 'Pharmacy', 'Earthquake Resistant']
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleSelectChange = (name, value) => {
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

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const params = new URLSearchParams();

        Object.entries(formValues).forEach(([key, value]) => {
            if (value && key !== 'urlType') {
                if (Array.isArray(value) && value.length > 0) {
                    // Handle array values
                    value.forEach((item, index) => {
                        params.append(`${key}[${index}]`, item);
                    });
                } else if (value && !Array.isArray(value)) {
                    params.append(key, value);
                }
            }
        });

        let deeplink;
        if (formValues.urlType === 'app') {
            deeplink = `${app_scheme}://filter?${params.toString()}`;
        } else {
            deeplink = `${base_url}/filter?${params.toString()}`;
        }

        setGeneratedDeeplink(deeplink);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedDeeplink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        }
    };

    const renderSection = (title, sectionKey, children) => (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
                type="button"
                onClick={() => toggleSection(sectionKey)}
                className="w-full flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200 hover:bg-gray-100 focus:outline-none"
            >
                <h3 className="text-md font-medium text-gray-700">{title}</h3>
                {expandedSections[sectionKey] ?
                    <ChevronUp className="h-4 w-4 text-gray-500" /> :
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                }
            </button>
            {expandedSections[sectionKey] && (
                <div className="p-4">
                    {children}
                </div>
            )}
        </div>
    );

    const renderSelectField = (name, label, options, placeholder = `Select ${label}`) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <Select
                id={name}
                value={formValues[name] || undefined}
                onChange={(value) => handleSelectChange(name, value)}
                placeholder={placeholder}
                className="w-full"
                size="large"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {options.map(option => (
                    <Option key={option} value={option}>{option}</Option>
                ))}
            </Select>
        </div>
    );

    const renderMultiSelectField = (name, label, options, placeholder = `Select ${label}`) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <Select
                id={name}
                mode="multiple"
                value={formValues[name] || []}
                onChange={(value) => handleSelectChange(name, value)}
                placeholder={placeholder}
                className="w-full"
                size="large"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                tagRender={(props) => {
                    const { label, closable, onClose } = props;
                    return (
                        <Tag
                            color="blue"
                            closable={closable}
                            onClose={onClose}
                            style={{ marginRight: 3 }}
                        >
                            {label}
                        </Tag>
                    );
                }}
            >
                {options.map(option => (
                    <Option key={option} value={option}>{option}</Option>
                ))}
            </Select>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="flex flex-col gap-8">
                {/* Form Section */}
                <div className="">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-6 px-8">
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <Sliders className="mr-3 h-6 w-6" />
                                Property Filter Configuration
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            {/* URL Type */}
                            <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
                                <label className="block text-lg font-medium text-gray-700 mb-4">
                                    URL Type Selection
                                </label>
                                <div className="flex space-x-8">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="urlType"
                                            value="web"
                                            checked={formValues.urlType === 'web'}
                                            onChange={handleInputChange}
                                            className="form-radio h-5 w-5 text-indigo-600"
                                        />
                                        <span className="ml-3 text-gray-700 font-medium">Web URL (https://)</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="urlType"
                                            value="app"
                                            checked={formValues.urlType === 'app'}
                                            onChange={handleInputChange}
                                            className="form-radio h-5 w-5 text-indigo-600"
                                        />
                                        <span className="ml-3 text-gray-700 font-medium">App URL (profo://)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Basic Property Details */}
                            {renderSection("Basic Property Details", "basic",
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {renderSelectField('purpose', 'Purpose', fieldOptions.purpose)}
                                    {renderSelectField('property_type', 'Property Type', fieldOptions.property_type)}
                                    <div>
                                        <label htmlFor="min_price" className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Price (₹)
                                        </label>
                                        <input
                                            type="number"
                                            id="min_price"
                                            name="min_price"
                                            value={formValues.min_price}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Minimum price"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="max_price" className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Price (₹)
                                        </label>
                                        <input
                                            type="number"
                                            id="max_price"
                                            name="max_price"
                                            value={formValues.max_price}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Maximum price"
                                        />
                                    </div>
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
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Number of bedrooms"
                                        />
                                    </div>
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
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Number of bathrooms"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="propertyAge" className="block text-sm font-medium text-gray-700 mb-1">
                                            Property Age (years)
                                        </label>
                                        <input
                                            type="number"
                                            id="propertyAge"
                                            name="propertyAge"
                                            value={formValues.propertyAge}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Age in years"
                                        />
                                    </div>
                                    {renderSelectField('gatedCommunity', 'Gated Community', fieldOptions.gatedCommunity)}
                                    {renderSelectField('petFriendly', 'Pet Friendly', fieldOptions.petFriendly)}
                                </div>
                            )}

                            {/* Location Parameters */}
                            {renderSection("Location Parameters", "location",
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="text-lg font-medium text-gray-700 flex items-center">
                                            <MapPin className="mr-2 h-5 w-5 text-indigo-500" />
                                            Interactive Map Selection
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={() => setShowMap(!showMap)}
                                            className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus:outline-none flex items-center transition-colors"
                                        >
                                            <Map className="mr-2 h-4 w-4" />
                                            {showMap ? 'Hide Map' : 'Show Map'}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
                                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
                                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                        {renderMultiSelectField('location_advantage', 'Location Advantages', fieldOptions.location_advantage)}
                                        {renderMultiSelectField('inProximity', 'In Proximity', fieldOptions.inProximity)}
                                        {renderMultiSelectField('religiousNearby', 'Religious Places Nearby', fieldOptions.religiousNearby)}
                                    </div>
                                </>
                            )}

                            {/* Property Features & Amenities */}
                            {renderSection("Property Features & Amenities", "amenities",
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {renderSelectField('construction_status', 'Construction Status', fieldOptions.construction_status)}
                                        {renderSelectField('possession', 'Possession', fieldOptions.possession)}
                                        {renderSelectField('flooring', 'Flooring', fieldOptions.flooring)}
                                        {renderSelectField('parking', 'Parking', fieldOptions.parking)}
                                        {renderSelectField('powerBackup', 'Power Backup', fieldOptions.powerBackup)}
                                        {renderSelectField('kitchenType', 'Kitchen Type', fieldOptions.kitchenType)}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {renderMultiSelectField('amenities', 'Amenities', fieldOptions.amenities)}
                                        {renderMultiSelectField('facilities', 'Facilities', fieldOptions.facilities)}
                                        {renderMultiSelectField('waterSource', 'Water Source', fieldOptions.waterSource)}
                                        {renderMultiSelectField('vastuCompliance', 'Vastu Compliance', fieldOptions.vastuCompliance)}
                                        {renderMultiSelectField('overlookingAmenities', 'Overlooking Amenities', fieldOptions.overlookingAmenities)}
                                        {renderMultiSelectField('propertyFeatures', 'Property Features', fieldOptions.propertyFeatures)}
                                        {renderMultiSelectField('viewTypes', 'View Types', fieldOptions.viewTypes)}
                                        {renderMultiSelectField('bathroomFeatures', 'Bathroom Features', fieldOptions.bathroomFeatures)}
                                        {renderMultiSelectField('socialInfrastructure', 'Social Infrastructure', fieldOptions.socialInfrastructure)}
                                    </div>
                                </div>
                            )}

                            {/* Property Classification */}
                            {renderSection("Property Classification", "property",
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {renderSelectField('transactionType', 'Transaction Type', fieldOptions.transactionType)}
                                    {renderSelectField('propertyOwnership', 'Property Ownership', fieldOptions.propertyOwnership)}
                                    {renderSelectField('builderReputation', 'Builder Reputation', fieldOptions.builderReputation)}
                                    {renderSelectField('broker_status', 'Broker Status', fieldOptions.broker_status)}
                                    {renderMultiSelectField('propertyTypes', 'Property Types', fieldOptions.propertyTypes)}
                                    {renderMultiSelectField('specialCategories', 'Special Categories', fieldOptions.specialCategories)}
                                    {renderMultiSelectField('flooringType', 'Flooring Type', fieldOptions.flooringType)}
                                    {renderMultiSelectField('constructionStatuses', 'Construction Statuses', fieldOptions.constructionStatuses)}
                                    {renderMultiSelectField('ownershipTypes', 'Ownership Types', fieldOptions.ownershipTypes)}
                                    {renderMultiSelectField('propertyConditions', 'Property Conditions', fieldOptions.propertyConditions)}
                                </div>
                            )}

                            {/* Legal & Documentation */}
                            {renderSection("Legal & Documentation", "legal",
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {renderMultiSelectField('legalClearance', 'Legal Clearance', fieldOptions.legalClearance)}
                                    {renderMultiSelectField('legalStatuses', 'Legal Statuses', fieldOptions.legalStatuses)}
                                    {renderMultiSelectField('propertyTaxClasses', 'Property Tax Classes', fieldOptions.propertyTaxClasses)}
                                </div>
                            )}

                            {/* Financial Options */}
                            {renderSection("Financial Options", "financial",
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {renderMultiSelectField('loanApprovalStatus', 'Loan Approval Status', fieldOptions.loanApprovalStatus)}
                                    {renderMultiSelectField('financingOptions', 'Financing Options', fieldOptions.financingOptions)}
                                    {renderMultiSelectField('investmentStrategies', 'Investment Strategies', fieldOptions.investmentStrategies)}
                                </div>
                            )}

                            {/* Environmental & Services */}
                            {renderSection("Environmental & Services", "environmental",
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {renderMultiSelectField('environmentalFactors', 'Environmental Factors', fieldOptions.environmentalFactors)}
                                    {renderMultiSelectField('environmentalCertifications', 'Environmental Certifications', fieldOptions.environmentalCertifications)}
                                    {renderMultiSelectField('propertyManagementServices', 'Property Management Services', fieldOptions.propertyManagementServices)}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-4 px-8 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-3 text-lg"
                            >
                                <Link className="w-6 h-6" />
                                <span>Generate Enhanced Deeplink</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Result Section */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-6 px-8">
                            <h3 className="text-xl font-semibold text-white">Generated Deeplink</h3>
                        </div>

                        <div className="p-8 h-full flex flex-col">
                            {generatedDeeplink ? (
                                <>
                                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6 break-all flex-grow overflow-y-auto max-h-64">
                                        <p className="text-gray-800 text-sm font-mono leading-relaxed">{generatedDeeplink}</p>
                                    </div>

                                    <button
                                        onClick={copyToClipboard}
                                        className={`w-full py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-lg font-semibold ${copied
                                            ? 'bg-green-500 text-white'
                                            : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-lg'
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
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">✨ Enhanced Features</h4>
                                        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                            <li>Multi-select dropdowns with search</li>
                                            <li>Interactive map location selection</li>
                                            <li>Comprehensive property filters</li>
                                            <li>Array parameter support</li>
                                            <li>Mobile and web URL generation</li>
                                            <li>Advanced amenities & features</li>
                                        </ul>
                                    </div>

                                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">🧪 Testing Guide</h4>
                                        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                                            <li>Copy the generated deeplink</li>
                                            <li>Test in web browser and mobile app</li>
                                            <li>Verify all selected filters apply</li>
                                            <li>Check multi-select parameters</li>
                                            <li>Validate location-based filtering</li>
                                            <li>Confirm search results accuracy</li>
                                        </ol>
                                    </div>

                                    {/* Active Parameters Summary */}
                                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">📋 Active Parameters</h4>
                                        <div className="text-xs text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                                            {Object.entries(formValues).map(([key, value]) => {
                                                if (value && key !== 'urlType') {
                                                    const displayValue = Array.isArray(value)
                                                        ? value.join(', ')
                                                        : value.toString();
                                                    return (
                                                        <div key={key} className="flex justify-between gap-2">
                                                            <span className="font-medium">{key}:</span>
                                                            <span className="text-right max-w-40 truncate">{displayValue}</span>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 px-4 flex-grow">
                                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full p-8 mb-6">
                                        <Link className="w-16 h-16 text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Ready to Generate</h3>
                                    <p className="text-center text-gray-500 mb-6 leading-relaxed">
                                        Configure your property filters using the comprehensive form with multi-select dropdowns
                                        to generate an enhanced deeplink.
                                    </p>
                                    <div className="text-sm text-gray-400 text-center space-y-2">
                                        <p>✨ Multi-select dropdowns with search</p>
                                        <p>🗺️ Interactive map for location selection</p>
                                        <p>🔧 Advanced filtering capabilities</p>
                                        <p>📱 Both web and app URL generation</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeeplinkGenerator;