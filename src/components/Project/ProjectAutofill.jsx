
// import React, { useState, useCallback } from 'react';
// import { allDummyData } from '../../../utils/projectDummyData';

// const ProjectAutofill = ({ onApply, builders }) => {
//     const [selectedTemplate, setSelectedTemplate] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const handleTemplateChange = (e) => {
//         setSelectedTemplate(e.target.value);
//     };

//     // Use useCallback to memoize the function to prevent recreating it on every render
//     const applyTemplate = useCallback(() => {
//         if (!selectedTemplate) return;

//         const template = allDummyData.find(item => item.id === selectedTemplate);
//         if (!template) return;

//         // Create a deep copy of the template data to avoid reference issues
//         let data = JSON.parse(JSON.stringify(template.data));

//         // If we have actual builders, try to find a match or use the first one
//         if (builders && builders.length > 0) {
//             const builderIndex = Math.min(parseInt(selectedTemplate.charAt(selectedTemplate.length - 1) || '0'), builders.length - 1);
//             data.builder = builders[builderIndex]?._id || builders[0]?._id;
//         }

//         // Apply the template data
//         onApply(data);
//         setIsModalOpen(false);
//     }, [selectedTemplate, builders, onApply]);

//     return (
//         <div>
//             <button
//                 onClick={() => setIsModalOpen(true)}
//                 className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
//             >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//                 Load Test Data
//             </button>

//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg p-6 w-full max-w-md">
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="text-xl font-bold text-gray-800">Load Test Data</h2>
//                             <button
//                                 onClick={() => setIsModalOpen(false)}
//                                 className="text-gray-600 hover:text-gray-900"
//                             >
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                             </button>
//                         </div>

//                         <div className="mb-4">
//                             <label className="block text-gray-700 mb-2">Select Test Data Template:</label>
//                             <select
//                                 className="w-full p-2 border rounded-md"
//                                 value={selectedTemplate}
//                                 onChange={handleTemplateChange}
//                             >
//                                 <option value="">-- Select a template --</option>
//                                 {allDummyData.map((template) => (
//                                     <option key={template.id} value={template.id}>
//                                         {template.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {selectedTemplate && (
//                             <div className="mb-4 p-3 bg-gray-50 rounded-md">
//                                 <h3 className="font-semibold text-gray-700 mb-1">
//                                     {allDummyData.find(t => t.id === selectedTemplate)?.name}
//                                 </h3>
//                                 <p className="text-sm text-gray-600">
//                                     This will populate the form with dummy data for a {' '}
//                                     {allDummyData.find(t => t.id === selectedTemplate)?.data.type.toLowerCase()} project.
//                                 </p>
//                             </div>
//                         )}

//                         <div className="flex justify-end space-x-3">
//                             <button
//                                 onClick={() => setIsModalOpen(false)}
//                                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={applyTemplate}
//                                 disabled={!selectedTemplate}
//                                 className={`px-4 py-2 rounded-md ${!selectedTemplate
//                                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                         : 'bg-blue-600 text-white hover:bg-blue-700'
//                                     }`}
//                             >
//                                 Apply Template
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ProjectAutofill;


import React, { useState, useCallback } from 'react';
import { Sparkles, X, FileText, Building2, MapPin, Calendar } from 'lucide-react';
import { allDummyData } from '../../../utils/projectDummyData';

const ProjectAutofill = ({ onApply, builders }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleTemplateChange = (e) => {
        setSelectedTemplate(e.target.value);
    };

    const applyTemplate = useCallback(async () => {
        if (!selectedTemplate) return;

        const template = allDummyData.find(item => item.id === selectedTemplate);
        if (!template) return;

        setIsLoading(true);

        try {
            // Create a deep copy of the template data to avoid reference issues
            let data = JSON.parse(JSON.stringify(template.data));

            // If we have actual builders, try to find a match or use the first one
            if (builders && builders.length > 0) {
                const builderIndex = Math.min(
                    parseInt(selectedTemplate.charAt(selectedTemplate.length - 1) || '0'),
                    builders.length - 1
                );
                data.builder = builders[builderIndex]?._id || builders[0]?._id;
            }

            // Simulate loading for better UX
            await new Promise(resolve => setTimeout(resolve, 800));

            // Apply the template data
            onApply(data);
            setIsModalOpen(false);
            setSelectedTemplate('');
        } catch (error) {
            console.error('Error applying template:', error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedTemplate, builders, onApply]);

    const selectedTemplateData = selectedTemplate
        ? allDummyData.find(t => t.id === selectedTemplate)
        : null;

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                <Sparkles className="h-4 w-4 mr-2" />
                Load Test Data
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <Sparkles className="h-6 w-6 text-white mr-3" />
                                    <h2 className="text-xl font-bold text-white">Load Test Data</h2>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                                    disabled={isLoading}
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <p className="text-purple-100 text-sm mt-1">
                                Choose from pre-configured project templates to quickly populate your form
                            </p>
                        </div>

                        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                            {/* Template Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Select Test Data Template
                                </label>
                                <select
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                                    value={selectedTemplate}
                                    onChange={handleTemplateChange}
                                    disabled={isLoading}
                                >
                                    <option value="">-- Choose a template --</option>
                                    {allDummyData.map((template) => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Template Preview */}
                            {selectedTemplateData && (
                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 mb-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                {selectedTemplateData.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {selectedTemplateData.description ||
                                                    `Complete ${selectedTemplateData.data.type.toLowerCase().replace('_', ' ')} project template with all required fields`}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <Building2 className="h-6 w-6 text-purple-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Template Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white/70 rounded-lg p-3">
                                            <div className="flex items-center mb-2">
                                                <Building2 className="h-4 w-4 text-gray-500 mr-2" />
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                    Project Type
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {selectedTemplateData.data.type?.replace('_', ' ')}
                                            </p>
                                        </div>

                                        <div className="bg-white/70 rounded-lg p-3">
                                            <div className="flex items-center mb-2">
                                                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                    Location
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {selectedTemplateData.data.location?.city}, {selectedTemplateData.data.location?.state}
                                            </p>
                                        </div>

                                        <div className="bg-white/70 rounded-lg p-3">
                                            <div className="flex items-center mb-2">
                                                <FileText className="h-4 w-4 text-gray-500 mr-2" />
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                    Total Units
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {selectedTemplateData.data.overview?.totalUnits || 'N/A'}
                                            </p>
                                        </div>

                                        <div className="bg-white/70 rounded-lg p-3">
                                            <div className="flex items-center mb-2">
                                                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                    Status
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {selectedTemplateData.data.status?.replace('_', ' ')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Features List */}
                                    <div className="mt-4 pt-4 border-t border-purple-200">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                                            This template includes:
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                'Basic Information',
                                                'Location Details',
                                                'Floor Plans',
                                                'Amenities',
                                                'Highlights',
                                                'Nearby Locations',
                                                'Pricing Information'
                                            ].map((feature, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Warning */}
                                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-amber-800">
                                                    <strong>Note:</strong> This will replace all current form data.
                                                    Make sure to save any important changes before applying this template.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={applyTemplate}
                                    disabled={!selectedTemplate || isLoading}
                                    className={`px-6 py-2 rounded-lg font-medium transition-all ${!selectedTemplate || isLoading
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl'
                                        }`}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                            Applying Template...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Apply Template
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProjectAutofill;