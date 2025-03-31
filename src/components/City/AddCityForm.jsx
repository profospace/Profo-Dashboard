import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, Save, X, Trash2, Upload } from 'lucide-react';

const AddCityForm = ({ citiesToAdd, onAddCity, onRemoveCityToAdd, onPushChanges }) => {
    const [cityInput, setCityInput] = useState('');
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef(null);

    // Focus the input field when the component mounts
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedCity = cityInput.trim();

        if (!trimmedCity) {
            setError('Please enter a city name');
            return;
        }

        if (trimmedCity.length < 2) {
            setError('City name must be at least 2 characters long');
            return;
        }

        onAddCity(trimmedCity);
        setCityInput('');
        setError('');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        // Check if it's a CSV or text file
        if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
            setError('Please upload a CSV or TXT file');
            setIsUploading(false);
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const content = event.target?.result;
                if (typeof content !== 'string') {
                    throw new Error('Failed to read file content');
                }

                // Split by newline, comma, or semicolon
                const cities = content
                    .split(/[\n,;]/)
                    .map(city => city.trim())
                    .filter(city => city && city.length >= 2);

                if (cities.length === 0) {
                    setError('No valid city names found in the file');
                } else {
                    cities.forEach(city => onAddCity(city));
                }
            } catch (err) {
                console.error('Error processing file:', err);
                setError('Failed to process the file');
            } finally {
                setIsUploading(false);
            }
        };

        reader.onerror = () => {
            setError('Failed to read the file');
            setIsUploading(false);
        };

        reader.readAsText(file);
        e.target.value = ''; // Reset input
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add New Cities
                </h2>
            </div>

            <div className="p-5">
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="flex flex-col space-y-4">
                        <div>
                            <label htmlFor="cityInput" className="block text-sm font-medium text-gray-700 mb-1">
                                City Name
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    id="cityInput"
                                    value={cityInput}
                                    onChange={(e) => {
                                        setCityInput(e.target.value);
                                        if (error) setError('');
                                    }}
                                    placeholder="Enter city name"
                                    className={`block w-full rounded-md border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                                        } shadow-sm py-2 px-4 focus:outline-none focus:ring-2 sm:text-sm`}
                                />
                                {cityInput && (
                                    <button
                                        type="button"
                                        onClick={() => setCityInput('')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    </button>
                                )}
                            </div>
                            {error && (
                                <p className="mt-1 text-sm text-red-600">{error}</p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                            >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add City
                            </button>

                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".csv,.txt"
                                    id="cityFileUpload"
                                    onChange={handleFileUpload}
                                    className="sr-only"
                                />
                                <label
                                    htmlFor="cityFileUpload"
                                    className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isUploading ? (
                                        <>
                                            <Upload className="h-4 w-4 mr-2 animate-pulse" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload CSV/TXT
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                </form>

                {citiesToAdd.length > 0 && (
                    <div className="mt-5 border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-md font-medium text-gray-700">Cities to Add ({citiesToAdd.length})</h3>
                            <button
                                onClick={() => {
                                    if (window.confirm(`Are you sure you want to clear all ${citiesToAdd.length} cities from the list?`)) {
                                        citiesToAdd.forEach(city => onRemoveCityToAdd(city));
                                    }
                                }}
                                className="text-sm text-red-600 hover:text-red-800 focus:outline-none flex items-center"
                            >
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                Clear All
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-md p-3 max-h-40 overflow-y-auto mb-4">
                            <div className="flex flex-wrap gap-2">
                                {citiesToAdd.map((city, index) => (
                                    <div
                                        key={index}
                                        className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center transition-colors hover:bg-green-200"
                                    >
                                        {city}
                                        <button
                                            onClick={() => onRemoveCityToAdd(city)}
                                            className="ml-1.5 text-green-700 hover:text-green-900 focus:outline-none"
                                            aria-label={`Remove ${city}`}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={onPushChanges}
                            className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save {citiesToAdd.length} {citiesToAdd.length === 1 ? 'City' : 'Cities'} to Database
                        </button>
                    </div>
                )}

                {/* Help text */}
                <div className="mt-4 text-xs text-gray-500">
                    <p className="mb-1"><strong>Tips:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Enter city names one at a time or upload a CSV/TXT file</li>
                        <li>In CSV files, separate cities with commas or line breaks</li>
                        <li>City names should be at least 2 characters long</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AddCityForm;