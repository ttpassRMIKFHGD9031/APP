
import React from 'react';
import { Event, Artist } from '../types';
import { format, isWithinInterval, addDays, startOfDay } from 'date-fns';
import { BellIcon, CalendarDaysIcon } from './icons/Icons';

interface DashboardProps {
    events: Event[];
    myArtists: Artist[];
}

const Dashboard: React.FC<DashboardProps> = ({ events, myArtists }) => {
    const today = startOfDay(new Date());
    const nextSevenDays = addDays(today, 7);

    const upcomingEvents = events
        .filter(event => {
            const eventDate = startOfDay(new Date(event.date));
            return isWithinInterval(eventDate, { start: today, end: nextSevenDays });
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-white">Welcome to Oshi-Navi</h2>
                <p className="text-gray-300 mt-2">Your central hub for all fan activities. Here's what's coming up.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-gray-800 bg-opacity-60 p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-xl text-white flex items-center"><UserGroupIcon /> My Artists</h3>
                    <p className="text-5xl font-bold text-purple-400 mt-4">{myArtists.length}</p>
                    <p className="text-gray-400">artists tracked</p>
                </div>
                 <div className="bg-gray-800 bg-opacity-60 p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-xl text-white flex items-center"><CalendarDaysIcon /> Total Events</h3>
                    <p className="text-5xl font-bold text-cyan-400 mt-4">{events.length}</p>
                    <p className="text-gray-400">events scheduled</p>
                </div>
            </div>

            <div className="bg-gray-800 bg-opacity-60 p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <BellIcon />
                    <span className="ml-2">Upcoming Events (Next 7 Days)</span>
                </h3>
                {upcomingEvents.length > 0 ? (
                    <ul className="space-y-4">
                        {upcomingEvents.map(event => (
                            <li key={event.id} className="p-4 bg-gray-700 bg-opacity-50 rounded-lg flex items-center justify-between transition-transform hover:scale-105">
                                <div>
                                    <p className="font-bold text-purple-300">{event.title}</p>
                                    <p className="text-sm text-gray-300">{event.artistName} - <span className="font-semibold">{event.type}</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-white">{format(new Date(event.date), 'EEE, MMM d')}</p>
                                    <p className="text-sm text-gray-400">{format(new Date(event.date), 'yyyy')}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-center py-4">No events scheduled in the next 7 days.</p>
                )}
            </div>
        </div>
    );
};

// Dummy Icon components for Dashboard
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;


export default Dashboard;
