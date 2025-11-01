import React, { useState, useEffect } from 'react';
import { Upload, Save, Eye, Code, Plus, Trash2, GripVertical, Image, Tag, Loader, AlertCircle } from 'lucide-react';
import { base_url } from '../../utils/base_url';

// Configuration
const BASE_URL = `${base_url}/api/bottomnav/new`; // Change this to your server URL
const APP_ID = 'com.example.app'; // Your app identifier

const BottomNavDashboardNew = () => {
  const [navItems, setNavItems] = useState([]);
  const [styling, setStyling] = useState({
    backgroundColor: '#FFFFFF',
    selectedColor: '#6200EE',
    unselectedColor: '#757575',
    elevation: 8,
    cornerRadius: 0,
    iconSize: 22,
    labelVisibility: 'labeled',
    strokeWidth: 0
  });

  const [activeTab, setActiveTab] = useState('items');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState(null);
  const [configExists, setConfigExists] = useState(false);

  // Load configuration on mount
  useEffect(() => {
    loadConfig();
  }, []);

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Load configuration from backend
  const loadConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/config/${APP_ID}`);
      const data = await response.json();

      if (data.success) {
        setNavItems(data.data.bottomNavigation.items);
        setStyling(data.data.bottomNavigation.styling);
        setConfigExists(true);
        showNotification('Configuration loaded successfully');
      } else {
        // No config exists, use default values
        setDefaultConfig();
        setConfigExists(false);
      }
    } catch (error) {
      console.error('Error loading config:', error);
      setDefaultConfig();
      setConfigExists(false);
      showNotification('Using default configuration', 'info');
    } finally {
      setLoading(false);
    }
  };

  // Set default configuration
  const setDefaultConfig = () => {
    setNavItems([]);
  };

  // Upload image to AWS S3
  const uploadImageToAWS = async (file) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${BASE_URL}/upload/image`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Image uploaded successfully');
        return data.data.url; // Return the S3 URL
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification('Failed to upload image', 'error');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle image file selection
  const handleImageUpload = async (itemId, type, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification('Please select an image file', 'error');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image size should be less than 5MB', 'error');
      return;
    }

    const imageUrl = await uploadImageToAWS(file);
    if (imageUrl) {
      if (type === 'icon' || type === 'selectedIcon') {
        handleUpdateItem(itemId, type, imageUrl);
      } else if (type === 'bannerImage') {
        handleUpdateItem(itemId, 'bannerImage', imageUrl);
      }
    }
  };

  // Save configuration to backend
  const saveConfiguration = async () => {
    setLoading(true);
    try {
      const payload = {
        appId: APP_ID,
        appName: 'My App',
        bottomNavigation: {
          items: navItems,
          styling: styling
        }
      };

      const url = configExists
        ? `${BASE_URL}/config/${APP_ID}`
        : `${BASE_URL}/config`;

      const method = configExists ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setConfigExists(true);
        showNotification('Configuration saved successfully');
      } else {
        throw new Error(data.message || 'Save failed');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      showNotification('Failed to save configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNormalItem = () => {
    const newItem = {
      id: `nav_${Date.now()}`,
      title: 'New Item',
      icon: 'https://cdn-icons-png.flaticon.com/512/3024/3024593.png',
      selectedIcon: 'https://cdn-icons-png.flaticon.com/512/3024/3024605.png',
      route: 'NewFragment',
      order: navItems.length,
      type: 'normal',
      isActive: true
    };
    setNavItems([...navItems, newItem]);
  };

  const handleAddPromoItem = () => {
    const newItem = {
      id: `promo_${Date.now()}`,
      title: 'Promotion',
      bannerImage: 'https://via.placeholder.com/200x60/FF6B6B/FFFFFF?text=Promo',
      route: 'PromoFragment',
      order: navItems.length,
      type: 'promotional',
      isActive: true,
      promoConfig: {
        backgroundColor: '#FF6B6B',
        cornerRadius: 12,
        width: 'auto',
        height: 40,
        marginTop: -20
      }
    };
    setNavItems([...navItems, newItem]);
  };

  const handleDeleteItem = (id) => {
    setNavItems(navItems.filter(item => item.id !== id));
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
  };

  const handleUpdateItem = (id, field, value) => {
    setNavItems(navItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleUpdatePromoConfig = (id, field, value) => {
    setNavItems(navItems.map(item =>
      item.id === id ? {
        ...item,
        promoConfig: { ...item.promoConfig, [field]: value }
      } : item
    ));
  };

  const handleStylingChange = (field, value) => {
    setStyling({ ...styling, [field]: value });
  };

  const generateJSON = () => {
    return {
      bottomNavigation: {
        items: navItems.sort((a, b) => a.order - b.order),
        styling: styling
      }
    };
  };

  const generateKotlinCode = () => {
    const json = generateJSON();
    return `// Sample JSON Configuration
val jsonConfig = """
${JSON.stringify(json, null, 2)}
"""

// Usage in Activity
class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private lateinit var viewModel: BottomNavViewModel
    private lateinit var bottomNav: DynamicBottomNavigationView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupBottomNavigation()
        setupObservers()
        viewModel.loadConfig()
    }
    
    private fun setupBottomNavigation() {
        bottomNav = DynamicBottomNavigationView(this)
        binding.bottomNavigationContainer.addView(bottomNav)
    }
    
    private fun setupObservers() {
        viewModel.config.observe(this) { config ->
            config?.let {
                bottomNav.setupWithConfig(it) { navItem ->
                    handleNavigation(navItem)
                }
            }
        }
    }
}`;
  };

  const downloadJSON = () => {
    const json = generateJSON();
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bottom_nav_config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadKotlin = () => {
    const code = generateKotlinCode();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MainActivity_Implementation.kt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderNormalItemEditor = (item) => (
    <div className="bg-white rounded-lg p-4 space-y-3 border-2 border-gray-200 hover:border-purple-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <GripVertical size={20} className="text-gray-400 cursor-move" />
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <Tag size={14} />
            Normal
          </div>
          <input
            type="text"
            value={item.title}
            onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
            className="font-semibold px-3 py-1 border rounded-lg flex-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Item title"
          />
        </div>
        <button
          onClick={() => handleDeleteItem(item.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Icon</label>
          <input
            type="text"
            value={item.icon}
            onChange={(e) => handleUpdateItem(item.id, 'icon', e.target.value)}
            className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-2"
            placeholder="https://..."
          />
          <div className="flex gap-2">
            <label className="flex-1 cursor-pointer">
              <div className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                <Upload size={16} className="text-purple-600" />
                <span className="text-xs text-purple-600 font-medium">Upload</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(item.id, 'icon', e)}
                className="hidden"
                disabled={uploadingImage}
              />
            </label>
            {item.icon && (
              <img src={item.icon} alt="icon" className="w-10 h-10 border rounded p-1" />
            )}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Selected Icon</label>
          <input
            type="text"
            value={item.selectedIcon}
            onChange={(e) => handleUpdateItem(item.id, 'selectedIcon', e.target.value)}
            className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-2"
            placeholder="https://..."
          />
          <div className="flex gap-2">
            <label className="flex-1 cursor-pointer">
              <div className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                <Upload size={16} className="text-purple-600" />
                <span className="text-xs text-purple-600 font-medium">Upload</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(item.id, 'selectedIcon', e)}
                className="hidden"
                disabled={uploadingImage}
              />
            </label>
            {item.selectedIcon && (
              <img src={item.selectedIcon} alt="selected" className="w-10 h-10 border rounded p-1" />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Route/Fragment</label>
          <input
            type="text"
            value={item.route}
            onChange={(e) => handleUpdateItem(item.id, 'route', e.target.value)}
            className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="HomeFragment"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Order Position</label>
          <input
            type="number"
            value={item.order}
            onChange={(e) => handleUpdateItem(item.id, 'order', parseInt(e.target.value))}
            className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderPromoItemEditor = (item) => (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 space-y-3 border-2 border-purple-200 hover:border-purple-400 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <GripVertical size={20} className="text-purple-400 cursor-move" />
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-medium">
            <Image size={14} />
            Promotional
          </div>
          <input
            type="text"
            value={item.title}
            onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
            className="font-semibold px-3 py-1 border rounded-lg flex-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Promo title"
          />
        </div>
        <button
          onClick={() => handleDeleteItem(item.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">Banner Image</label>
        <input
          type="text"
          value={item.bannerImage}
          onChange={(e) => handleUpdateItem(item.id, 'bannerImage', e.target.value)}
          className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-2"
          placeholder="https://..."
        />
        <div className="flex gap-2 items-center">
          <label className="flex-1 cursor-pointer">
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Upload size={16} />
              <span className="text-sm font-medium">Upload Banner</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(item.id, 'bannerImage', e)}
              className="hidden"
              disabled={uploadingImage}
            />
          </label>
        </div>
        {item.bannerImage && (
          <img src={item.bannerImage} alt="banner" className="w-full h-16 mt-2 border rounded-lg object-cover" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Route/Fragment</label>
          <input
            type="text"
            value={item.route}
            onChange={(e) => handleUpdateItem(item.id, 'route', e.target.value)}
            className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Order Position</label>
          <input
            type="number"
            value={item.order}
            onChange={(e) => handleUpdateItem(item.id, 'order', parseInt(e.target.value))}
            className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {item.promoConfig && (
        <div className="bg-white bg-opacity-60 rounded-lg p-3 space-y-3">
          <h4 className="text-xs font-semibold text-gray-700 uppercase">Promo Styling</h4>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Background</label>
              <input
                type="color"
                value={item.promoConfig.backgroundColor}
                onChange={(e) => handleUpdatePromoConfig(item.id, 'backgroundColor', e.target.value)}
                className="w-full h-10 rounded border cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Corner Radius</label>
              <input
                type="number"
                value={item.promoConfig.cornerRadius}
                onChange={(e) => handleUpdatePromoConfig(item.id, 'cornerRadius', parseInt(e.target.value))}
                className="w-full text-sm px-2 py-1 border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Height (dp)</label>
              <input
                type="number"
                value={item.promoConfig.height}
                onChange={(e) => handleUpdatePromoConfig(item.id, 'height', parseInt(e.target.value))}
                className="w-full text-sm px-2 py-1 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Margin Top (dp)</label>
            <input
              type="number"
              value={item.promoConfig.marginTop}
              onChange={(e) => handleUpdatePromoConfig(item.id, 'marginTop', parseInt(e.target.value))}
              className="w-full text-sm px-2 py-1 border rounded"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Margin Right (dp)</label>
            <input
              type="number"
              value={item.promoConfig.marginRight}
              onChange={(e) => handleUpdatePromoConfig(item.id, 'marginRight', parseInt(e.target.value))}
              className="w-full text-sm px-2 py-1 border rounded"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-500' :
            notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          } text-white`}>
          <AlertCircle size={20} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {(loading || uploadingImage) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3">
            <Loader className="animate-spin text-purple-600" size={32} />
            <p className="text-gray-700 font-medium">
              {uploadingImage ? 'Uploading image to AWS S3...' : 'Loading...'}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">🚀 Dynamic Bottom Navigation Builder</h1>
                <p className="text-purple-100">RecyclerView-based with AWS S3 image storage</p>
              </div>
              <button
                onClick={saveConfiguration}
                disabled={loading}
                className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors font-semibold shadow-lg disabled:opacity-50"
              >
                <Save size={20} />
                Save to Backend
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Left Panel - Configuration */}
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex gap-2 border-b">
                <button
                  onClick={() => setActiveTab('items')}
                  className={`px-4 py-2 font-medium transition-colors ${activeTab === 'items'
                      ? 'border-b-2 border-purple-600 text-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Navigation Items
                </button>
                <button
                  onClick={() => setActiveTab('styling')}
                  className={`px-4 py-2 font-medium transition-colors ${activeTab === 'styling'
                      ? 'border-b-2 border-purple-600 text-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Styling
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-4 py-2 font-medium transition-colors ${activeTab === 'code'
                      ? 'border-b-2 border-purple-600 text-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Export
                </button>
              </div>

              {/* Items Tab */}
              {activeTab === 'items' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAddNormalItem}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <Plus size={20} />
                      Add Normal Item
                    </button>
                    <button
                      onClick={handleAddPromoItem}
                      className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
                    >
                      <Image size={20} />
                      Add Promo Banner
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {navItems.sort((a, b) => a.order - b.order).map((item) => (
                      <div key={item.id}>
                        {item.type === 'promotional'
                          ? renderPromoItemEditor(item)
                          : renderNormalItemEditor(item)
                        }
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Styling Tab */}
              {activeTab === 'styling' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Background Color</label>
                      <input
                        type="color"
                        value={styling.backgroundColor}
                        onChange={(e) => handleStylingChange('backgroundColor', e.target.value)}
                        className="w-full h-10 rounded border cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Selected Color</label>
                      <input
                        type="color"
                        value={styling.selectedColor}
                        onChange={(e) => handleStylingChange('selectedColor', e.target.value)}
                        className="w-full h-10 rounded border cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Unselected Color</label>
                      <input
                        type="color"
                        value={styling.unselectedColor}
                        onChange={(e) => handleStylingChange('unselectedColor', e.target.value)}
                        className="w-full h-10 rounded border cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Icon Size (dp)</label>
                      <input
                        type="number"
                        value={styling.iconSize}
                        onChange={(e) => handleStylingChange('iconSize', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Elevation</label>
                      <input
                        type="number"
                        value={styling.elevation}
                        onChange={(e) => handleStylingChange('elevation', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Corner Radius</label>
                      <input
                        type="number"
                        value={styling.cornerRadius}
                        onChange={(e) => handleStylingChange('cornerRadius', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Label Visibility</label>
                    <select
                      value={styling.labelVisibility}
                      onChange={(e) => handleStylingChange('labelVisibility', e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="labeled">Always Show Labels</option>
                      <option value="selected">Show Only Selected</option>
                      <option value="unlabeled">Hide All Labels</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Code Tab */}
              {activeTab === 'code' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Code size={20} />
                      JSON Configuration
                    </h3>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-96 font-mono">
                      {JSON.stringify(generateJSON(), null, 2)}
                    </pre>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={downloadJSON}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <Save size={18} />
                      Download JSON
                    </button>
                    <button
                      onClick={downloadKotlin}
                      className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
                    >
                      <Code size={18} />
                      Download Kotlin
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Live Preview */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 sticky top-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Eye size={20} />
                  Live Preview
                </h3>

                {/* Mobile Preview */}
                <div className="bg-white rounded-2xl shadow-2xl mx-auto overflow-hidden" style={{ maxWidth: '375px' }}>
                  {/* Screen Content */}
                  <div className="h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <p className="text-sm font-medium">Your app content here</p>
                      <p className="text-xs mt-2">Bottom navigation below</p>
                    </div>
                  </div>

                  {/* Bottom Navigation RecyclerView Simulation */}
                  <div
                    className="relative flex items-stretch border-t"
                    style={{
                      backgroundColor: styling.backgroundColor,
                      boxShadow: `0 -${styling.elevation}px ${styling.elevation * 2}px rgba(0,0,0,0.1)`
                    }}
                  >
                    {navItems.sort((a, b) => a.order - b.order).map((item, index) => {
                      if (item.type === 'promotional') {
                        return (
                          <div
                            key={item.id}
                            className="px-2 py-2 flex items-center"
                            style={{
                              marginTop: item.promoConfig?.marginTop || 0,
                              marginRight: item.promoConfig?.marginRight || 0
                            }}
                          >
                            <div
                              className="overflow-hidden shadow-lg"
                              style={{
                                backgroundColor: item.promoConfig?.backgroundColor || '#8B5CF6',
                                borderRadius: item.promoConfig?.cornerRadius || 12,
                                height: item.promoConfig?.height || 40,
                                minWidth: '120px'
                              }}
                            >
                              <img
                                src={item.bannerImage}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={item.id}
                          className="flex-1 flex flex-col items-center justify-center py-2 cursor-pointer transition-all"
                          style={{
                            color: index === 0 ? styling.selectedColor : styling.unselectedColor
                          }}
                        >
                          <img
                            src={index === 0 ? item.selectedIcon : item.icon}
                            alt={item.title}
                            style={{
                              width: styling.iconSize,
                              height: styling.iconSize
                            }}
                            className="mb-1"
                          />
                          {styling.labelVisibility !== 'unlabeled' && (
                            <span className="text-xs font-medium px-1 text-center">
                              {item.title}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>💡 Tip:</strong> Upload images to AWS S3 for persistent storage. Images are automatically uploaded when you select a file.
                  </p>
                </div>

                <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-xs text-purple-800">
                    <strong>🔧 Backend:</strong> Configuration is synced with MongoDB. Click "Save to Backend" to persist changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavDashboardNew;