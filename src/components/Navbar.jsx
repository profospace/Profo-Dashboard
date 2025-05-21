import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Upload, Home, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <Video className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">VideoHub</span>
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            to="/"
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition duration-150"
                        >
                            <div className="flex items-center">
                                <Home className="h-5 w-5 mr-1" />
                                <span>Home</span>
                            </div>
                        </Link>
                        <Link
                            to="/upload"
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition duration-150"
                        >
                            <div className="flex items-center">
                                <Upload className="h-5 w-5 mr-1" />
                                <span>Upload</span>
                            </div>
                        </Link>
                        <Link
                            to="/videos"
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition duration-150"
                        >
                            <div className="flex items-center">
                                <Video className="h-5 w-5 mr-1" />
                                <span>Videos</span>
                            </div>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/video/home"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className="flex items-center">
                                <Home className="h-5 w-5 mr-2" />
                                <span>Home</span>
                            </div>
                        </Link>
                        <Link
                            to="/upload"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className="flex items-center">
                                <Upload className="h-5 w-5 mr-2" />
                                <span>Upload</span>
                            </div>
                        </Link>
                        <Link
                            to="/videos"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className="flex items-center">
                                <Video className="h-5 w-5 mr-2" />
                                <span>Videos</span>
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;