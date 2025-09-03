import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, Eye, EyeOff, Save, X, Upload, Link } from 'lucide-react';
import { base_url } from '../../../utils/base_url';

const DynamicPageDashboard = () => {
  const [pages, setPages] = useState([]);
  const [listOptions, setListOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    titleColor: '#1F2937',
    backgroundColor: '#F9FAFB',
    buttonText: 'Action Button',
    buttonColor: '#3B82F6',
    buttonTextColor: '#FFFFFF',
    buttonDeeplink: '',
    heroImage: '',
    heroImageDeeplink: '',
    lists: [],
    isActive: true
  });

  // Fetch pages and list options on component mount
  useEffect(() => {
    fetchPages();
    fetchListOptions();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch(`${base_url}/api/pages/dynamic/pages`);
      const result = await response.json();
      if (result.success) {
        setPages(result.data);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  const fetchListOptions = async () => {
    try {
      const response = await fetch(`${base_url}/api/pages/dynamic/list-options`);
      const result = await response.json();
      if (result.success) {
        setListOptions(result.data);
      }
    } catch (error) {
      console.error('Error fetching list options:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (file, field) => {
    setUploadingImage(true);
    
    // Simulate AWS S3 upload - replace with actual AWS SDK implementation
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    
    try {
      // Replace this with your actual AWS upload endpoint
      const response = await fetch(`${base_url}/upload/imageUpload`, {
        method: 'POST',
        body: formDataUpload
      });
      
      const result = await response.json();
      if (result.success) {
        handleInputChange(field, result.imageUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddList = () => {
    const newList = {
      id: Date.now(),
      type: 'vertical',
      listOptions: ''
    };
    
    setFormData(prev => ({
      ...prev,
      lists: [...prev.lists, newList]
    }));
  };

  const handleListChange = (index, field, value) => {
    const updatedLists = [...formData.lists];
    updatedLists[index][field] = value;
    setFormData(prev => ({
      ...prev,
      lists: updatedLists
    }));
  };

  const handleRemoveList = (index) => {
    const updatedLists = formData.lists.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      lists: updatedLists
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingPage ? `${base_url}/api/pages/dynamic/pages/${editingPage._id}` : `${base_url}/api/pages/dynamic/pages`;
      const method = editingPage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert(editingPage ? 'Page updated successfully!' : 'Page created successfully!');
        setShowModal(false);
        resetForm();
        fetchPages();
      } else {
        alert(result.message || 'Error saving page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      name: page.name,
      title: page.title,
      titleColor: page.titleColor,
      backgroundColor: page.backgroundColor,
      buttonText: page.buttonText,
      buttonColor: page.buttonColor,
      buttonTextColor: page.buttonTextColor,
      buttonDeeplink: page.buttonDeeplink || '',
      heroImage: page.heroImage || '',
      heroImageDeeplink: page.heroImageDeeplink || '',
      lists: page.lists.map(list => ({
        ...list,
        listOptions: list.listOptions?._id || ''
      })),
      isActive: page.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const response = await fetch(`${base_url}/api/pages/dynamic/pages/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        alert('Page deleted successfully!');
        fetchPages();
      } else {
        alert(result.message || 'Error deleting page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Error deleting page');
    }
  };

  const togglePageStatus = async (id) => {
    try {
      const response = await fetch(`${base_url}/api/pages/dynamic/${id}/toggle-status`, {
        method: 'PATCH'
      });

      const result = await response.json();
      if (result.success) {
        fetchPages();
      } else {
        alert(result.message || 'Error updating page status');
      }
    } catch (error) {
      console.error('Error toggling page status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      titleColor: '#1F2937',
      backgroundColor: '#F9FAFB',
      buttonText: 'Action Button',
      buttonColor: '#3B82F6',
      buttonTextColor: '#FFFFFF',
      buttonDeeplink: '',
      heroImage: '',
      heroImageDeeplink: '',
      lists: [],
      isActive: true
    });
    setEditingPage(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dynamic Pages Dashboard</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <PlusCircle size={20} />
            Create New Page
          </button>
        </div>

        {/* Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div key={page._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {page.heroImage && (
                <img
                  src={page.heroImage}
                  alt={page.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{page.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    page.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {page.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">Name: {page.name}</p>
                <p className="text-gray-600 mb-4">Lists: {page.lists?.length || 0}</p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(page)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => togglePageStatus(page._id)}
                    className={`flex-1 px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition-colors ${
                      page.isActive
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {page.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                    {page.isActive ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleDelete(page._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingPage ? 'Edit Page' : 'Create New Page'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title Color
                      </label>
                      <input
                        type="color"
                        value={formData.titleColor}
                        onChange={(e) => handleInputChange('titleColor', e.target.value)}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Color
                      </label>
                      <input
                        type="color"
                        value={formData.backgroundColor}
                        onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Button Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={formData.buttonText}
                        onChange={(e) => handleInputChange('buttonText', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Color
                      </label>
                      <input
                        type="color"
                        value={formData.buttonColor}
                        onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text Color
                      </label>
                      <input
                        type="color"
                        value={formData.buttonTextColor}
                        onChange={(e) => handleInputChange('buttonTextColor', e.target.value)}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Deep Links */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Deep Link
                      </label>
                      <input
                        type="url"
                        value={formData.buttonDeeplink}
                        onChange={(e) => handleInputChange('buttonDeeplink', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hero Image Deep Link
                      </label>
                      <input
                        type="url"
                        value={formData.heroImageDeeplink}
                        onChange={(e) => handleInputChange('heroImageDeeplink', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  {/* Hero Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Image
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="url"
                        value={formData.heroImage}
                        onChange={(e) => handleInputChange('heroImage', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter image URL or upload"
                      />
                      <label className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors">
                        <Upload size={20} />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'heroImage')}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                    {formData.heroImage && (
                      <img
                        src={formData.heroImage}
                        alt="Hero preview"
                        className="mt-2 h-32 w-48 object-cover rounded-lg border"
                      />
                    )}
                  </div>

                  {/* Lists Section */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Lists</h3>
                      <button
                        type="button"
                        onClick={handleAddList}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                      >
                        <PlusCircle size={16} />
                        Add List
                      </button>
                    </div>

                    {formData.lists.map((list, index) => (
                      <div key={list.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-800">List {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => handleRemoveList(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              List Type
                            </label>
                            <select
                              value={list.type}
                              onChange={(e) => handleListChange(index, 'type', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="vertical">Vertical</option>
                              <option value="horizontal">Horizontal</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              List Options
                            </label>
                            <select
                              value={list.listOptions}
                              onChange={(e) => handleListChange(index, 'listOptions', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select List Option</option>
                              {listOptions.map((option) => (
                                <option key={option._id} value={option._id}>
                                  {option.listName} ({option.listPurpose})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Active
                    </label>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading || uploadingImage}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Save size={20} />
                      {loading ? 'Saving...' : (editingPage ? 'Update Page' : 'Create Page')}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {pages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <PlusCircle size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No pages created yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first dynamic page.</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Create Your First Page
            </button>
          </div>
        )}

        {/* Loading State */}
        {uploadingImage && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Uploading image...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicPageDashboard;