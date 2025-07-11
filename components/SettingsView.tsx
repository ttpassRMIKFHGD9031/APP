
import React, { useState } from 'react';
import { Cog6ToothIcon, PhotoIcon } from './icons/Icons';

interface SettingsViewProps {
    wallpaperUrl: string;
    setWallpaperUrl: (url: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ wallpaperUrl, setWallpaperUrl }) => {
    const [inputUrl, setInputUrl] = useState(wallpaperUrl);
    
    const handleSave = () => {
        setWallpaperUrl(inputUrl);
        alert('Wallpaper updated!');
    };
    
    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
             <div className="bg-gray-800 bg-opacity-60 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Cog6ToothIcon />
                    <span className="ml-2">Settings</span>
                </h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="wallpaper-url" className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                            <PhotoIcon />
                            <span className="ml-2">Background Wallpaper URL</span>
                        </label>
                        <p className="text-xs text-gray-400 mb-2">Enter the URL of an image to set as your app background. Try sites like Unsplash or use a direct image link.</p>
                        <input
                            type="text"
                            id="wallpaper-url"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {inputUrl && (
                        <div>
                            <p className="text-sm font-medium text-gray-300 mb-2">Preview:</p>
                            <div className="w-full h-40 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${inputUrl})` }}></div>
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                    >
                        Save Settings
                    </button>
                </div>
             </div>
        </div>
    );
};

export default SettingsView;
