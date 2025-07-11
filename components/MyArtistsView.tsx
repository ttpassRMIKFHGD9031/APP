
import React from 'react';
import { Artist, View } from '../types';
import { TrashIcon, PlusIcon, ExternalLinkIcon, UserGroupIcon } from './icons/Icons';

interface MyArtistsViewProps {
    myArtists: Artist[];
    removeArtist: (artistName: string) => void;
    setView: (view: View) => void;
}

const ArtistCard: React.FC<{ artist: Artist; onRemove: () => void; }> = ({ artist, onRemove }) => {
    // Generate a consistent placeholder image based on the artist's name
    const imageUrl = `https://picsum.photos/seed/${artist.name}/400/250`;
    
    return (
        <div className="bg-gray-800 bg-opacity-70 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-purple-500/20">
            <img src={imageUrl} alt={`${artist.name}`} className="w-full h-40 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-bold text-white truncate">{artist.name}</h3>
                <p className="text-sm text-purple-300 font-medium">{artist.genre}</p>
                <p className="text-gray-400 text-sm mt-2 h-10 overflow-hidden text-ellipsis">
                    {artist.description}
                </p>
                <div className="mt-4 flex justify-between items-center space-x-2">
                     <a
                        href={artist.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center space-x-2 w-full text-center px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                            artist.officialWebsite ? 'border-cyan-500 text-cyan-300 hover:bg-cyan-500 hover:text-white' : 'border-gray-600 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={e => !artist.officialWebsite && e.preventDefault()}
                    >
                        <ExternalLinkIcon />
                        <span>Website</span>
                    </a>
                    <button onClick={onRemove} className="flex items-center justify-center space-x-2 w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium">
                        <TrashIcon />
                        <span>Remove</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const MyArtistsView: React.FC<MyArtistsViewProps> = ({ myArtists, removeArtist, setView }) => {
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white flex items-center"><UserGroupIcon /><span className="ml-2">My Artists</span></h2>
                 <button onClick={() => setView('search')} className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium">
                    <PlusIcon />
                    <span>Add Artist</span>
                </button>
            </div>
            {myArtists.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {myArtists.map(artist => (
                        <ArtistCard key={artist.name} artist={artist} onRemove={() => removeArtist(artist.name)} />
                    ))}
                 </div>
            ) : (
                <div className="text-center py-16 bg-gray-800 bg-opacity-60 rounded-xl">
                    <h3 className="text-xl font-semibold text-white">Your artist list is empty.</h3>
                    <p className="text-gray-400 mt-2">Start by searching for an artist to add to your collection.</p>
                </div>
            )}
        </div>
    );
};

export default MyArtistsView;
