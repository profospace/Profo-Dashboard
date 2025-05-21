import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Film, Library } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const HomePage = () => {
    return (
        <div className=" mx-auto px-4 ">
            {/* <Navbar /> */}
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Video Management Solution
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Easily upload, stream, and manage videos for your properties, projects, and buildings with our powerful video platform.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
                {/* Upload Feature */}
                <div className="bg-white rounded-lg shadow-lg p-8 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Upload className="h-10 w-10 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-semibold text-center mb-4">Upload Videos</h2>
                    <p className="text-gray-600 mb-6 text-center">
                        Upload videos for properties, projects, or buildings. Add metadata for better organization.
                    </p>
                    <div className="text-center">
                        <Link to="/upload" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-150">
                            Start Uploading
                        </Link>
                    </div>
                </div>

                {/* View Feature */}
                <div className="bg-white rounded-lg shadow-lg p-8 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-indigo-100 rounded-full">
                            <Film className="h-10 w-10 text-indigo-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-semibold text-center mb-4">Stream Videos</h2>
                    <p className="text-gray-600 mb-6 text-center">
                        Adaptive streaming technology for smooth playback. Support for all devices and network conditions.
                    </p>
                    <div className="text-center">
                        <Link to="/videos" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition duration-150">
                            Browse Videos
                        </Link>
                    </div>
                </div>

                {/* Manage Feature */}
                <div className="bg-white rounded-lg shadow-lg p-8 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-emerald-100 rounded-full">
                            <Library className="h-10 w-10 text-emerald-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-semibold text-center mb-4">Manage Content</h2>
                    <p className="text-gray-600 mb-6 text-center">
                        Organize, edit, and delete videos. Track views and analytics for all your video content.
                    </p>
                    <div className="text-center">
                        <Link to="/videos" className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-md font-medium hover:bg-emerald-700 transition duration-150">
                            Manage Videos
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-20 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Why Choose Our Video Platform?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    <div className="p-5">
                        <h3 className="text-xl font-semibold mb-2">Optimized Streaming</h3>
                        <p className="text-gray-600">Chunk-based streaming for seamless playback even in challenging network conditions.</p>
                    </div>
                    <div className="p-5">
                        <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
                        <p className="text-gray-600">Videos are securely stored on AWS S3 with restricted access controls.</p>
                    </div>
                    <div className="p-5">
                        <h3 className="text-xl font-semibold mb-2">Adaptive Quality</h3>
                        <p className="text-gray-600">Automatically adjusts video quality based on viewer's bandwidth.</p>
                    </div>
                    <div className="p-5">
                        <h3 className="text-xl font-semibold mb-2">Entity Integration</h3>
                        <p className="text-gray-600">Videos are linked to properties, projects, or buildings for easy management.</p>
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default HomePage;