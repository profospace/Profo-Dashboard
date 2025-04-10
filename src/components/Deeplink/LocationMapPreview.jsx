import React, { useState } from 'react';
import { Copy, CheckCircle, Link, MapPin, Map, Sliders } from 'lucide-react';

// Simplified Map Component for preview
const LocationMapPreview = () => {
    const [marker, setMarker] = useState({ lat: 28.6139, lng: 77.2090 });
    const [radius, setRadius] = useState(500);

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-200">
            {/* Fake map background */}
            <div className="absolute inset-0 bg-blue-50">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${marker.lng},${marker.lat},12,0/640x360?access_token=pk.dummy')`,
                    backgroundSize: 'cover',
                    opacity: 0.7
                }}></div>
            </div>

            {/* Marker */}
            <div className="absolute" style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-indigo-500 opacity-20 animate-pulse"
                        style={{
                            width: `${Math.min(radius / 10, 100)}px`,
                            height: `${Math.min(radius / 10, 100)}px`,
                            transform: 'translate(-50%, -50%)'
                        }}></div>
                    <div className="h-6 w-6 bg-indigo-600 rounded-full border-2 border-white shadow-lg"></div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute top-4 left-4 right-4">
                <div className="bg-white rounded-lg shadow-lg p-2">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for a location..."
                            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Radius: {radius}m
                </label>
                <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>100m</span>
                    <span>5000m</span>
                </div>
            </div>
        </div>
    );
};

// Demo for the updated DeeplinkGenerator with map integration
const DeeplinkGeneratorDemo = () => {
    const [showMap, setShowMap] = useState(true);
    const [copied, setCopied] = useState(false);

    return (
        <div className="mx-auto max-w-4xl bg-gray-50 p-6 rounded-xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Deeplink Generator</h1>
                <p className="text-gray-600">Create custom deeplinks for filtering properties in the ProfoSpace mobile app.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Preview */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-4 px-6">
                            <h2 className="text-lg font-semibold text-white flex items-center">
                                <Sliders className="mr-2 h-5 w-5" />
                                Filter Criteria
                            </h2>
                        </div>

                        {/* Location Section with Map */}
                        <div className="p-6">
                            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <h3 className="text-md font-medium text-gray-700 flex items-center">
                                        <MapPin className="mr-2 h-4 w-4 text-indigo-500" />
                                        Location Parameters
                                    </h3>
                                    <button
                                        onClick={() => setShowMap(!showMap)}
                                        className="px-3 py-1 text-xs font-medium rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center"
                                    >
                                        <Map className="mr-1 h-3 w-3" />
                                        {showMap ? 'Hide Map' : 'Show Map'}
                                    </button>
                                </div>

                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Latitude
                                            </label>
                                            <input
                                                type="text"
                                                value="28.6139"
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Longitude
                                            </label>
                                            <input
                                                type="text"
                                                value="77.2090"
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Radius (meters)
                                            </label>
                                            <input
                                                type="text"
                                                value="500"
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    {showMap && (
                                        <div className="h-64">
                                            <LocationMapPreview />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Placeholder for other form elements */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="h-12 bg-gray-100 rounded-md animate-pulse"></div>
                                <div className="h-12 bg-gray-100 rounded-md animate-pulse"></div>
                                <div className="h-12 bg-gray-100 rounded-md animate-pulse"></div>
                                <div className="h-12 bg-gray-100 rounded-md animate-pulse"></div>
                            </div>

                            <button
                                className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium rounded-md shadow-md flex items-center justify-center space-x-2"
                            >
                                <Link className="w-5 h-5" />
                                <span>Generate Deeplink</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Result Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-4 px-6">
                            <h3 className="text-lg font-semibold text-white">Generated Deeplink</h3>
                        </div>

                        <div className="p-6 flex flex-col h-full">
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md mb-4 break-all flex-grow">
                                <p className="text-gray-800 text-sm font-mono">https://www.profospace.in/filter?purpose=Rent&property_type=Apartment&min_price=10000&max_price=50000&bedrooms=2&bathrooms=2&lat=28.6139&lng=77.209&radius=500&amenities[0]=Pool&amenities[1]=Gym</p>
                            </div>

                            <button
                                onClick={() => {
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className={`w-full py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2 ${copied ? 'bg-green-500 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-5 h-5" />
                                        <span>Copy Deeplink</span>
                                    </>
                                )}
                            </button>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Testing Instructions</h4>
                                <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                                    <li>Copy the generated deeplink</li>
                                    <li>Open it in the ProfoSpace mobile app</li>
                                    <li>Verify that the filters are applied correctly</li>
                                    <li>Check that the location and radius are shown on the map</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeeplinkGeneratorDemo;