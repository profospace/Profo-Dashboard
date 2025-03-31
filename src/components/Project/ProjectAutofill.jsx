// import React, { useState } from 'react';
// import { allDummyData } from '../../../utils/projectDummyData';

// const ProjectAutofill = ({ onApply, builders }) => {
//     const [selectedTemplate, setSelectedTemplate] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const handleTemplateChange = (e) => {
//         setSelectedTemplate(e.target.value);
//     };

//     const applyTemplate = () => {
//         if (!selectedTemplate) return;

//         const template = allDummyData.find(item => item.id === selectedTemplate);
//         if (!template) return;

//         // Map builder ID based on the actual builders from the API
//         let data = { ...template.data };

//         // If we have actual builders, try to find a match or use the first one
//         if (builders && builders.length > 0) {
//             const builderIndex = Math.min(parseInt(selectedTemplate.charAt(selectedTemplate.length - 1) || '0'), builders.length - 1);
//             data.builder = builders[builderIndex]?._id || builders?.[0]?._id;
//         }

//         onApply(data);
//         setIsModalOpen(false);
//     };

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
import { allDummyData } from '../../../utils/projectDummyData';

const ProjectAutofill = ({ onApply, builders }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTemplateChange = (e) => {
        setSelectedTemplate(e.target.value);
    };

    // Use useCallback to memoize the function to prevent recreating it on every render
    const applyTemplate = useCallback(() => {
        if (!selectedTemplate) return;

        const template = allDummyData.find(item => item.id === selectedTemplate);
        if (!template) return;

        // Create a deep copy of the template data to avoid reference issues
        let data = JSON.parse(JSON.stringify(template.data));

        // If we have actual builders, try to find a match or use the first one
        if (builders && builders.length > 0) {
            const builderIndex = Math.min(parseInt(selectedTemplate.charAt(selectedTemplate.length - 1) || '0'), builders.length - 1);
            data.builder = builders[builderIndex]?._id || builders[0]?._id;
        }

        // Apply the template data
        onApply(data);
        setIsModalOpen(false);
    }, [selectedTemplate, builders, onApply]);

    return (
        <div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Load Test Data
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Load Test Data</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Select Test Data Template:</label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={selectedTemplate}
                                onChange={handleTemplateChange}
                            >
                                <option value="">-- Select a template --</option>
                                {allDummyData.map((template) => (
                                    <option key={template.id} value={template.id}>
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedTemplate && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-md">
                                <h3 className="font-semibold text-gray-700 mb-1">
                                    {allDummyData.find(t => t.id === selectedTemplate)?.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    This will populate the form with dummy data for a {' '}
                                    {allDummyData.find(t => t.id === selectedTemplate)?.data.type.toLowerCase()} project.
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={applyTemplate}
                                disabled={!selectedTemplate}
                                className={`px-4 py-2 rounded-md ${!selectedTemplate
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                Apply Template
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectAutofill;