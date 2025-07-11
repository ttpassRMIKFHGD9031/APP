
import React, { useState } from 'react';
import { searchArtist } from '../services/geminiService';
import { Artist } from '../types';
import { MagnifyingGlassIcon, PlusIcon, ExternalLinkIcon } from './icons/Icons';

interface ArtistSearchViewProps {
    addArtist: (artist: Artist) => void;
}

const Spinner: React.FC = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
);

const ArtistSearchView: React.FC<ArtistSearchViewProps> = ({ addArtist }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<Artist | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const artistData = await searchArtist(query);
            setResult(artistData);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-gray-800 bg-opacity-60 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Search for an Artist</h2>
                <form onSubmit={handleSearch} className="flex space-x-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., 'Ado', 'YOASOBI'"
                        className="flex-grow bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner /> : <MagnifyingGlassIcon />}
                        <span className="ml-2 hidden sm:inline">Search</span>
                    </button>
                </form>
            </div>

            {error && (
                <div className="mt-6 bg-red-900 bg-opacity-80 p-4 rounded-lg text-red-200 text-center">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            )}

            {result && (
                <div className="mt-6 bg-gray-800 bg-opacity-60 p-6 rounded-xl shadow-lg animate-fade-in-sm">
                    <h3 className="text-xl font-bold text-white">{result.name}</h3>
                    <p className="text-purple-300 font-semibold mt-1">{result.genre}</p>
                    <p className="text-gray-300 mt-4">{result.description}</p>
                    <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                        {result.officialWebsite && (
                            <a
                                href={result.officialWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-center py-2 px-4 border border-cyan-500 rounded-md text-sm font-medium text-cyan-300 hover:bg-cyan-500 hover:text-white transition-colors"
                            >
                                <ExternalLinkIcon />
                                Official Website
                            </a>
                        )}
                        <button
                            onClick={() => addArtist(result)}
                            className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                            <PlusIcon />
                            Add to My Artists
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArtistSearchView;
