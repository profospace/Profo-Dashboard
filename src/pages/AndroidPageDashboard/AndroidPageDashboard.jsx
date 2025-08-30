// import React, { useState, useEffect } from 'react';
// import { Plus, Trash2, Eye, Save, Download, Upload, Edit3, Server, Smartphone } from 'lucide-react';

// // Mock API service (replace with actual API calls)
// const API_BASE_URL = 'http://localhost:5029/api';

// const apiService = {
//     // Pages API
//     getAllPages: async () => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/pages/all`);
//             const result = await response.json();
//             return result.success ? result.data : [];
//         } catch (error) {
//             console.error('Error fetching pages:', error);
//             return [];
//         }
//     },

//     getPageById: async (id) => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/pages/${id}`);
//             const result = await response.json();
//             return result.success ? result.data : null;
//         } catch (error) {
//             console.error('Error fetching page:', error);
//             return null;
//         }
//     },

//     createPage: async (pageData) => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/pages`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(pageData)
//             });
//             const result = await response.json();
//             return result.success ? result.data : null;
//         } catch (error) {
//             console.error('Error creating page:', error);
//             return null;
//         }
//     },

//     updatePage: async (id, pageData) => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/pages/${id}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(pageData)
//             });
//             const result = await response.json();
//             return result.success ? result.data : null;
//         } catch (error) {
//             console.error('Error updating page:', error);
//             return null;
//         }
//     },

//     deletePage: async (id) => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/pages/${id}`, {
//                 method: 'DELETE'
//             });
//             const result = await response.json();
//             return result.success;
//         } catch (error) {
//             console.error('Error deleting page:', error);
//             return false;
//         }
//     },

//     togglePageStatus: async (id) => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/pages/${id}/toggle`, {
//                 method: 'PATCH'
//             });
//             const result = await response.json();
//             return result.success ? result.data : null;
//         } catch (error) {
//             console.error('Error toggling page status:', error);
//             return null;
//         }
//     },

//     // Images API
//     uploadImage: async (file) => {
//         try {
//             const formData = new FormData();
//             formData.append('image', file);
//             const response = await fetch(`${API_BASE_URL}/images/upload`, {
//                 method: 'POST',
//                 body: formData
//             });
//             const result = await response.json();
//             return result.success ? result.data : null;
//         } catch (error) {
//             console.error('Error uploading image:', error);
//             return null;
//         }
//     },

//     getAllImages: async () => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/images`);
//             const result = await response.json();
//             return result.success ? result.data : [];
//         } catch (error) {
//             console.error('Error fetching images:', error);
//             return [];
//         }
//     },

//     deleteImage: async (id) => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/images/${id}`, {
//                 method: 'DELETE'
//             });
//             const result = await response.json();
//             return result.success;
//         } catch (error) {
//             console.error('Error deleting image:', error);
//             return false;
//         }
//     }
// };

// const AndroidPageDashboard = () => {
//     const [pages, setPages] = useState([]);
//     const [selectedPage, setSelectedPage] = useState(null);
//     const [showPreview, setShowPreview] = useState(false);
//     const [showAPIEndpoints, setShowAPIEndpoints] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [images, setImages] = useState([]);
//     const [showImageGallery, setShowImageGallery] = useState(false);

//     console.log("pages", pages)
//     // Load pages on component mount
//     useEffect(() => {
//         loadPages();
//         loadImages();
//     }, []);

//     const loadPages = async () => {
//         setLoading(true);
//         try {
//             const pages = await apiService.getAllPages();
//             setPages(pages);
//         } catch (error) {
//             console.error('Error loading pages:', error);
//         }
//         setLoading(false);
//     };

//     const loadImages = async () => {
//         try {
//             const images = await apiService.getAllImages();
//             setImages(images);
//         } catch (error) {
//             console.error('Error loading images:', error);
//         }
//     };

//     const createNewPage = async () => {
//         const newPageData = {
//             name: 'New Page',
//             title: 'Page Title',
//             titleColor: '#1F2937',
//             backgroundColor: '#F9FAFB',
//             buttonText: 'Action Button',
//             buttonColor: '#3B82F6',
//             buttonTextColor: '#FFFFFF',
//             buttonDeeplink: '',
//             heroImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
//             horizontalLists: [],
//             isActive: true
//         };

//         try {
//             const newPage = await apiService.createPage(newPageData);
//             if (newPage) {
//                 setPages([...pages, newPage]);
//                 setSelectedPage(newPage);
//             }
//         } catch (error) {
//             console.error('Error creating page:', error);
//             alert('Error creating page');
//         }
//     };

//     const updatePage = async (updatedPage) => {
//         try {
//             const result = await apiService.updatePage(updatedPage._id, updatedPage);
//             if (result) {
//                 const updatedPages = pages.map(page =>
//                     page._id === updatedPage._id ? result : page
//                 );
//                 setPages(updatedPages);
//                 setSelectedPage(result);
//             }
//         } catch (error) {
//             console.error('Error updating page:', error);
//             alert('Error updating page');
//         }
//     };

//     const deletePage = async (id) => {
//         try {
//             const success = await apiService.deletePage(id);
//             if (success) {
//                 setPages(pages.filter(page => page._id !== id));
//                 if (selectedPage && selectedPage._id === id) {
//                     setSelectedPage(null);
//                 }
//             }
//         } catch (error) {
//             console.error('Error deleting page:', error);
//             alert('Error deleting page');
//         }
//     };

//     const togglePageStatus = async (id) => {
//         try {
//             const updatedPage = await apiService.togglePageStatus(id);
//             if (updatedPage) {
//                 const updatedPages = pages.map(page =>
//                     page._id === id ? updatedPage : page
//                 );
//                 setPages(updatedPages);
//                 if (selectedPage && selectedPage._id === id) {
//                     setSelectedPage(updatedPage);
//                 }
//             }
//         } catch (error) {
//             console.error('Error toggling page status:', error);
//             alert('Error toggling page status');
//         }
//     };

//     const addHorizontalList = () => {
//         if (!selectedPage) return;
//         const newList = {
//             id: Date.now(),
//             title: 'New List',
//             titleColor: '#374151',
//             images: []
//         };
//         const updatedPage = {
//             ...selectedPage,
//             horizontalLists: [...selectedPage.horizontalLists, newList]
//         };
//         updatePage(updatedPage);
//     };

//     const updateHorizontalList = (listId, updatedList) => {
//         if (!selectedPage) return;
//         const updatedPage = {
//             ...selectedPage,
//             horizontalLists: selectedPage.horizontalLists.map(list =>
//                 list.id === listId ? updatedList : list
//             )
//         };
//         updatePage(updatedPage);
//     };

//     const deleteHorizontalList = (listId) => {
//         if (!selectedPage) return;
//         const updatedPage = {
//             ...selectedPage,
//             horizontalLists: selectedPage.horizontalLists.filter(list => list.id !== listId)
//         };
//         updatePage(updatedPage);
//     };

//     const addImageToList = (listId, imageUrl) => {
//         if (!selectedPage) return;

//         const updatedPage = {
//             ...selectedPage,
//             horizontalLists: selectedPage.horizontalLists.map(list =>
//                 list.id === listId
//                     ? { ...list, images: [...list.images, imageUrl] }
//                     : list
//             )
//         };
//         updatePage(updatedPage);
//     };

//     const removeImageFromList = (listId, imageIndex) => {
//         if (!selectedPage) return;
//         const updatedPage = {
//             ...selectedPage,
//             horizontalLists: selectedPage.horizontalLists.map(list =>
//                 list.id === listId
//                     ? { ...list, images: list.images.filter((_, index) => index !== imageIndex) }
//                     : list
//             )
//         };
//         updatePage(updatedPage);
//     };

//     const downloadJSON = (page) => {
//         const dataStr = JSON.stringify(page, null, 2);
//         const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
//         const exportFileDefaultName = `${page.name.replace(/\s+/g, '_')}_page.json`;

//         const linkElement = document.createElement('a');
//         linkElement.setAttribute('href', dataUri);
//         linkElement.setAttribute('download', exportFileDefaultName);
//         linkElement.click();
//     };

//     const AndroidPreview = ({ page }) => (
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto">
//             <div
//                 className="p-4"
//                 style={{ backgroundColor: page.backgroundColor }}
//             >
//                 <h1
//                     className="text-2xl font-bold mb-4 text-center"
//                     style={{ color: page.titleColor }}
//                 >
//                     {page.title}
//                 </h1>

//                 {page.heroImage && (
//                     <img
//                         src={page.heroImage}
//                         alt="Hero"
//                         className="w-full h-48 object-cover rounded-lg mb-4"
//                     />
//                 )}

//                 {page.horizontalLists.map((list) => (
//                     <div key={list.id} className="mb-4">
//                         <h3
//                             className="text-lg font-semibold mb-2"
//                             style={{ color: list.titleColor }}
//                         >
//                             {list.title}
//                         </h3>
//                         <div className="flex gap-2 overflow-x-auto pb-2">
//                             {list.images.map((image, index) => (
//                                 <img
//                                     key={index}
//                                     src={image}
//                                     alt={`Item ${index + 1}`}
//                                     className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 ))}

//                 <button
//                     className="w-full py-3 rounded-lg font-semibold text-center mt-4"
//                     style={{
//                         backgroundColor: page.buttonColor,
//                         color: page.buttonTextColor
//                     }}
//                 >
//                     {page.buttonText}
//                 </button>
//             </div>
//         </div>
//     );

//     const APIEndpoints = () => (
//         <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm">
//             <h3 className="text-lg font-bold mb-4 text-white">API Endpoints for Android</h3>

//             <div className="space-y-4">
//                 <div>
//                     <div className="text-blue-400 font-semibold">GET /api/pages</div>
//                     <div className="text-gray-300 ml-4">Get all active pages</div>
//                     <div className="text-yellow-400 ml-4">Response: Array of page objects</div>
//                 </div>

//                 <div>
//                     <div className="text-blue-400 font-semibold">GET /api/pages/:id</div>
//                     <div className="text-gray-300 ml-4">Get specific page by ID</div>
//                     <div className="text-yellow-400 ml-4">Response: Page object</div>
//                 </div>

//                 <div>
//                     <div className="text-blue-400 font-semibold">GET /api/images</div>
//                     <div className="text-gray-300 ml-4">Get all uploaded images</div>
//                     <div className="text-yellow-400 ml-4">Response: Array of image objects</div>
//                 </div>

//                 <div>
//                     <div className="text-blue-400 font-semibold">GET /api/images/:filename</div>
//                     <div className="text-gray-300 ml-4">Get specific image file</div>
//                     <div className="text-yellow-400 ml-4">Response: Image file</div>
//                 </div>

//                 <div className="mt-6">
//                     <h4 className="text-white font-semibold mb-2">Example Response:</h4>
//                     <pre className="bg-gray-800 p-3 rounded text-xs overflow-x-auto">
//                         {`{
//   "_id": "12345",
//   "name": "Home Offers",
//   "title": "Special Offers",
//   "titleColor": "#1F2937",
//   "backgroundColor": "#F9FAFB",
//   "buttonText": "Shop Now",
//   "buttonColor": "#EF4444",
//   "buttonTextColor": "#FFFFFF",
//   "heroImage": "http://localhost:5000/api/images/hero1.jpg",
//   "horizontalLists": [
//     {
//       "id": 1,
//       "title": "Featured Products",
//       "titleColor": "#374151",
//       "images": [
//         "http://localhost:5000/api/images/product1.jpg",
//         "http://localhost:5000/api/images/product2.jpg"
//       ]
//     }
//   ],
//   "isActive": true,
//   "createdAt": "2024-01-01T00:00:00.000Z",
//   "updatedAt": "2024-01-01T00:00:00.000Z"
// }`}
//                     </pre>
//                 </div>
//             </div>
//         </div>
//     );

//     const ImageGallery = () => (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
//                 <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-bold">Image Gallery</h3>
//                     <button
//                         onClick={() => setShowImageGallery(false)}
//                         className="text-gray-500 hover:text-gray-700 text-xl"
//                     >
//                         ×
//                     </button>
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {images.map((image) => (
//                         <div key={image._id} className="relative group">
//                             <img
//                                 src={image.url}
//                                 alt={image.filename}
//                                 className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-75"
//                                 onClick={() => {
//                                     navigator.clipboard.writeText(image.url);
//                                     alert('Image URL copied to clipboard!');
//                                 }}
//                             />
//                             <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg">
//                                 <span className="text-white text-xs">Click to copy URL</span>
//                             </div>
//                             <button
//                                 onClick={async () => {
//                                     if (confirm('Are you sure you want to delete this image?')) {
//                                         const success = await apiService.deleteImage(image._id);
//                                         if (success) {
//                                             setImages(images.filter(img => img._id !== image._id));
//                                         }
//                                     }
//                                 }}
//                                 className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100"
//                             >
//                                 ×
//                             </button>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="mt-4 p-4 bg-gray-100 rounded-lg">
//                     <h4 className="font-semibold mb-2">Upload New Image</h4>
//                     <input
//                         type="file"
//                         accept="image/*"
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                         onChange={async (e) => {
//                             const file = e.target.files[0];
//                             if (file) {
//                                 try {
//                                     const uploadedImage = await apiService.uploadImage(file);
//                                     if (uploadedImage) {
//                                         setImages([uploadedImage, ...images]);
//                                         alert('Image uploaded successfully!');
//                                         e.target.value = ''; // Reset input
//                                     }
//                                 } catch (error) {
//                                     console.error('Upload error:', error);
//                                     alert('Error uploading image');
//                                 }
//                             }
//                         }}
//                     />
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-7xl mx-auto">
//                 <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//                     <div className="flex justify-between items-center mb-6">
//                         <h1 className="text-3xl font-bold text-gray-800">Android Page Dashboard</h1>
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setShowImageGallery(true)}
//                                 className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
//                             >
//                                 <Upload size={20} />
//                                 Image Gallery
//                             </button>
//                             <button
//                                 onClick={() => setShowAPIEndpoints(true)}
//                                 className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
//                             >
//                                 <Server size={20} />
//                                 API Endpoints
//                             </button>
//                             <button
//                                 onClick={createNewPage}
//                                 className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
//                             >
//                                 <Plus size={20} />
//                                 Create New Page
//                             </button>
//                         </div>
//                     </div>

//                     {loading ? (
//                         <div className="text-center py-8">Loading pages...</div>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                             {pages.map((page) => (
//                                 <div
//                                     key={page._id}
//                                     className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPage?._id === page._id
//                                         ? 'border-blue-500 bg-blue-50'
//                                         : 'border-gray-200 hover:border-gray-300'
//                                         }`}
//                                     onClick={() => setSelectedPage(page)}
//                                 >
//                                     <div className="flex justify-between items-start mb-2">
//                                         <h3 className="font-semibold text-gray-800">{page.name}</h3>
//                                         <div className={`px-2 py-1 rounded text-xs ${page.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                                             }`}>
//                                             {page.isActive ? 'Active' : 'Inactive'}
//                                         </div>
//                                     </div>
//                                     <p className="text-sm text-gray-600 mb-3">{page.title}</p>
//                                     <div className="text-xs text-gray-500 mb-3">
//                                         Updated: {new Date(page.updatedAt).toLocaleDateString()}
//                                     </div>
//                                     <div className="flex gap-2 justify-between">
//                                         <div className="flex gap-2">
//                                             <button
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     setShowPreview(page);
//                                                 }}
//                                                 className="text-blue-600 hover:text-blue-800"
//                                             >
//                                                 <Eye size={16} />
//                                             </button>
//                                             <button
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     downloadJSON(page);
//                                                 }}
//                                                 className="text-green-600 hover:text-green-800"
//                                             >
//                                                 <Download size={16} />
//                                             </button>
//                                             <button
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     deletePage(page._id);
//                                                 }}
//                                                 className="text-red-600 hover:text-red-800"
//                                             >
//                                                 <Trash2 size={16} />
//                                             </button>
//                                         </div>
//                                         <button
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 togglePageStatus(page._id);
//                                             }}
//                                             className={`text-sm px-2 py-1 rounded ${page.isActive
//                                                 ? 'bg-red-100 text-red-700 hover:bg-red-200'
//                                                 : 'bg-green-100 text-green-700 hover:bg-green-200'
//                                                 }`}
//                                         >
//                                             {page.isActive ? 'Deactivate' : 'Activate'}
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 {selectedPage && (
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                         {/* Page Editor */}
//                         <div className="bg-white rounded-lg shadow-lg p-6">
//                             <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Page: {selectedPage.name}</h2>

//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Page Name</label>
//                                     <input
//                                         type="text"
//                                         value={selectedPage.name}
//                                         onChange={(e) => updatePage({ ...selectedPage, name: e.target.value })}
//                                         className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
//                                     <input
//                                         type="text"
//                                         value={selectedPage.title}
//                                         onChange={(e) => updatePage({ ...selectedPage, title: e.target.value })}
//                                         className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                                     />
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">Title Color</label>
//                                         <input
//                                             type="color"
//                                             value={selectedPage.titleColor}
//                                             onChange={(e) => updatePage({ ...selectedPage, titleColor: e.target.value })}
//                                             className="w-full h-10 border border-gray-300 rounded-lg"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
//                                         <input
//                                             type="color"
//                                             value={selectedPage.backgroundColor}
//                                             onChange={(e) => updatePage({ ...selectedPage, backgroundColor: e.target.value })}
//                                             className="w-full h-10 border border-gray-300 rounded-lg"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL</label>
//                                     <div className="flex gap-2">
//                                         <input
//                                             type="url"
//                                             value={selectedPage.heroImage}
//                                             onChange={(e) => updatePage({ ...selectedPage, heroImage: e.target.value })}
//                                             className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
//                                         />
//                                         <button
//                                             onClick={() => setShowImageGallery(true)}
//                                             className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//                                         >
//                                             Gallery
//                                         </button>
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
//                                     <input
//                                         type="text"
//                                         value={selectedPage.buttonText}
//                                         onChange={(e) => updatePage({ ...selectedPage, buttonText: e.target.value })}
//                                         className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                                     />
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">Button Color</label>
//                                         <input
//                                             type="color"
//                                             value={selectedPage.buttonColor}
//                                             onChange={(e) => updatePage({ ...selectedPage, buttonColor: e.target.value })}
//                                             className="w-full h-10 border border-gray-300 rounded-lg"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">Button Text Color</label>
//                                         <input
//                                             type="color"
//                                             value={selectedPage.buttonTextColor}
//                                             onChange={(e) => updatePage({ ...selectedPage, buttonTextColor: e.target.value })}
//                                             className="w-full h-10 border border-gray-300 rounded-lg"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Button Deeplink</label>
//                                     <input
//                                         type="text"
//                                         value={selectedPage.buttonDeeplink}
//                                         onChange={(e) => updatePage({ ...selectedPage, buttonDeeplink: e.target.value })}
//                                         className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                                     />
//                                 </div>

//                                 <div className="flex items-center gap-2">
//                                     <input
//                                         type="checkbox"
//                                         id="isActive"
//                                         checked={selectedPage.isActive}
//                                         onChange={(e) => updatePage({ ...selectedPage, isActive: e.target.checked })}
//                                         className="w-4 h-4"
//                                     />
//                                     <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
//                                         Page is Active (visible to Android app)
//                                     </label>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Horizontal Lists Editor */}
//                         <div className="bg-white rounded-lg shadow-lg p-6">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-lg font-bold text-gray-800">Horizontal Lists</h3>
//                                 <button
//                                     onClick={addHorizontalList}
//                                     className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-green-700"
//                                 >
//                                     <Plus size={16} />
//                                     Add List
//                                 </button>
//                             </div>

//                             <div className="space-y-4 max-h-96 overflow-y-auto">
//                                 {selectedPage.horizontalLists.map((list) => (
//                                     <div key={list.id} className="border border-gray-200 rounded-lg p-4">
//                                         <div className="flex justify-between items-center mb-3">
//                                             <input
//                                                 type="text"
//                                                 value={list.title}
//                                                 onChange={(e) => updateHorizontalList(list.id, { ...list, title: e.target.value })}
//                                                 className="font-medium border-none outline-none bg-transparent"
//                                             />
//                                             <button
//                                                 onClick={() => deleteHorizontalList(list.id)}
//                                                 className="text-red-600 hover:text-red-800"
//                                             >
//                                                 <Trash2 size={16} />
//                                             </button>
//                                         </div>
//                                         <input
//                                             type="text"
//                                             value={list.deeplink}
//                                             onChange={(e) => updateHorizontalList(list.id, { ...list, deeplink: e.target.value })}
//                                             className="font-medium border-none outline-none bg-transparent"
//                                         />

//                                         <div className="mb-3">
//                                             <label className="block text-xs text-gray-600 mb-1">Title Color</label>
//                                             <input
//                                                 type="color"
//                                                 value={list.titleColor}
//                                                 onChange={(e) => updateHorizontalList(list.id, { ...list, titleColor: e.target.value })}
//                                                 className="w-16 h-6 border border-gray-300 rounded"
//                                             />
//                                         </div>

//                                         <div className="flex flex-wrap gap-2 mb-3">
//                                             {list.images.map((image, index) => (
//                                                 <div key={index} className="relative">
//                                                     <img
//                                                         src={image}
//                                                         alt={`Item ${index + 1}`}
//                                                         className="w-16 h-16 object-cover rounded border"
//                                                     />
//                                                     <button
//                                                         onClick={() => removeImageFromList(list.id, index)}
//                                                         className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
//                                                     >
//                                                         ×
//                                                     </button>


//                                                 </div>
//                                             ))}
//                                             <button
//                                                 onClick={() => {
//                                                     const imageUrl = prompt('Enter image URL:');
//                                                     if (imageUrl) addImageToList(list.id, imageUrl);
//                                                 }}
//                                                 className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600"
//                                             >
//                                                 <Plus size={20} />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Android Preview */}
//                         <div className="bg-white rounded-lg shadow-lg p-6">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-lg font-bold flex items-center gap-2">
//                                     <Smartphone size={20} />
//                                     Android Preview
//                                 </h3>
//                             </div>
//                             <AndroidPreview page={selectedPage} />
//                         </div>
//                     </div>
//                 )}

//                 {/* Preview Modal */}
//                 {showPreview && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-screen overflow-y-auto">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-lg font-bold flex items-center gap-2">
//                                     <Smartphone size={20} />
//                                     Android Preview - {showPreview.name}
//                                 </h3>
//                                 <button
//                                     onClick={() => setShowPreview(false)}
//                                     className="text-gray-500 hover:text-gray-700 text-xl"
//                                 >
//                                     ×
//                                 </button>
//                             </div>
//                             <AndroidPreview page={showPreview} />
//                         </div>
//                     </div>
//                 )}

//                 {/* API Endpoints Modal */}
//                 {showAPIEndpoints && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-lg font-bold">API Documentation</h3>
//                                 <button
//                                     onClick={() => setShowAPIEndpoints(false)}
//                                     className="text-gray-500 hover:text-gray-700 text-xl"
//                                 >
//                                     ×
//                                 </button>
//                             </div>
//                             <APIEndpoints />
//                         </div>
//                     </div>
//                 )}

//                 {/* Image Gallery Modal */}
//                 {showImageGallery && <ImageGallery />}
//             </div>
//         </div>
//     );
// };

// export default AndroidPageDashboard;

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, Save, Download, Upload, Edit3, Server, Smartphone } from 'lucide-react';
import { base_url } from '../../../utils/base_url';

// Mock API service (replace with actual API calls)
const API_BASE_URL = `${base_url}/api`;

const apiService = {
    // Pages API
    getAllPages: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/pages/all`);
            const result = await response.json();
            return result.success ? result.data : [];
        } catch (error) {
            console.error('Error fetching pages:', error);
            return [];
        }
    },

    getPageById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/pages/${id}`);
            const result = await response.json();
            return result.success ? result.data : null;
        } catch (error) {
            console.error('Error fetching page:', error);
            return null;
        }
    },

    createPage: async (pageData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/pages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pageData)
            });
            const result = await response.json();
            return result.success ? result.data : null;
        } catch (error) {
            console.error('Error creating page:', error);
            return null;
        }
    },

    updatePage: async (id, pageData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/pages/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pageData)
            });
            const result = await response.json();
            return result.success ? result.data : null;
        } catch (error) {
            console.error('Error updating page:', error);
            return null;
        }
    },

    deletePage: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/pages/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('Error deleting page:', error);
            return false;
        }
    },

    togglePageStatus: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/pages/${id}/toggle`, {
                method: 'PATCH'
            });
            const result = await response.json();
            return result.success ? result.data : null;
        } catch (error) {
            console.error('Error toggling page status:', error);
            return null;
        }
    },

    // Images API
    uploadImage: async (file) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            const response = await fetch(`${API_BASE_URL}/images/upload`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            return result.success ? result.data : null;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    },

    getAllImages: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/images`);
            const result = await response.json();
            return result.success ? result.data : [];
        } catch (error) {
            console.error('Error fetching images:', error);
            return [];
        }
    },

    deleteImage: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/images/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('Error deleting image:', error);
            return false;
        }
    }
};

const AndroidPageDashboard = () => {
    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showAPIEndpoints, setShowAPIEndpoints] = useState(false);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [showImageGallery, setShowImageGallery] = useState(false);

    console.log("pages", pages)
    // Load pages on component mount
    useEffect(() => {
        loadPages();
        loadImages();
    }, []);

    const loadPages = async () => {
        setLoading(true);
        try {
            const pages = await apiService.getAllPages();
            setPages(pages);
        } catch (error) {
            console.error('Error loading pages:', error);
        }
        setLoading(false);
    };

    const loadImages = async () => {
        try {
            const images = await apiService.getAllImages();
            setImages(images);
        } catch (error) {
            console.error('Error loading images:', error);
        }
    };

    const createNewPage = async () => {
        const newPageData = {
            name: 'New Page',
            title: 'Page Title',
            titleColor: '#1F2937',
            backgroundColor: '#F9FAFB',
            buttonText: 'Action Button',
            buttonColor: '#3B82F6',
            buttonTextColor: '#FFFFFF',
            buttonDeeplink: '',
            heroImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
            horizontalLists: [],
            isActive: true
        };

        try {
            const newPage = await apiService.createPage(newPageData);
            if (newPage) {
                setPages([...pages, newPage]);
                setSelectedPage(newPage);
            }
        } catch (error) {
            console.error('Error creating page:', error);
            alert('Error creating page');
        }
    };

    const updatePage = async (updatedPage) => {
        try {
            const result = await apiService.updatePage(updatedPage._id, updatedPage);
            if (result) {
                const updatedPages = pages.map(page =>
                    page._id === updatedPage._id ? result : page
                );
                setPages(updatedPages);
                setSelectedPage(result);
            }
        } catch (error) {
            console.error('Error updating page:', error);
            alert('Error updating page');
        }
    };

    const deletePage = async (id) => {
        try {
            const success = await apiService.deletePage(id);
            if (success) {
                setPages(pages.filter(page => page._id !== id));
                if (selectedPage && selectedPage._id === id) {
                    setSelectedPage(null);
                }
            }
        } catch (error) {
            console.error('Error deleting page:', error);
            alert('Error deleting page');
        }
    };

    const togglePageStatus = async (id) => {
        try {
            const updatedPage = await apiService.togglePageStatus(id);
            if (updatedPage) {
                const updatedPages = pages.map(page =>
                    page._id === id ? updatedPage : page
                );
                setPages(updatedPages);
                if (selectedPage && selectedPage._id === id) {
                    setSelectedPage(updatedPage);
                }
            }
        } catch (error) {
            console.error('Error toggling page status:', error);
            alert('Error toggling page status');
        }
    };

    const addHorizontalList = () => {
        if (!selectedPage) return;
        const newList = {
            id: Date.now(),
            title: 'New List',
            titleColor: '#374151',
            images: []
        };
        const updatedPage = {
            ...selectedPage,
            horizontalLists: [...selectedPage.horizontalLists, newList]
        };
        updatePage(updatedPage);
    };

    const updateHorizontalList = (listId, updatedList) => {
        if (!selectedPage) return;
        const updatedPage = {
            ...selectedPage,
            horizontalLists: selectedPage.horizontalLists.map(list =>
                list.id === listId ? updatedList : list
            )
        };
        updatePage(updatedPage);
    };

    const deleteHorizontalList = (listId) => {
        if (!selectedPage) return;
        const updatedPage = {
            ...selectedPage,
            horizontalLists: selectedPage.horizontalLists.filter(list => list.id !== listId)
        };
        updatePage(updatedPage);
    };

    const addImageToList = (listId, imageUrl, deeplink = '') => {
        if (!selectedPage) return;

        const newImageObject = {
            url: imageUrl,
            deeplink: deeplink
        };

        const updatedPage = {
            ...selectedPage,
            horizontalLists: selectedPage.horizontalLists.map(list =>
                list.id === listId
                    ? { ...list, images: [...list.images, newImageObject] }
                    : list
            )
        };
        updatePage(updatedPage);
    };

    const updateImageInList = (listId, imageIndex, updatedImage) => {
        if (!selectedPage) return;
        const updatedPage = {
            ...selectedPage,
            horizontalLists: selectedPage.horizontalLists.map(list =>
                list.id === listId
                    ? {
                        ...list,
                        images: list.images.map((img, index) =>
                            index === imageIndex ? updatedImage : img
                        )
                    }
                    : list
            )
        };
        updatePage(updatedPage);
    };

    const removeImageFromList = (listId, imageIndex) => {
        if (!selectedPage) return;
        const updatedPage = {
            ...selectedPage,
            horizontalLists: selectedPage.horizontalLists.map(list =>
                list.id === listId
                    ? { ...list, images: list.images.filter((_, index) => index !== imageIndex) }
                    : list
            )
        };
        updatePage(updatedPage);
    };

    const downloadJSON = (page) => {
        const dataStr = JSON.stringify(page, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `${page.name.replace(/\s+/g, '_')}_page.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const AndroidPreview = ({ page }) => (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto">
            <div
                className="p-4"
                style={{ backgroundColor: page.backgroundColor }}
            >
                <h1
                    className="text-2xl font-bold mb-4 text-center"
                    style={{ color: page.titleColor }}
                >
                    {page.title}
                </h1>

                {page.heroImage && (
                    <img
                        src={page.heroImage}
                        alt="Hero"
                        className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                )}

                {page.horizontalLists.map((list) => (
                    <div key={list.id} className="mb-4">
                        <h3
                            className="text-lg font-semibold mb-2"
                            style={{ color: list.titleColor }}
                        >
                            {list.title}
                        </h3>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {list.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={`Item ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                />
                            ))}
                        </div>
                    </div>
                ))}

                <button
                    className="w-full py-3 rounded-lg font-semibold text-center mt-4"
                    style={{
                        backgroundColor: page.buttonColor,
                        color: page.buttonTextColor
                    }}
                >
                    {page.buttonText}
                </button>
            </div>
        </div>
    );

    const APIEndpoints = () => (
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm">
            <h3 className="text-lg font-bold mb-4 text-white">API Endpoints for Android</h3>

            <div className="space-y-4">
                <div>
                    <div className="text-blue-400 font-semibold">GET /api/pages</div>
                    <div className="text-gray-300 ml-4">Get all active pages</div>
                    <div className="text-yellow-400 ml-4">Response: Array of page objects</div>
                </div>

                <div>
                    <div className="text-blue-400 font-semibold">GET /api/pages/:id</div>
                    <div className="text-gray-300 ml-4">Get specific page by ID</div>
                    <div className="text-yellow-400 ml-4">Response: Page object</div>
                </div>

                <div>
                    <div className="text-blue-400 font-semibold">GET /api/images</div>
                    <div className="text-gray-300 ml-4">Get all uploaded images</div>
                    <div className="text-yellow-400 ml-4">Response: Array of image objects</div>
                </div>

                <div>
                    <div className="text-blue-400 font-semibold">GET /api/images/:filename</div>
                    <div className="text-gray-300 ml-4">Get specific image file</div>
                    <div className="text-yellow-400 ml-4">Response: Image file</div>
                </div>

                <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Example Response:</h4>
                    <pre className="bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                        {`{
  "_id": "12345",
  "name": "Home Offers",
  "title": "Special Offers",
  "titleColor": "#1F2937",
  "backgroundColor": "#F9FAFB",
  "buttonText": "Shop Now",
  "buttonColor": "#EF4444",
  "buttonTextColor": "#FFFFFF",
  "buttonDeeplink": "myapp://offers",
  "heroImage": "http://localhost:5000/api/images/hero1.jpg",
  "horizontalLists": [
    {
      "id": 1,
      "title": "Featured Products",
      "titleColor": "#374151",
      "images": [
        {
          "url": "http://localhost:5000/api/images/product1.jpg",
          "deeplink": "myapp://product/1"
        },
        {
          "url": "http://localhost:5000/api/images/product2.jpg",
          "deeplink": "myapp://product/2"
        }
      ]
    }
  ],
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}`}
                    </pre>
                </div>
            </div>
        </div>
    );

    const ImageGallery = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Image Gallery</h3>
                    <button
                        onClick={() => setShowImageGallery(false)}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ×
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image) => (
                        <div key={image._id} className="relative group">
                            <img
                                src={image.url}
                                alt={image.filename}
                                className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-75"
                                onClick={() => {
                                    navigator.clipboard.writeText(image.url);
                                    alert('Image URL copied to clipboard!');
                                }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg">
                                <span className="text-white text-xs">Click to copy URL</span>
                            </div>
                            <button
                                onClick={async () => {
                                    if (confirm('Are you sure you want to delete this image?')) {
                                        const success = await apiService.deleteImage(image._id);
                                        if (success) {
                                            setImages(images.filter(img => img._id !== image._id));
                                        }
                                    }
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-semibold mb-2">Upload New Image</h4>
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                try {
                                    const uploadedImage = await apiService.uploadImage(file);
                                    if (uploadedImage) {
                                        setImages([uploadedImage, ...images]);
                                        alert('Image uploaded successfully!');
                                        e.target.value = ''; // Reset input
                                    }
                                } catch (error) {
                                    console.error('Upload error:', error);
                                    alert('Error uploading image');
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Android Page Dashboard</h1>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowImageGallery(true)}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
                            >
                                <Upload size={20} />
                                Image Gallery
                            </button>
                            <button
                                onClick={() => setShowAPIEndpoints(true)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
                            >
                                <Server size={20} />
                                API Endpoints
                            </button>
                            <button
                                onClick={createNewPage}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                            >
                                <Plus size={20} />
                                Create New Page
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">Loading pages...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            {pages.map((page) => (
                                <div
                                    key={page._id}
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPage?._id === page._id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    onClick={() => setSelectedPage(page)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-gray-800">{page.name}</h3>
                                        <div className={`px-2 py-1 rounded text-xs ${page.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {page.isActive ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{page.title}</p>
                                    <div className="text-xs text-gray-500 mb-3">
                                        Updated: {new Date(page.updatedAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex gap-2 justify-between">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowPreview(page);
                                                }}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    downloadJSON(page);
                                                }}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                <Download size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deletePage(page._id);
                                                }}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePageStatus(page._id);
                                            }}
                                            className={`text-sm px-2 py-1 rounded ${page.isActive
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                        >
                                            {page.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedPage && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Page Editor */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Page: {selectedPage.name}</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Name</label>
                                    <input
                                        type="text"
                                        value={selectedPage.name}
                                        onChange={(e) => updatePage({ ...selectedPage, name: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={selectedPage.title}
                                        onChange={(e) => updatePage({ ...selectedPage, title: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title Color</label>
                                        <input
                                            type="color"
                                            value={selectedPage.titleColor}
                                            onChange={(e) => updatePage({ ...selectedPage, titleColor: e.target.value })}
                                            className="w-full h-10 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                                        <input
                                            type="color"
                                            value={selectedPage.backgroundColor}
                                            onChange={(e) => updatePage({ ...selectedPage, backgroundColor: e.target.value })}
                                            className="w-full h-10 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            value={selectedPage.heroImage}
                                            onChange={(e) => updatePage({ ...selectedPage, heroImage: e.target.value })}
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                                        />
                                        <button
                                            onClick={() => setShowImageGallery(true)}
                                            className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                        >
                                            Gallery
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image Deeplink</label>
                                    <input
                                        type="text"
                                        value={selectedPage.heroImageDeeplink}
                                        onChange={(e) => updatePage({ ...selectedPage, heroImageDeeplink: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                                    <input
                                        type="text"
                                        value={selectedPage.buttonText}
                                        onChange={(e) => updatePage({ ...selectedPage, buttonText: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Button Color</label>
                                        <input
                                            type="color"
                                            value={selectedPage.buttonColor}
                                            onChange={(e) => updatePage({ ...selectedPage, buttonColor: e.target.value })}
                                            className="w-full h-10 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Button Text Color</label>
                                        <input
                                            type="color"
                                            value={selectedPage.buttonTextColor}
                                            onChange={(e) => updatePage({ ...selectedPage, buttonTextColor: e.target.value })}
                                            className="w-full h-10 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Deeplink</label>
                                    <input
                                        type="text"
                                        value={selectedPage.buttonDeeplink}
                                        onChange={(e) => updatePage({ ...selectedPage, buttonDeeplink: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    />
                                </div>
                                

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={selectedPage.isActive}
                                        onChange={(e) => updatePage({ ...selectedPage, isActive: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                        Page is Active (visible to Android app)
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Horizontal Lists Editor */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Horizontal Lists</h3>
                                <button
                                    onClick={addHorizontalList}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-green-700"
                                >
                                    <Plus size={16} />
                                    Add List
                                </button>
                            </div>

                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {selectedPage.horizontalLists.map((list) => (
                                    <div key={list.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <input
                                                type="text"
                                                value={list.title}
                                                onChange={(e) => updateHorizontalList(list.id, { ...list, title: e.target.value })}
                                                className="font-medium border-none outline-none bg-transparent"
                                            />
                                            <button
                                                onClick={() => deleteHorizontalList(list.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="mb-3">
                                            <label className="block text-xs text-gray-600 mb-1">Title Color</label>
                                            <input
                                                type="color"
                                                value={list.titleColor}
                                                onChange={(e) => updateHorizontalList(list.id, { ...list, titleColor: e.target.value })}
                                                className="w-16 h-6 border border-gray-300 rounded"
                                            />
                                        </div>

                                        <div className="space-y-2 mb-3">
                                            {list.images.map((image, index) => (
                                                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                    <img
                                                        src={image.url}
                                                        alt={`Item ${index + 1}`}
                                                        className="w-12 h-12 object-cover rounded border"
                                                    />
                                                    <div className="flex-1 space-y-1">
                                                        <input
                                                            type="url"
                                                            value={image.url}
                                                            onChange={(e) => updateImageInList(list.id, index, { ...image, url: e.target.value })}
                                                            placeholder="Image URL"
                                                            className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={image.deeplink || ''}
                                                            onChange={(e) => updateImageInList(list.id, index, { ...image, deeplink: e.target.value })}
                                                            placeholder="Deeplink (optional)"
                                                            className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => removeImageFromList(list.id, index)}
                                                        className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => {
                                                    const imageUrl = prompt('Enter image URL:');
                                                    const deeplink = prompt('Enter deeplink (optional):') || '';
                                                    if (imageUrl) addImageToList(list.id, imageUrl, deeplink);
                                                }}
                                                className="w-full h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600"
                                            >
                                                <Plus size={20} />
                                                <span className="ml-2 text-sm">Add Image</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Android Preview */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Smartphone size={20} />
                                    Android Preview
                                </h3>
                            </div>
                            <AndroidPreview page={selectedPage} />
                        </div>
                    </div>
                )}

                {/* Preview Modal */}
                {showPreview && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-screen overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Smartphone size={20} />
                                    Android Preview - {showPreview.name}
                                </h3>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="text-gray-500 hover:text-gray-700 text-xl"
                                >
                                    ×
                                </button>
                            </div>
                            <AndroidPreview page={showPreview} />
                        </div>
                    </div>
                )}

                {/* API Endpoints Modal */}
                {showAPIEndpoints && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">API Documentation</h3>
                                <button
                                    onClick={() => setShowAPIEndpoints(false)}
                                    className="text-gray-500 hover:text-gray-700 text-xl"
                                >
                                    ×
                                </button>
                            </div>
                            <APIEndpoints />
                        </div>
                    </div>
                )}

                {/* Image Gallery Modal */}
                {showImageGallery && <ImageGallery />}
            </div>
        </div>
    );
};

export default AndroidPageDashboard;