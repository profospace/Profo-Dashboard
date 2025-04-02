// import React, { useState, useEffect } from 'react';
// import { useLocation, useParams } from 'react-router-dom';
// import { base_url } from '../../../utils/base_url';

// const BuilderUpdateInfo = () => {
//     const {builderId} = useParams()
//     console.log(builderId)
//     // State to manage form data
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         company: '',
//         address: '',
//         specializations: '',
//         yearsOfExperience: '',
//         license: '',
//         description: ''
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
//                 console.log("data", data)
//                 setFormData(data);
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
//             const response = await fetch(`/api/builders/${builderId}`, {
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
//                                             <label htmlFor="email" className="text-sm font-bold text-gray-600 block">Email</label>
//                                             <input
//                                                 type="email"
//                                                 name="email"
//                                                 value={formData.email}
//                                                 onChange={handleChange}
//                                                 required
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter email address"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <div>
//                                             <label htmlFor="phone" className="text-sm font-bold text-gray-600 block">Phone</label>
//                                             <input
//                                                 type="tel"
//                                                 name="phone"
//                                                 value={formData.phone}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter phone number"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label htmlFor="company" className="text-sm font-bold text-gray-600 block">Company</label>
//                                             <input
//                                                 type="text"
//                                                 name="company"
//                                                 value={formData.company}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter company name"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label htmlFor="address" className="text-sm font-bold text-gray-600 block">Address</label>
//                                         <input
//                                             type="text"
//                                             name="address"
//                                             value={formData.address}
//                                             onChange={handleChange}
//                                             className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                             placeholder="Enter full address"
//                                         />
//                                     </div>

//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <div>
//                                             <label htmlFor="specializations" className="text-sm font-bold text-gray-600 block">Specializations</label>
//                                             <input
//                                                 type="text"
//                                                 name="specializations"
//                                                 value={formData.specializations}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter specializations"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label htmlFor="yearsOfExperience" className="text-sm font-bold text-gray-600 block">Years of Experience</label>
//                                             <input
//                                                 type="number"
//                                                 name="yearsOfExperience"
//                                                 value={formData.yearsOfExperience}
//                                                 onChange={handleChange}
//                                                 className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                                 placeholder="Enter years of experience"
//                                                 min="0"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label htmlFor="license" className="text-sm font-bold text-gray-600 block">License Number</label>
//                                         <input
//                                             type="text"
//                                             name="license"
//                                             value={formData.license}
//                                             onChange={handleChange}
//                                             className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                             placeholder="Enter license number"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label htmlFor="description" className="text-sm font-bold text-gray-600 block">Description</label>
//                                         <textarea
//                                             name="description"
//                                             value={formData.description}
//                                             onChange={handleChange}
//                                             rows="4"
//                                             className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                             placeholder="Enter builder description"
//                                         ></textarea>
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



import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { base_url } from '../../../utils/base_url';

const BuilderUpdateInfo = () => {
    const { builderId } = useParams();

    // State to manage form data based on the JSON structure
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        company: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        },
        contacts: [],
        website: '',
        experience: '',
        status: '',
        operatingLocations: [],
        logo: null
    });

    // State for form submission and error handling
    const [isLoading, setIsLoading] = useState(false);
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
                setFormData({
                    name: data.name || '',
                    username: data.username || '',
                    company: data.company || '',
                    address: {
                        street: data.address?.street || '',
                        city: data.address?.city || '',
                        state: data.address?.state || '',
                        pincode: data.address?.pincode || ''
                    },
                    contacts: data.contacts || [],
                    website: data.website || '',
                    experience: data.experience || '',
                    status: data.status || '',
                    operatingLocations: data.operatingLocations || [],
                    logo: data.logo || null
                });
            } catch (err) {
                setError('Failed to fetch builder information');
                console.error(err);
            }
        };

        fetchBuilderData();
    }, [builderId]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested address fields
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prevState => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    [field]: value
                }
            }));
            return;
        }

        // Handle contacts (assuming a single text input for now)
        if (name === 'contacts') {
            setFormData(prevState => ({
                ...prevState,
                contacts: value.split(',').map(contact => contact.trim())
            }));
            return;
        }

        // Handle operating locations (assuming a single text input)
        if (name === 'operatingLocations') {
            const locations = value.split(',').map(loc => {
                const [city, state] = loc.trim().split('-').map(part => part.trim());
                return { city, state };
            });
            setFormData(prevState => ({
                ...prevState,
                operatingLocations: locations
            }));
            return;
        }

        // Handle logo file upload
        if (name === 'logo') {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prevState => ({
                    ...prevState,
                    logo: reader.result
                }));
            };
            if (file) {
                reader.readAsDataURL(file);
            }
            return;
        }

        // Default handling for other fields
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${base_url}/builders/${builderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update builder information');
            }

            setSuccess(true);
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
                                    Update Builder Information
                                </h2>

                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                                        Builder information updated successfully!
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name" className="text-sm font-bold text-gray-600 block">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                placeholder="Enter builder name"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="username" className="text-sm font-bold text-gray-600 block">Username</label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                placeholder="Enter username"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="company" className="text-sm font-bold text-gray-600 block">Company</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                            placeholder="Enter company name"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="address.street" className="text-sm font-bold text-gray-600 block">Street</label>
                                            <input
                                                type="text"
                                                name="address.street"
                                                value={formData.address.street}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                placeholder="Enter street address"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="address.city" className="text-sm font-bold text-gray-600 block">City</label>
                                            <input
                                                type="text"
                                                name="address.city"
                                                value={formData.address.city}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                placeholder="Enter city"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="address.state" className="text-sm font-bold text-gray-600 block">State</label>
                                            <input
                                                type="text"
                                                name="address.state"
                                                value={formData.address.state}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                placeholder="Enter state"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="address.pincode" className="text-sm font-bold text-gray-600 block">Pincode</label>
                                            <input
                                                type="text"
                                                name="address.pincode"
                                                value={formData.address.pincode}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                placeholder="Enter pincode"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="contacts" className="text-sm font-bold text-gray-600 block">Contacts (comma-separated)</label>
                                        <input
                                            type="text"
                                            name="contacts"
                                            value={formData.contacts.join(', ')}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                            placeholder="Enter contacts (phone, email)"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="website" className="text-sm font-bold text-gray-600 block">Website</label>
                                            <input
                                                type="url"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                placeholder="Enter website URL"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="experience" className="text-sm font-bold text-gray-600 block">Years of Experience</label>
                                            <input
                                                type="number"
                                                name="experience"
                                                value={formData.experience}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                placeholder="Enter years of experience"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="operatingLocations" className="text-sm font-bold text-gray-600 block">Operating Locations (city-state, comma-separated)</label>
                                        <input
                                            type="text"
                                            name="operatingLocations"
                                            value={formData.operatingLocations.map(loc => `${loc.city}-${loc.state}`).join(', ')}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                            placeholder="Enter locations (city-state)"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="text-sm font-bold text-gray-600 block">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="ACTIVE">Active</option>
                                            <option value="INACTIVE">Inactive</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="logo" className="text-sm font-bold text-gray-600 block">Logo</label>
                                        <input
                                            type="file"
                                            name="logo"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        />
                                        {formData.logo && (
                                            <div className="mt-2">
                                                <img
                                                    src={formData.logo}
                                                    alt="Logo Preview"
                                                    className="max-w-full h-auto rounded"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 flex items-center space-x-4">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-cyan-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none hover:bg-cyan-600 transition duration-300 ease-in-out disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                'Update Builder Information'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuilderUpdateInfo;