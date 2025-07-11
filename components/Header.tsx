
import React from 'react';
import { View } from '../types';
import { HomeIcon, CalendarIcon, UserGroupIcon, MagnifyingGlassIcon, Cog6ToothIcon } from './icons/Icons';

interface HeaderProps {
    setView: (view: View) => void;
    currentView: View;
}

const NavItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ setView, currentView }) => {
    return (
        <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wider">Oshi-Navi</h1>
                    </div>
                    <nav className="flex items-center space-x-2 sm:space-x-4">
                        <NavItem label="Dashboard" icon={<HomeIcon />} isActive={currentView === 'dashboard'} onClick={() => setView('dashboard')} />
                        <NavItem label="Calendar" icon={<CalendarIcon />} isActive={currentView === 'calendar'} onClick={() => setView('calendar')} />
                        <NavItem label="My Artists" icon={<UserGroupIcon />} isActive={currentView === 'my-artists'} onClick={() => setView('my-artists')} />
                        <NavItem label="Search" icon={<MagnifyingGlassIcon />} isActive={currentView === 'search'} onClick={() => setView('search')} />
                        <NavItem label="Settings" icon={<Cog6ToothIcon />} isActive={currentView === 'settings'} onClick={() => setView('settings')} />
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
