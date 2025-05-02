import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Bell, Send, Users, Edit, Trash, Plus, Zap, Filter, Eye, Play, Clock } from 'lucide-react';

// Main Dashboard Component
const NotificationDashboard = () => {
    const [activeTab, setActiveTab] = useState('templates');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            // This would be replaced with your actual API endpoint
            const response = await fetch('/api/notifications/admin/stats');
            const data = await response.json();

            if (data.success) {
                setStats(data.stats);
            } else {
                setError(data.message || 'Failed to fetch notification stats');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Scheduled Notifications</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
                    <Plus size={16} className="mr-1" />
                    New Schedule
                </button>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Template
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Schedule
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Next Run
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Recipients
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {scheduledNotifications.map((notification) => (
                            <tr key={notification.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{notification.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {new Date(notification.sentAt).toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{notification.templateName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{notification.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {notification.recipientCount} users
                                        {notification.recipientType && ` (${notification.recipientType})`}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${notification.status === 'Sent' ? 'bg-green-100 text-green-800' :
                                            notification.status === 'Failed' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {notification.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))
            )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    Showing most recent 20 notifications
                </div>

                <div className="flex">
                    <button className="px-3 py-1 border rounded-l bg-white text-gray-600">
                        Previous
                    </button>
                    <button className="px-3 py-1 border-t border-b border-r rounded-r bg-blue-500 text-white">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationDashboard; 

// Dashboard Stats Component
const DashboardStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
                <p className="text-2xl font-bold">{stats.activeUserCount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Users with notification tokens</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Templates</h3>
                <p className="text-2xl font-bold">{stats.templateCount}</p>
                <p className="text-xs text-gray-500">Total notification templates</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Price Alerts</h3>
                <p className="text-2xl font-bold">
                    {stats.userPreferences?.priceAlertsEnabled || 0}
                    <span className="text-sm ml-1 text-gray-500">users</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${((stats.userPreferences?.priceAlertsEnabled || 0) / (stats.userPreferences?.totalUsers || 1)) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Daily Digest</h3>
                <p className="text-2xl font-bold">
                    {stats.userPreferences?.dailyDigestEnabled || 0}
                    <span className="text-sm ml-1 text-gray-500">users</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${((stats.userPreferences?.dailyDigestEnabled || 0) / (stats.userPreferences?.totalUsers || 1)) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

// Templates Tab Component
const TemplatesTab = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddTemplate, setShowAddTemplate] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            // This would be replaced with your actual API endpoint
            const response = await fetch('/api/notifications/admin/templates');
            const data = await response.json();

            if (data.success) {
                setTemplates(data.templates);
            } else {
                setError(data.message || 'Failed to fetch templates');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to fetch templates:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditTemplate = (template) => {
        setSelectedTemplate(template);
        setShowAddTemplate(true);
    };

    const handleDeleteTemplate = async (id) => {
        if (!confirm('Are you sure you want to delete this template?')) {
            return;
        }

        try {
            const response = await fetch(`/api/notifications/admin/templates/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                setTemplates(templates.filter(t => t._id !== id));
            } else {
                setError(data.message || 'Failed to delete template');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to delete template:', err);
        }
    };

    return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Send Notifications</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">1. Select Template</h3>
          
          {loading ? (
            <div className="text-center py-4">Loading templates...</div>
          ) : (
            <div className="border rounded overflow-hidden">
              <div className="bg-gray-50 p-3 border-b">
                <select 
                  className="w-full p-2 border rounded"
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  value={selectedTemplate?._id || ''}
                >
                  <option value="">-- Select a template --</option>
                  {templates.map(template => (
                    <option key={template._id} value={template._id}>
                      {template.name} - {template.title}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedTemplate && (
                <div className="p-3">
                  <h4 className="font-medium">{selectedTemplate.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{selectedTemplate.body}</p>
                  
                  {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium">Variables</h5>
                      
                      <div className="flex mb-2 mt-2">
                        <select
                          value={variableKey}
                          onChange={(e) => setVariableKey(e.target.value)}
                          className="w-1/3 p-2 border rounded-l"
                        >
                          <option value="">-- Select variable --</option>
                          {selectedTemplate.variables.map(variable => (
                            <option key={variable} value={variable}>
                              {variable}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={variableValue}
                          onChange={(e) => setVariableValue(e.target.value)}
                          className="w-2/3 p-2 border-t border-b border-r rounded-r"
                          placeholder="Value"
                        />
                        <button
                          type="button"
                          onClick={addVariable}
                          className="ml-2 bg-blue-500 text-white p-2 rounded"
                        >
                          Set
                        </button>
                      </div>
                      
                      {Object.keys(formData.variables).length > 0 && (
                        <div className="bg-gray-50 p-2 rounded border mb-2">
                          {Object.entries(formData.variables).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center mb-1">
                              <div>
                                <span className="font-medium">{key}:</span> {value}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeVariable(key)}
                                className="text-red-500"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={handlePreview}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm mt-2"
                      >
                        <Eye size={14} className="inline mr-1" />
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={handleSendTest}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm mt-2 ml-2"
                      >
                        <Send size={14} className="inline mr-1" />
                        Send Test
                      </button>
                    </div>
                  )}
                  
                  {previewNotification && (
                    <div className="mt-4 border p-3 rounded bg-gray-50">
                      <h5 className="text-sm font-medium">Preview</h5>
                      <div className="mt-2 p-3 bg-white border rounded shadow-sm">
                        <div className="font-medium">{previewNotification.title}</div>
                        <p className="text-sm mt-1">{previewNotification.body}</p>
                        {previewNotification.imageUrl && (
                          <img
                            src={previewNotification.imageUrl}
                            alt="Notification preview"
                            className="mt-2 h-20 object-cover rounded"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <h3 className="text-lg font-medium mb-3 mt-6">2. Select Recipients</h3>
          
          <div className="border rounded overflow-hidden">
            <div className="bg-gray-50 p-3 border-b">
              <div className="flex border rounded">
                <button
                  className={`flex-1 p-2 ${sendMode === 'filter' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                  onClick={() => handleSendModeChange('filter')}
                >
                  <Filter size={16} className="inline mr-1" />
                  By Filter
                </button>
                <button
                  className={`flex-1 p-2 ${sendMode === 'users' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                  onClick={() => handleSendModeChange('users')}
                >
                  <Users size={16} className="inline mr-1" />
                  Specific Users
                </button>
                <button
                  className={`flex-1 p-2 ${sendMode === 'topic' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                  onClick={() => handleSendModeChange('topic')}
                >
                  <Zap size={16} className="inline mr-1" />
                  Topic
                </button>
              </div>
            </div>
            
            <div className="p-3">
              {sendMode === 'filter' && (
                <div>
                  <p className="text-sm mb-3">Send to users matching specific criteria:</p>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder="e.g., city=Mumbai"
                      value={formData.filter.location || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        filter: {
                          ...prev.filter,
                          location: e.target.value
                        }
                      }))}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preference</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={formData.filter.preference || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        filter: {
                          ...prev.filter,
                          preference: e.target.value
                        }
                      }))}
                    >
                      <option value="">Any preference</option>
                      <option value="priceAlerts">Price Alerts Enabled</option>
                      <option value="newPropertyAlerts">New Property Alerts Enabled</option>
                      <option value="savedSearchAlerts">Saved Search Alerts Enabled</option>
                      <option value="dailyDigest">Daily Digest Enabled</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={formData.filter.activity || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        filter: {
                          ...prev.filter,
                          activity: e.target.value
                        }
                      }))}
                    >
                      <option value="">Any activity</option>
                      <option value="active">Active in last 30 days</option>
                      <option value="inactive">Inactive for 30+ days</option>
                    </select>
                  </div>
                </div>
              )}
              
              {sendMode === 'users' && (
                <div>
                  <p className="text-sm mb-3">Send to specific users by ID:</p>
                  
                  <textarea
                    className="w-full p-2 border rounded"
                    rows="4"
                    name="userIds"
                    value={formData.userIds}
                    onChange={handleInputChange}
                    placeholder="Enter user IDs separated by commas"
                  ></textarea>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Enter user IDs separated by commas (e.g., 5f8a3b2c1d4e5f6a7b8c9d0e, 5f8a3b2c1d4e5f6a7b8c9d0f)
                  </p>
                </div>
              )}
              
              {sendMode === 'topic' && (
                <div>
                  <p className="text-sm mb-3">Send to users subscribed to a topic:</p>
                  
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    placeholder="e.g., price-alerts"
                  />
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Only users who have explicitly subscribed to this topic will receive the notification
                  </p>
                </div>
              )}
              
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="testMode"
                    checked={formData.testMode}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Test Mode</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  In test mode, the notification will only be sent to one user instead of all recipients
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">3. Review & Send</h3>
          
          <div className="border rounded overflow-hidden">
            <div className="bg-gray-50 p-3 border-b">
              <h4 className="font-medium">Notification Summary</h4>
            </div>
            
            <div className="p-3">
              {!selectedTemplate ? (
                <p className="text-gray-500">Please select a template first</p>
              ) : !previewNotification ? (
                <p className="text-gray-500">Click "Preview" to see how your notification will appear</p>
              ) : (
                <div>
                  <div className="mb-4">
                    <h5 className="text-sm font-medium">Notification Content</h5>
                    <div className="mt-2 p-3 bg-gray-50 border rounded">
                      <div className="font-medium">{previewNotification.title}</div>
                      <p className="text-sm mt-1">{previewNotification.body}</p>
                      {previewNotification.imageUrl && (
                        <img
                          src={previewNotification.imageUrl}
                          alt="Notification preview"
                          className="mt-2 h-20 object-cover rounded"
                        />
                      )}
                      {previewNotification.clickAction && (
                        <p className="text-xs text-gray-500 mt-2">
                          Click action: {previewNotification.clickAction}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-medium">Recipients</h5>
                    <div className="mt-2 p-3 bg-gray-50 border rounded">
                      {sendMode === 'filter' && (
                        <div className="text-sm">
                          <p><span className="font-medium">Method:</span> By Filter</p>
                          {Object.keys(formData.filter).length > 0 ? (
                            <div className="mt-1">
                              <ul className="list-disc list-inside">
                                {Object.entries(formData.filter).map(([key, value]) => (
                                  value && <li key={key}>{key}: {value}</li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <p className="text-red-500 mt-1">No filters specified</p>
                          )}
                        </div>
                      )}
                      
                      {sendMode === 'users' && (
                        <div className="text-sm">
                          <p><span className="font-medium">Method:</span> Specific Users</p>
                          {formData.userIds ? (
                            <div className="mt-1">
                              <p>{formData.userIds.split(',').length} users selected</p>
                            </div>
                          ) : (
                            <p className="text-red-500 mt-1">No users specified</p>
                          )}
                        </div>
                      )}
                      
                      {sendMode === 'topic' && (
                        <div className="text-sm">
                          <p><span className="font-medium">Method:</span> Topic</p>
                          {formData.topic ? (
                            <div className="mt-1">
                              <p>Topic: {formData.topic}</p>
                            </div>
                          ) : (
                            <p className="text-red-500 mt-1">No topic specified</p>
                          )}
                        </div>
                      )}
                      
                      {formData.testMode && (
                        <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 text-sm rounded border border-yellow-200">
                          <strong>Test Mode:</strong> Only 1 user will receive this notification
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSend}
                    disabled={sending || !previewNotification}
                    className="w-full p-3 bg-blue-500 text-white rounded font-medium disabled:bg-blue-300 flex justify-center items-center"
                  >
                    {sending ? (
                      <>Sending Notification...</>
                    ) : formData.testMode ? (
                      <>
                        <Send size={18} className="mr-2" />
                        Send Test Notification
                      </>
                    ) : (
                      <>
                        <Send size={18} className="mr-2" />
                        Send Notification to All Recipients
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notification Templates</h2>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={() => {
            setSelectedTemplate(null);
            setShowAddTemplate(true);
          }}
        >
          <Plus size={16} className="mr-1" />
          Add Template
        </button>
      </div>

      {
        error && (
            <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    {
        loading ? (
            <div className="text-center py-8">Loading templates...</div>
        ) : (
            <>
                {templates.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No templates found. Create your first template to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {templates.map(template => (
                            <div key={template._id} className="border rounded-lg overflow-hidden bg-white">
                                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">{template.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${template.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {template.active ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className="text-xs ml-2 text-gray-500">{template.category}</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            className="p-1 text-gray-500 hover:text-blue-500"
                                            onClick={() => handleEditTemplate(template)}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="p-1 text-gray-500 hover:text-red-500"
                                            onClick={() => handleDeleteTemplate(template._id)}
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="mb-2">
                                        <span className="font-medium text-sm text-gray-500">Title:</span>
                                        <p>{template.title}</p>
                                    </div>
                                    <div className="mb-2">
                                        <span className="font-medium text-sm text-gray-500">Body:</span>
                                        <p>{template.body}</p>
                                    </div>
                                    {template.imageUrl && (
                                        <div className="mb-2">
                                            <span className="font-medium text-sm text-gray-500">Image:</span>
                                            <div className="mt-1">
                                                <img
                                                    src={template.imageUrl}
                                                    alt="Template image"
                                                    className="h-20 object-cover rounded"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {template.variables && template.variables.length > 0 && (
                                        <div className="mb-2">
                                            <span className="font-medium text-sm text-gray-500">Variables:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {template.variables.map(variable => (
                                                    <span key={variable} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                        {'{{'}{variable}{'}}'}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="text-xs text-gray-500 mt-3">
                                        Sent {template.sendCount || 0} times
                                        {template.lastSentAt && ` • Last sent ${new Date(template.lastSentAt).toLocaleDateString()}`}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        )
    }

    {
        showAddTemplate && (
            <TemplateForm
                template={selectedTemplate}
                onClose={() => setShowAddTemplate(false)}
                onSave={() => {
                    setShowAddTemplate(false);
                    fetchTemplates();
                }}
            />
        )
    }
    </div >
  );
};

// Template Form Component
const TemplateForm = ({ template, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        body: '',
        imageUrl: '',
        clickAction: '',
        category: 'system',
        additionalData: {},
        tags: [],
        active: true
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [additionalDataKey, setAdditionalDataKey] = useState('');
    const [additionalDataValue, setAdditionalDataValue] = useState('');
    const [tag, setTag] = useState('');

    useEffect(() => {
        if (template) {
            setFormData({
                name: template.name || '',
                title: template.title || '',
                body: template.body || '',
                imageUrl: template.imageUrl || '',
                clickAction: template.clickAction || '',
                category: template.category || 'system',
                additionalData: template.additionalData || {},
                tags: template.tags || [],
                active: template.active !== undefined ? template.active : true
            });
        }
    }, [template]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addAdditionalData = () => {
        if (!additionalDataKey.trim()) return;

        setFormData(prev => ({
            ...prev,
            additionalData: {
                ...prev.additionalData,
                [additionalDataKey]: additionalDataValue
            }
        }));

        setAdditionalDataKey('');
        setAdditionalDataValue('');
    };

    const removeAdditionalData = (key) => {
        const newData = { ...formData.additionalData };
        delete newData[key];

        setFormData(prev => ({
            ...prev,
            additionalData: newData
        }));
    };

    const addTag = () => {
        if (!tag.trim()) return;

        setFormData(prev => ({
            ...prev,
            tags: [...prev.tags, tag]
        }));

        setTag('');
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const url = template
                ? `/api/notifications/admin/templates/${template._id}`
                : '/api/notifications/admin/templates';

            const method = template ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                onSave(data.template);
            } else {
                setError(data.message || 'Failed to save template');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to save template:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">
                        {template ? 'Edit Template' : 'Add New Template'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Template Name*</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                                placeholder="e.g., price-drop"
                            />
                            <p className="text-xs text-gray-500 mt-1">Unique identifier for this template</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="property">Property</option>
                                <option value="building">Building</option>
                                <option value="project">Project</option>
                                <option value="user">User</option>
                                <option value="system">System</option>
                                <option value="marketing">Marketing</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notification Title*</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            placeholder="e.g., Price Drop Alert"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            You can use variables like {{ '{{'}}propertyTitle{{ '}}'}}
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notification Body*</label>
                        <textarea
                            name="body"
                            value={formData.body}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows="3"
                            required
                            placeholder="e.g., The price of {{propertyTitle}} in {{location}} has dropped by {{dropPercentage}}!"
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-1">
                            You can use variables like {{ '{{'}}propertyTitle{{ '}}'}}
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional image to display with the notification</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Click Action URL</label>
                        <input
                            type="text"
                            name="clickAction"
                            value={formData.clickAction}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="e.g., /property/{{propertyId}}"
                        />
                        <p className="text-xs text-gray-500 mt-1">Where to direct users when they click the notification</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Data</label>

                        <div className="flex mb-2">
                            <input
                                type="text"
                                value={additionalDataKey}
                                onChange={(e) => setAdditionalDataKey(e.target.value)}
                                className="w-1/3 p-2 border rounded-l"
                                placeholder="Key"
                            />
                            <input
                                type="text"
                                value={additionalDataValue}
                                onChange={(e) => setAdditionalDataValue(e.target.value)}
                                className="w-2/3 p-2 border-t border-b border-r rounded-r"
                                placeholder="Value"
                            />
                            <button
                                type="button"
                                onClick={addAdditionalData}
                                className="ml-2 bg-blue-500 text-white p-2 rounded"
                            >
                                Add
                            </button>
                        </div>

                        {Object.keys(formData.additionalData).length > 0 && (
                            <div className="bg-gray-50 p-2 rounded border mb-2">
                                {Object.entries(formData.additionalData).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center mb-1">
                                        <div>
                                            <span className="font-medium">{key}:</span> {value}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeAdditionalData(key)}
                                            className="text-red-500"
                                        >
                                            <Trash size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="text-xs text-gray-500 mt-1">Extra data to send with the notification</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>

                        <div className="flex mb-2">
                            <input
                                type="text"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                className="w-full p-2 border rounded-l"
                                placeholder="Add a tag"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="ml-2 bg-blue-500 text-white p-2 rounded"
                            >
                                Add
                            </button>
                        </div>

                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.tags.map(tag => (
                                    <span key={tag} className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-1 text-gray-600 hover:text-red-500"
                                        >
                                            <Trash size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <p className="text-xs text-gray-500 mt-1">Tags help organize templates</p>
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">Active</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Only active templates can be used to send notifications</p>
                    </div>

                    <div className="flex justify-end space-x-3 border-t pt-4 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : (template ? 'Update Template' : 'Create Template')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Send Notifications Tab Component
const SendNotificationsTab = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [sendMode, setSendMode] = useState('filter'); // filter, users, topic
    const [formData, setFormData] = useState({
        filter: {},
        userIds: [],
        topic: '',
        variables: {},
        testMode: true
    });
    const [variableKey, setVariableKey] = useState('');
    const [variableValue, setVariableValue] = useState('');
    const [previewNotification, setPreviewNotification] = useState(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            // This would be replaced with your actual API endpoint
            const response = await fetch('/api/notifications/admin/templates');
            const data = await response.json();

            if (data.success) {
                // Only show active templates
                const activeTemplates = data.templates.filter(t => t.active);
                setTemplates(activeTemplates);
            } else {
                setError(data.message || 'Failed to fetch templates');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to fetch templates:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateSelect = (templateId) => {
        const template = templates.find(t => t._id === templateId);
        setSelectedTemplate(template);
        setFormData(prev => ({
            ...prev,
            variables: {}
        }));
        setPreviewNotification(null);
    };

    const handleSendModeChange = (mode) => {
        setSendMode(mode);
        setError(null);
        setSuccess(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addVariable = () => {
        if (!variableKey.trim()) return;

        setFormData(prev => ({
            ...prev,
            variables: {
                ...prev.variables,
                [variableKey]: variableValue
            }
        }));

        setVariableKey('');
        setVariableValue('');
    };

    const removeVariable = (key) => {
        const newVariables = { ...formData.variables };
        delete newVariables[key];

        setFormData(prev => ({
            ...prev,
            variables: newVariables
        }));
    };

    const handlePreview = async () => {
        if (!selectedTemplate) return;

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await fetch(`/api/notifications/admin/templates/${selectedTemplate._id}/preview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    variables: formData.variables
                })
            });

            const data = await response.json();

            if (data.success) {
                setPreviewNotification(data.notification);
            } else {
                setError(data.message || 'Failed to preview notification');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to preview notification:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendTest = async () => {
        if (!selectedTemplate) return;

        try {
            setSending(true);
            setError(null);
            setSuccess(null);

            // This would need to be replaced with actual test user ID
            const testUserId = "5f7b5d53ef9a4b001c9a6b5a"; // Example user ID

            const response = await fetch(`/api/notifications/admin/templates/${selectedTemplate._id}/send-test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    recipientId: testUserId,
                    variables: formData.variables
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Test notification sent successfully!');
            } else {
                setError(data.message || 'Failed to send test notification');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to send test notification:', err);
        } finally {
            setSending(false);
        }
    };

    const handleSend = async () => {
        if (!selectedTemplate) {
            setError('Please select a template first');
            return;
        }

        try {
            setSending(true);
            setError(null);
            setSuccess(null);

            let payload = {
                notification: previewNotification,
                testMode: formData.testMode
            };

            // Add send mode specific data
            if (sendMode === 'filter' && Object.keys(formData.filter).length > 0) {
                payload.filter = formData.filter;
            } else if (sendMode === 'users' && formData.userIds.length > 0) {
                payload.userIds = formData.userIds.split(',').map(id => id.trim());
            } else if (sendMode === 'topic' && formData.topic) {
                payload.topic = formData.topic;
            } else {
                setError('Please complete the required fields for your selected send mode');
                setSending(false);
                return;
            }

            const response = await fetch('/api/notifications/admin/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Notification sent successfully!');
                // Reset form after successful send
                if (!formData.testMode) {
                    setFormData({
                        filter: {},
                        userIds: [],
                        topic: '',
                        variables: {},
                        testMode: true
                    });
                    setSelectedTemplate(null);
                    setPreviewNotification(null);
                }
            } else {
                setError(data.message || 'Failed to send notification');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to send notification:', err);
        } finally {
            setSending(false);
        }