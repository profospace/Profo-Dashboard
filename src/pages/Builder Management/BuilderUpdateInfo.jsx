// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { base_url } from '../../../utils/base_url';

// const BuilderUpdateInfo = () => {
//     const { builderId } = useParams();

//     // State to manage form data based on the JSON structure
//     const [formData, setFormData] = useState({
//         name: '',
//         username: '',
//         company: '',
//         address: {
//             street: '',
//             city: '',
//             state: '',
//             pincode: ''
//         },
//         contacts: [],
//         website: '',
//         experience: '',
//         status: '',
//         operatingLocations: [],
//         logo: null
//     });

//     // State for form submission and error handling
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(false);

//     // Fetch existing builder data on component mount
//     useEffect(() => {
//         const fetchBuilderData = async () => {
//             try {
//                 const response = await fetch(`${base_url}/builders/${builderId}`);
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch builder information');
//                 }
//                 const data = await response.json();
//                 setFormData({
//                     name: data.name || '',
//                     username: data.username || '',
//                     company: data.company || '',
//                     address: {
//                         street: data.address?.street || '',
//                         city: data.address?.city || '',
//                         state: data.address?.state || '',
//                         pincode: data.address?.pincode || ''
//                     },
//                     contacts: data.contacts || [],
//                     website: data.website || '',
//                     experience: data.experience || '',
//                     status: data.status || '',
//                     operatingLocations: data.operatingLocations || [],
//                     logo: data.logo || null
//                 });
//             } catch (err) {
//                 setError('Failed to fetch builder information');
//                 console.error(err);
//             }
//         };

//         fetchBuilderData();
//     }, [builderId]);

//     // Handle input changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         // Handle nested address fields
//         if (name.startsWith('address.')) {
//             const field = name.split('.')[1];
//             setFormData(prevState => ({
//                 ...prevState,
//                 address: {
//                     ...prevState.address,
//                     [field]: value
//                 }
//             }));
//             return;
//         }

//         // Handle contacts (assuming a single text input for now)
//         if (name === 'contacts') {
//             setFormData(prevState => ({
//                 ...prevState,
//                 contacts: value.split(',').map(contact => contact.trim())
//             }));
//             return;
//         }

//         // Handle operating locations (assuming a single text input)
//         if (name === 'operatingLocations') {
//             const locations = value.split(',').map(loc => {
//                 const [city, state] = loc.trim().split('-').map(part => part.trim());
//                 return { city, state };
//             });
//             setFormData(prevState => ({
//                 ...prevState,
//                 operatingLocations: locations
//             }));
//             return;
//         }

//         // Handle logo file upload
//         if (name === 'logo') {
//             const file = e.target.files[0];
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setFormData(prevState => ({
//                     ...prevState,
//                     logo: reader.result
//                 }));
//             };
//             if (file) {
//                 reader.readAsDataURL(file);
//             }
//             return;
//         }

//         // Default handling for other fields
//         setFormData(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError(null);
//         setSuccess(false);

//         try {
//             const response = await fetch(`${base_url}/builders/${builderId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData)
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'Failed to update builder information');
//             }

//             setSuccess(true);
//             setIsLoading(false);
//         } catch (err) {
//             setError(err.message);
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
//             <div className="relative py-3 sm:max-w-xl sm:mx-auto">
//                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
//                 <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
//                     <div className="max-w-md mx-auto">
//                         <div className="divide-y divide-gray-200">
//                             <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
//                                 <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
//                                     Update Builder Information
//                                 </h2>

//                                 {error && (
//                                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//                                         {error}
//                                     </div>
//                                 )}

//                                 {success && (
//                                     <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
//                                         Builder information updated successfully!
//                                     </div>
//                                 )}

//                                 <form onSubmit={handleSubmit} className="space-y-6">
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <div>
//                                             <label htmlFor="name" className="text-sm font-bold text-gray-600 block">Name</label>
//                                             <input
//                                                 type="text"
//                                                 name="name"
//                                                 value={formData.name}
//                                                 onChange={handleChange}
//                                                 required
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter builder name"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label htmlFor="username" className="text-sm font-bold text-gray-600 block">Username</label>
//                                             <input
//                                                 type="text"
//                                                 name="username"
//                                                 value={formData.username}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter username"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label htmlFor="company" className="text-sm font-bold text-gray-600 block">Company</label>
//                                         <input
//                                             type="text"
//                                             name="company"
//                                             value={formData.company}
//                                             onChange={handleChange}
//                                             className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                             placeholder="Enter company name"
//                                         />
//                                     </div>

//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <div>
//                                             <label htmlFor="address.street" className="text-sm font-bold text-gray-600 block">Street</label>
//                                             <input
//                                                 type="text"
//                                                 name="address.street"
//                                                 value={formData.address.street}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter street address"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label htmlFor="address.city" className="text-sm font-bold text-gray-600 block">City</label>
//                                             <input
//                                                 type="text"
//                                                 name="address.city"
//                                                 value={formData.address.city}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter city"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <div>
//                                             <label htmlFor="address.state" className="text-sm font-bold text-gray-600 block">State</label>
//                                             <input
//                                                 type="text"
//                                                 name="address.state"
//                                                 value={formData.address.state}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter state"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label htmlFor="address.pincode" className="text-sm font-bold text-gray-600 block">Pincode</label>
//                                             <input
//                                                 type="text"
//                                                 name="address.pincode"
//                                                 value={formData.address.pincode}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter pincode"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label htmlFor="contacts" className="text-sm font-bold text-gray-600 block">Contacts (comma-separated)</label>
//                                         <input
//                                             type="text"
//                                             name="contacts"
//                                             value={formData.contacts.join(', ')}
//                                             onChange={handleChange}
//                                             className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                             placeholder="Enter contacts (phone, email)"
//                                         />
//                                     </div>

//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <div>
//                                             <label htmlFor="website" className="text-sm font-bold text-gray-600 block">Website</label>
//                                             <input
//                                                 type="url"
//                                                 name="website"
//                                                 value={formData.website}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter website URL"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label htmlFor="experience" className="text-sm font-bold text-gray-600 block">Years of Experience</label>
//                                             <input
//                                                 type="number"
//                                                 name="experience"
//                                                 value={formData.experience}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter years of experience"
//                                                 min="0"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label htmlFor="operatingLocations" className="text-sm font-bold text-gray-600 block">Operating Locations (city-state, comma-separated)</label>
//                                         <input
//                                             type="text"
//                                             name="operatingLocations"
//                                             value={formData.operatingLocations.map(loc => `${loc.city}-${loc.state}`).join(', ')}
//                                             onChange={handleChange}
//                                             className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                             placeholder="Enter locations (city-state)"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label htmlFor="status" className="text-sm font-bold text-gray-600 block">Status</label>
//                                         <select
//                                             name="status"
//                                             value={formData.status}
//                                             onChange={handleChange}
//                                             className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                         >
//                                             <option value="">Select Status</option>
//                                             <option value="ACTIVE">Active</option>
//                                             <option value="INACTIVE">Inactive</option>
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label htmlFor="logo" className="text-sm font-bold text-gray-600 block">Logo</label>
//                                         <input
//                                             type="file"
//                                             name="logo"
//                                             accept="image/*"
//                                             onChange={handleChange}
//                                             className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                         />
//                                         {formData.logo && (
//                                             <div className="mt-2">
//                                                 <img
//                                                     src={formData.logo}
//                                                     alt="Logo Preview"
//                                                     className="max-w-full h-auto rounded"
//                                                 />
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="pt-4 flex items-center space-x-4">
//                                         <button
//                                             type="submit"
//                                             disabled={isLoading}
//                                             className="bg-cyan-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none hover:bg-cyan-600 transition duration-300 ease-in-out disabled:opacity-50"
//                                         >
//                                             {isLoading ? (
//                                                 <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
//                                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                                 </svg>
//                                             ) : (
//                                                 'Update Builder Information'
//                                             )}
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BuilderUpdateInfo;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { base_url } from '../../../utils/base_url';

// const BuilderUpdateInfo = () => {
//     const { builderId } = useParams();

//     // State to manage form data based on the JSON structure
//     const [formData, setFormData] = useState({
//         name: '',
//         username: '',
//         company: '',
//         address: {
//             street: '',
//             city: '',
//             state: '',
//             pincode: ''
//         },
//         contacts: [],
//         website: '',
//         experience: '',
//         status: '',
//         operatingLocations: []
//     });

//     // State for logo file
//     const [logoFile, setLogoFile] = useState(null);
//     const [logoPreview, setLogoPreview] = useState(null);

//     // State for form submission and error handling
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(false);

//     // Fetch existing builder data on component mount
//     useEffect(() => {
//         const fetchBuilderData = async () => {
//             try {
//                 const response = await fetch(`${base_url}/builders/${builderId}`);
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch builder information');
//                 }
//                 const data = await response.json();
//                 setFormData({
//                     name: data.name || '',
//                     username: data.username || '',
//                     company: data.company || '',
//                     address: {
//                         street: data.address?.street || '',
//                         city: data.address?.city || '',
//                         state: data.address?.state || '',
//                         pincode: data.address?.pincode || ''
//                     },
//                     contacts: data.contacts || [],
//                     website: data.website || '',
//                     experience: data.experience || '',
//                     status: data.status || '',
//                     operatingLocations: data.operatingLocations || []
//                 });

//                 // Set logo preview if exists
//                 if (data.logo) {
//                     setLogoPreview(data.logo);
//                 }
//             } catch (err) {
//                 setError('Failed to fetch builder information');
//                 console.error(err);
//             }
//         };

//         fetchBuilderData();
//     }, [builderId]);

//     // Handle input changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         // Handle nested address fields
//         if (name.startsWith('address.')) {
//             const field = name.split('.')[1];
//             setFormData(prevState => ({
//                 ...prevState,
//                 address: {
//                     ...prevState.address,
//                     [field]: value
//                 }
//             }));
//             return;
//         }

//         // Handle contacts (assuming a single text input for now)
//         if (name === 'contacts') {
//             setFormData(prevState => ({
//                 ...prevState,
//                 contacts: value.split(',').map(contact => contact.trim())
//             }));
//             return;
//         }

//         // Handle operating locations (assuming a single text input)
//         if (name === 'operatingLocations') {
//             const locations = value.split(',').map(loc => {
//                 const [city, state] = loc.trim().split('-').map(part => part.trim());
//                 return { city, state };
//             });
//             setFormData(prevState => ({
//                 ...prevState,
//                 operatingLocations: locations
//             }));
//             return;
//         }

//         // Handle logo file upload
//         if (name === 'logo') {
//             const file = e.target.files[0];
//             if (file) {
//                 setLogoFile(file);
//                 const previewUrl = URL.createObjectURL(file);
//                 setLogoPreview(previewUrl);
//             }
//             return;
//         }

//         // Default handling for other fields
//         setFormData(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError(null);
//         setSuccess(false);

//         try {
//             // Create FormData object for multipart submission
//             const formDataToSend = new FormData();

//             // Add the main form data as a JSON string like in the property upload API
//             formDataToSend.append('data', JSON.stringify(formData));

//             // Add the logo file if a new one was selected
//             if (logoFile) {
//                 formDataToSend.append('logo', logoFile);
//             }

//             // Send the data to the server
//             const response = await fetch(`${base_url}/builders/${builderId}`, {
//                 method: 'PUT',
//                 // Don't set Content-Type header - browser will set it with boundary
//                 headers: {
//                     // Include authorization header if needed
//                     Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
//                 },
//                 body: formDataToSend
//             });

//             // Parse response
//             const result = await response.json();

//             if (!response.ok) {
//                 throw new Error(result.error || 'Failed to update builder information');
//             }

//             setSuccess(true);
//             setIsLoading(false);
//         } catch (err) {
//             setError(err.message);
//             setIsLoading(false);
//         }
//     };

//     // Clean up object URLs to avoid memory leaks
//     useEffect(() => {
//         return () => {
//             if (logoPreview && logoPreview.startsWith('blob:')) {
//                 URL.revokeObjectURL(logoPreview);
//             }
//         };
//     }, [logoPreview]);

//     return (
//         <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
//             <div className="relative py-3 sm:max-w-xl sm:mx-auto">
//                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
//                 <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
//                     <div className="max-w-md mx-auto">
//                         <div className="divide-y divide-gray-200">
//                             <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
//                                 <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
//                                     Update Builder Information
//                                 </h2>

//                                 {error && (
//                                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//                                         {error}
//                                     </div>
//                                 )}

//                                 {success && (
//                                     <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
//                                         Builder information updated successfully!
//                                     </div>
//                                 )}

//                                 <form onSubmit={handleSubmit} className="space-y-6">
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <div>
//                                             <label htmlFor="name" className="text-sm font-bold text-gray-600 block">Name</label>
//                                             <input
//                                                 type="text"
//                                                 name="name"
//                                                 value={formData.name}
//                                                 onChange={handleChange}
//                                                 required
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter builder name"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label htmlFor="username" className="text-sm font-bold text-gray-600 block">Username</label>
//                                             <input
//                                                 type="text"
//                                                 name="username"
//                                                 value={formData.username}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter username"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label htmlFor="company" className="text-sm font-bold text-gray-600 block">Company</label>
//                                         <input
//                                             type="text"
//                                             name="company"
//                                             value={formData.company}
//                                             onChange={handleChange}
//                                             className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                             placeholder="Enter company name"
//                                         />
//                                     </div>

//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <div>
//                                             <label htmlFor="address.street" className="text-sm font-bold text-gray-600 block">Street</label>
//                                             <input
//                                                 type="text"
//                                                 name="address.street"
//                                                 value={formData.address.street}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter street address"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label htmlFor="address.city" className="text-sm font-bold text-gray-600 block">City</label>
//                                             <input
//                                                 type="text"
//                                                 name="address.city"
//                                                 value={formData.address.city}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter city"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <div>
//                                             <label htmlFor="address.state" className="text-sm font-bold text-gray-600 block">State</label>
//                                             <input
//                                                 type="text"
//                                                 name="address.state"
//                                                 value={formData.address.state}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter state"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label htmlFor="address.pincode" className="text-sm font-bold text-gray-600 block">Pincode</label>
//                                             <input
//                                                 type="text"
//                                                 name="address.pincode"
//                                                 value={formData.address.pincode}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter pincode"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label htmlFor="contacts" className="text-sm font-bold text-gray-600 block">Contacts (comma-separated)</label>
//                                         <input
//                                             type="text"
//                                             name="contacts"
//                                             value={formData.contacts.join(', ')}
//                                             onChange={handleChange}
//                                             className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                             placeholder="Enter contacts (phone, email)"
//                                         />
//                                     </div>

//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <div>
//                                             <label htmlFor="website" className="text-sm font-bold text-gray-600 block">Website</label>
//                                             <input
//                                                 type="url"
//                                                 name="website"
//                                                 value={formData.website}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter website URL"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label htmlFor="experience" className="text-sm font-bold text-gray-600 block">Years of Experience</label>
//                                             <input
//                                                 type="number"
//                                                 name="experience"
//                                                 value={formData.experience}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter years of experience"
//                                                 min="0"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label htmlFor="operatingLocations" className="text-sm font-bold text-gray-600 block">Operating Locations (city-state, comma-separated)</label>
//                                         <input
//                                             type="text"
//                                             name="operatingLocations"
//                                             value={formData.operatingLocations.map(loc => `${loc.city}-${loc.state}`).join(', ')}
//                                             onChange={handleChange}
//                                             className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                             placeholder="Enter locations (city-state)"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label htmlFor="status" className="text-sm font-bold text-gray-600 block">Status</label>
//                                         <select
//                                             name="status"
//                                             value={formData.status}
//                                             onChange={handleChange}
//                                             className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                         >
//                                             <option value="">Select Status</option>
//                                             <option value="ACTIVE">Active</option>
//                                             <option value="INACTIVE">Inactive</option>
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label htmlFor="logo" className="text-sm font-bold text-gray-600 block">Logo</label>
//                                         <input
//                                             type="file"
//                                             name="logo"
//                                             accept="image/*"
//                                             onChange={handleChange}
//                                             className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                         />
//                                         {logoPreview && (
//                                             <div className="mt-2">
//                                                 <img
//                                                     src={logoPreview}
//                                                     alt="Logo Preview"
//                                                     className="max-w-full h-auto rounded"
//                                                     style={{ maxHeight: '200px' }}
//                                                 />
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="pt-4 flex items-center space-x-4">
//                                         <button
//                                             type="submit"
//                                             disabled={isLoading}
//                                             className="bg-cyan-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none hover:bg-cyan-600 transition duration-300 ease-in-out disabled:opacity-50"
//                                         >
//                                             {isLoading ? (
//                                                 <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
//                                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                                 </svg>
//                                             ) : (
//                                                 'Update Builder Information'
//                                             )}
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BuilderUpdateInfo;

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { base_url } from '../../../utils/base_url';
import {
    FaBuilding, FaTimes, FaMapMarkerAlt,
    FaPlus, FaImage, FaCheck, FaGlobe, FaPhone,
    FaChartBar, FaInfoCircle, FaSave, FaSpinner, FaBell, FaEnvelope
} from 'react-icons/fa';

const BuilderUpdateInfo = () => {
    const { builderId } = useParams();
    const logoInputRef = useRef(null);
    const [contactInput, setContactInput] = useState('');
    const [operatingLocationInput, setOperatingLocationInput] = useState({
        city: '',
        state: ''
    });

    // State to manage form data based on the JSON structure
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        company: '',
        experience: 0,
        establishedYear: new Date().getFullYear(),
        status: 'ACTIVE',
        description: '',
        website: '',
        contacts: [],
        address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        },
        latitude: null,
        longitude: null,
        statistics: {
            completedProjects: 0,
            ongoingProjects: 0,
            totalBuildings: 0,
            totalProperties: 0
        },
        operatingLocations: [],
        access: false,
        emailNotifications: {
            dailyReport: {
                enabled: false,
                time: "08:00",
                email: "",
                lastSent: null
            }
        }
    });

    // State for logo file
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    // State for form submission and error handling
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Fetch existing builder data on component mount
    useEffect(() => {
        const fetchBuilderData = async () => {
            try {
                const response = await fetch(`${base_url}/builders/${builderId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch builder information');
                }
                const data = await response.json();

                // Set form data with all available fields
                setFormData({
                    name: data.name || '',
                    username: data.username || '',
                    company: data.company || '',
                    description: data.description || '',
                    experience: data.experience || 0,
                    establishedYear: data.establishedYear || new Date().getFullYear(),
                    address: {
                        street: data.address?.street || '',
                        city: data.address?.city || '',
                        state: data.address?.state || '',
                        pincode: data.address?.pincode || ''
                    },
                    contacts: data.contacts || [],
                    website: data.website || '',
                    status: data.status || 'ACTIVE',
                    latitude: data.latitude || null,
                    longitude: data.longitude || null,
                    statistics: {
                        completedProjects: data.statistics?.completedProjects || 0,
                        ongoingProjects: data.statistics?.ongoingProjects || 0,
                        totalBuildings: data.statistics?.totalBuildings || 0,
                        totalProperties: data.statistics?.totalProperties || 0
                    },
                    operatingLocations: data.operatingLocations || [],
                    access: data.access || false,
                    emailNotifications: {
                        dailyReport: {
                            enabled: data.emailNotifications?.dailyReport?.enabled || false,
                            time: data.emailNotifications?.dailyReport?.time || "08:00",
                            email: data.emailNotifications?.dailyReport?.email || "",
                            lastSent: data.emailNotifications?.dailyReport?.lastSent || null
                        }
                    }
                });

                // Set logo preview if exists
                if (data.logo) {
                    setLogoPreview(data.logo);
                }

                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch builder information');
                console.error(err);
                setIsLoading(false);
            }
        };

        fetchBuilderData();
    }, [builderId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Handle deeply nested object inputs
        if (name.includes('.')) {
            const parts = name.split('.');

            if (parts.length === 2) {
                const [parent, child] = parts;
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: value
                    }
                }));
            } else if (parts.length === 3) {
                const [parent, middle, child] = parts;
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [middle]: {
                            ...prev[parent][middle],
                            [child]: value
                        }
                    }
                }));
            }
        } else if (name === 'experience' || name === 'establishedYear') {
            // Convert to number for numeric inputs
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        // Handle nested checkbox fields
        if (name.includes('.')) {
            const parts = name.split('.');

            if (parts.length === 3) {
                const [parent, middle, child] = parts;
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [middle]: {
                            ...prev[parent][middle],
                            [child]: checked
                        }
                    }
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: checked }));
        }
    };

    const handleLatLngChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const previewUrl = URL.createObjectURL(file);
            setLogoPreview(previewUrl);
        }
    };

    const addContact = () => {
        if (contactInput.trim()) {
            setFormData(prev => ({
                ...prev,
                contacts: [...prev.contacts, contactInput.trim()]
            }));
            setContactInput('');

            // If it's an email and no notification email is set, use this as default
            if (contactInput.match(/^\S+@\S+\.\S+$/) && !formData.emailNotifications.dailyReport.email) {
                setFormData(prev => ({
                    ...prev,
                    emailNotifications: {
                        ...prev.emailNotifications,
                        dailyReport: {
                            ...prev.emailNotifications.dailyReport,
                            email: contactInput.trim()
                        }
                    }
                }));
            }
        }
    };

    const removeContact = (index) => {
        setFormData(prev => ({
            ...prev,
            contacts: prev.contacts.filter((_, i) => i !== index)
        }));
    };

    const addOperatingLocation = () => {
        const { city, state } = operatingLocationInput;
        if (city.trim() && state.trim()) {
            setFormData(prev => ({
                ...prev,
                operatingLocations: [
                    ...prev.operatingLocations,
                    { city: city.trim(), state: state.trim() }
                ]
            }));
            // Reset input
            setOperatingLocationInput({ city: '', state: '' });
        }
    };

    const removeOperatingLocation = (index) => {
        setFormData(prev => ({
            ...prev,
            operatingLocations: prev.operatingLocations.filter((_, i) => i !== index)
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            // Create FormData object for multipart submission
            const formDataToSend = new FormData();

            // Add the main form data as a JSON string
            formDataToSend.append('data', JSON.stringify(formData));

            // Add the logo file if a new one was selected
            if (logoFile) {
                formDataToSend.append('logo', logoFile);
            }

            // Send the data to the server
            const response = await fetch(`${base_url}/builders/${builderId}`, {
                method: 'PUT',
                // Don't set Content-Type header - browser will set it with boundary
                headers: {
                    // Include authorization header if needed
                    Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
                },
                body: formDataToSend
            });

            // Parse response
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to update builder information');
            }

            setSuccess(true);
            setIsSubmitting(false);

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    // Clean up object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            if (logoPreview && logoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(logoPreview);
            }
        };
    }, [logoPreview]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-4 text-lg text-gray-700">Loading...</span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <FaBuilding className="mr-3 text-blue-600" />
                        Update Builder Information
                    </h1>
                </div>

                {error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline"> Builder information updated successfully!</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaInfoCircle className="mr-2 text-blue-500" />
                            Basic Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Builder Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                    placeholder="Enter builder name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter company name"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter username"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Leave blank to keep current password"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Leave blank to keep the current password
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                rows="3"
                                placeholder="Enter a description of the builder"
                            ></textarea>
                        </div>

                        {/* Logo Upload */}
                        <div className="mt-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Company Logo
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="file"
                                    ref={logoInputRef}
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    type="button"
                                    onClick={() => logoInputRef.current.click()}
                                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                                >
                                    <FaImage className="mr-2" />
                                    {logoFile ? "Change Logo" : "Update Logo"}
                                </button>
                                {logoPreview && (
                                    <div className="ml-4 flex items-center">
                                        <img
                                            src={logoPreview}
                                            alt="Logo Preview"
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setLogoPreview(null);
                                                setLogoFile(null);
                                            }}
                                            className="ml-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Recommended: Square image (1:1 ratio), max 2MB in size
                            </p>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaPhone className="mr-2 text-blue-500" />
                            Contact Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Website
                                </label>
                                <div className="flex items-center">
                                    <FaGlobe className="text-gray-500 mr-2" />
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Contacts
                                </label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={contactInput}
                                        onChange={(e) => setContactInput(e.target.value)}
                                        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter phone or email"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addContact();
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={addContact}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-all"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {formData.contacts.map((contact, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center text-sm"
                                        >
                                            {contact}
                                            <button
                                                type="button"
                                                onClick={() => removeContact(index)}
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                            >
                                                <FaTimes />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaBell className="mr-2 text-blue-500" />
                            Notification Settings
                        </h2>

                        <div className="mb-4">
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="dailyReportEnabled"
                                    name="emailNotifications.dailyReport.enabled"
                                    checked={formData.emailNotifications.dailyReport.enabled}
                                    onChange={handleCheckboxChange}
                                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition-all"
                                />
                                <label htmlFor="dailyReportEnabled" className="ml-2 text-gray-700 font-medium">
                                    Enable Daily Report Emails
                                </label>
                            </div>
                        </div>

                        {formData.emailNotifications.dailyReport.enabled && (
                            <div className="grid md:grid-cols-2 gap-6 pl-7">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Email Address
                                    </label>
                                    <div className="flex items-center">
                                        <FaEnvelope className="text-gray-500 mr-2" />
                                        <input
                                            type="email"
                                            name="emailNotifications.dailyReport.email"
                                            value={formData.emailNotifications.dailyReport.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="email@example.com"
                                            required={formData.emailNotifications.dailyReport.enabled}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Delivery Time (24-hour format)
                                    </label>
                                    <input
                                        type="time"
                                        name="emailNotifications.dailyReport.time"
                                        value={formData.emailNotifications.dailyReport.time}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Location Section */}
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-blue-500" />
                            Location Information
                        </h2>

                        {/* Address Fields */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Street
                                </label>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter street address"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter city"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    State
                                </label>
                                <input
                                    type="text"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter state"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Pincode
                                </label>
                                <input
                                    type="text"
                                    name="address.pincode"
                                    value={formData.address.pincode}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter pincode"
                                />
                            </div>
                        </div>

                        {/* Map Coordinates */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-gray-700 font-medium">
                                    Map Location
                                </label>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Latitude
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.latitude || ''}
                                        onChange={(e) => handleLatLngChange('latitude', parseFloat(e.target.value))}
                                        step="any"
                                        placeholder="Latitude"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Longitude
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.longitude || ''}
                                        onChange={(e) => handleLatLngChange('longitude', parseFloat(e.target.value))}
                                        step="any"
                                        placeholder="Longitude"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Operating Locations */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Operating Locations
                            </label>
                            <div className="flex space-x-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={operatingLocationInput.city}
                                    onChange={(e) => setOperatingLocationInput(prev => ({
                                        ...prev,
                                        city: e.target.value
                                    }))}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={operatingLocationInput.state}
                                    onChange={(e) => setOperatingLocationInput(prev => ({
                                        ...prev,
                                        state: e.target.value
                                    }))}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={addOperatingLocation}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.operatingLocations.map((location, index) => (
                                    <span
                                        key={index}
                                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center text-sm"
                                    >
                                        {`${location.city}, ${location.state}`}
                                        <button
                                            type="button"
                                            onClick={() => removeOperatingLocation(index)}
                                            className="ml-2 text-green-600 hover:text-green-800"
                                        >
                                            <FaTimes />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Experience & Statistics Section */}
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaChartBar className="mr-2 text-blue-500" />
                            Experience & Statistics
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Experience (Years)
                                </label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Established Year
                                </label>
                                <input
                                    type="number"
                                    name="establishedYear"
                                    value={formData.establishedYear}
                                    onChange={handleInputChange}
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Completed Projects
                                </label>
                                <input
                                    type="number"
                                    name="statistics.completedProjects"
                                    value={formData.statistics.completedProjects}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Ongoing Projects
                                </label>
                                <input
                                    type="number"
                                    name="statistics.ongoingProjects"
                                    value={formData.statistics.ongoingProjects}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Total Buildings
                                </label>
                                <input
                                    type="number"
                                    name="statistics.totalBuildings"
                                    value={formData.statistics.totalBuildings}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Total Properties
                                </label>
                                <input
                                    type="number"
                                    name="statistics.totalProperties"
                                    value={formData.statistics.totalProperties}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status & Access */}
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaCheck className="mr-2 text-blue-500" />
                            Status & Settings
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Builder Access
                                </label>
                                <div className="flex items-center mt-3">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="access"
                                            checked={formData.access}
                                            onChange={handleCheckboxChange}
                                            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition-all"
                                        />
                                        <span className="ml-2 text-gray-700">
                                            {formData.access ? 'Access Granted' : 'Access Restricted'}
                                        </span>
                                    </label>
                                    <span className="ml-2 text-sm text-gray-500">
                                        {formData.access
                                            ? 'Builder will be able to log in and manage their properties'
                                            : 'Builder will not have access to the platform'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all text-lg font-medium flex items-center justify-center min-w-[200px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <FaSave className="mr-2" />
                                    Update Builder
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default BuilderUpdateInfo;