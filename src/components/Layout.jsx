import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    Building,
    Users,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    FileText,
    LayoutDashboardIcon
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, text, active, collapsed }) => (
    <Link
        to={to}
        className={`flex items-center p-3 my-1 rounded-lg transition-colors ${active
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
    >
        <Icon size={20} className="flex-shrink-0" />
        {!collapsed && <span className="ml-3">{text}</span>}
    </Link>
);

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const routes = [
        { path: '/', icon: Home, text: 'Dashboard' },
        { path: '/properties', icon: LayoutDashboardIcon, text: 'Properties' },
        { path: '/projects', icon: FileText, text: 'Projects' },
        { path: '/buildings', icon: Building, text: 'Buildings' },
        { path: '/leads', icon: Users, text: 'Leads Management' },
        { path: '/users', icon: Users, text: 'User Management' },
    ];

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-0 left-0 z-20 m-4">
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-md bg-white shadow-md"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile sidebar backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar for mobile */}
            <div
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h1 className="text-xl font-semibold text-gray-800">Property Manager</h1>
                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 rounded-md hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>
                <nav className="p-4">
                    {routes.map((route) => (
                        <SidebarLink
                            key={route.path}
                            to={route.path}
                            icon={route.icon}
                            text={route.text}
                            active={location.pathname === route.path}
                            collapsed={false}
                        />
                    ))}
                </nav>
            </div>

            {/* Sidebar for desktop */}
            <div
                className={`hidden lg:block bg-white border-r shadow-sm relative transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'
                    }`}
            >
                <div className={`flex items-center justify-between p-4 border-b ${collapsed ? 'justify-center' : ''}`}>
                    {!collapsed && <h1 className="text-xl font-semibold text-gray-800">Property Manager</h1>}
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-md hover:bg-gray-100"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
                <nav className="p-2">
                    {routes.map((route) => (
                        <SidebarLink
                            key={route.path}
                            to={route.path}
                            icon={route.icon}
                            text={route.text}
                            active={location.pathname === route.path}
                            collapsed={collapsed}
                        />
                    ))}
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;