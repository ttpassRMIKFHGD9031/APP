
import React, { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Artist, Event, View } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EventCalendarView from './components/EventCalendarView';
import ArtistSearchView from './components/ArtistSearchView';
import SettingsView from './components/SettingsView';
import MyArtistsView from './components/MyArtistsView';

const App: React.FC = () => {
    const [myArtists, setMyArtists] = useLocalStorage<Artist[]>('myArtists', []);
    const [events, setEvents] = useLocalStorage<Event[]>('events', []);
    const [wallpaperUrl, setWallpaperUrl] = useLocalStorage<string>('wallpaperUrl', 'https://picsum.photos/seed/bg/1920/1080');
    const [view, setView] = useState<View>('dashboard');

    const addArtist = useCallback((artist: Artist) => {
        if (!myArtists.find(a => a.name === artist.name)) {
            setMyArtists([...myArtists, artist]);
        }
    }, [myArtists, setMyArtists]);

    const removeArtist = useCallback((artistName: string) => {
        setMyArtists(myArtists.filter(a => a.name !== artistName));
        setEvents(events.filter(e => e.artistName !== artistName));
    }, [myArtists, setMyArtists, events, setEvents]);

    const addEvent = useCallback((event: Event) => {
        setEvents([...events, { ...event, id: Date.now().toString() }]);
    }, [events, setEvents]);

    const removeEvent = useCallback((eventId: string) => {
        setEvents(events.filter(e => e.id !== eventId));
    }, [events, setEvents]);
    
    const appStyle = useMemo(() => ({
        backgroundImage: `url(${wallpaperUrl})`,
    }), [wallpaperUrl]);

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard events={events} myArtists={myArtists} />;
            case 'calendar':
                return <EventCalendarView events={events} myArtists={myArtists} addEvent={addEvent} removeEvent={removeEvent} />;
            case 'my-artists':
                return <MyArtistsView myArtists={myArtists} removeArtist={removeArtist} setView={setView} />;
            case 'search':
                return <ArtistSearchView addArtist={addArtist} />;
            case 'settings':
                return <SettingsView wallpaperUrl={wallpaperUrl} setWallpaperUrl={setWallpaperUrl} />;
            default:
                return <Dashboard events={events} myArtists={myArtists} />;
        }
    };

    return (
        <div className="min-h-screen w-full bg-cover bg-center bg-fixed" style={appStyle}>
            <div className="min-h-screen w-full bg-black bg-opacity-70 backdrop-blur-sm">
                <Header setView={setView} currentView={view} />
                <main className="p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default App;
