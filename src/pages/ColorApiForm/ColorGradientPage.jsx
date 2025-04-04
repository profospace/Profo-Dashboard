// import React from 'react';
// import ColorGradientForm from '../../components/ColorGradient/ColorGradientForm';

// const ColorGradientPage = () => {
//     return (
//         <div className="min-h-screen">
//                 <div className="mx-auto ">
//                         <ColorGradientForm />
//                     </div>
//         </div>
//     );
// };

// export default ColorGradientPage;

import React, { useState } from 'react';
import ColorGradientForm from '../../components/ColorGradient/ColorGradientForm';
import ColorPreview from '../../components/ColorGradient/ColorPreview';

const ColorGradientPage = () => {
    const [colorData, setColorData] = useState(null);
    const [activeTab, setActiveTab] = useState('editor'); // 'editor' or 'preview'

    const handleColorUpdate = (data) => {
        setColorData(data);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white border-b">
                <div className=" mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Color Scheme Editor
                        </span>
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Customize your app's appearance with a beautiful color palette
                    </p>
                </div>
            </div>

            {/* Tab Navigation - Mobile Only */}
            <div className="md:hidden bg-white shadow-sm sticky top-0 z-10">
                <div className="flex">
                    <button
                        className={`flex-1 py-3 text-center font-medium ${activeTab === 'editor' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('editor')}
                    >
                        Editor
                    </button>
                    <button
                        className={`flex-1 py-3 text-center font-medium ${activeTab === 'preview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('preview')}
                    >
                        Preview
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Side - Form */}
                    <div className={`md:w-7/12 ${activeTab === 'editor' ? 'block' : 'hidden md:block'}`}>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6">
                                <ColorGradientForm onSubmitSuccess={handleColorUpdate} />
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Preview */}
                    <div className={`md:w-5/12 md:sticky md:top-8 self-start ${activeTab === 'preview' ? 'block' : 'hidden md:block'}`}>
                        <div className="space-y-6">
                            {/* Preview Panel */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <ColorPreview colors={colorData} />
                            </div>

                            {/* Help Panel */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Tips</h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        Use complementary colors for best visual appeal
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        Ensure sufficient contrast for text readability
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        Preview your changes on mobile and desktop
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 bg-white border-t py-8">
                <div className="container mx-auto px-4 text-center text-gray-500">
                    <p>Color Scheme Editor &copy; {new Date().getFullYear()}</p>
                </div>
            </footer>
        </div>
    );
};

export default ColorGradientPage;