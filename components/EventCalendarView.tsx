import React, { useState } from 'react';
import { Event, Artist } from '../types';
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths
} from 'date-fns';
import { PlusIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from './icons/Icons';

interface EventCalendarViewProps {
    events: Event[];
    myArtists: Artist[];
    addEvent: (event: Event) => void;
    removeEvent: (eventId: string) => void;
}

const EventCalendarView: React.FC<EventCalendarViewProps> = ({ events, myArtists, addEvent, removeEvent }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [showEventForm, setShowEventForm] = useState(false);

    const selectedDayEvents = events.filter(event => selectedDate && isSameDay(new Date(event.date), selectedDate));

    const renderHeader = () => (
        <div className="flex items-center justify-between py-2 px-1">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                <ChevronLeftIcon />
            </button>
            <h2 className="font-bold text-xl text-white">{format(currentMonth, 'MMMM yyyy')}</h2>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                <ChevronRightIcon />
            </button>
        </div>
    );

    const renderDays = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return (
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400">
                {days.map(day => <div key={day} className="py-2">{day}</div>)}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        const days = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="grid grid-cols-7">
                {days.map((day, index) => {
                    const eventsOnDay = events.filter(event => isSameDay(new Date(event.date), day));
                    return (
                        <div
                            key={index}
                            className={`h-24 p-1 border-t border-l border-gray-700 flex flex-col justify-start relative transition-colors ${
                                !isSameMonth(day, monthStart) ? 'bg-gray-800 bg-opacity-50 text-gray-500' : 'bg-gray-900 bg-opacity-30 hover:bg-gray-700'
                            } ${isSameDay(day, new Date()) ? 'bg-purple-800' : ''} ${selectedDate && isSameDay(day, selectedDate) ? 'ring-2 ring-purple-500' : ''}`}
                            onClick={() => setSelectedDate(day)}
                        >
                            <span className={`font-medium ${isSameDay(day, new Date()) ? 'text-white' : ''}`}>{format(day, 'd')}</span>
                            <div className="flex-grow overflow-y-auto mt-1">
                                {eventsOnDay.map(e => (
                                    <div key={e.id} className="text-xs truncate bg-purple-600 text-white rounded px-1 mb-0.5">{e.title}</div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // ✅ Omit<Event, 'id'> を受け取って Event に変換する関数を中で定義
    const handleAddEvent = (eventData: Omit<Event, 'id'>) => {
        const newEvent: Event = {
            ...eventData,
            id: Date.now().toString(), // ユニークIDを生成
        };
        addEvent(newEvent);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-2 bg-gray-800 bg-opacity-60 rounded-xl shadow-lg p-4">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>
            <div className="space-y-6">
                <div className="bg-gray-800 bg-opacity-60 rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">
                        Events for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : '...'}
                    </h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedDayEvents.length > 0 ? selectedDayEvents.map(event => (
                            <div key={event.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-purple-300">{event.title}</p>
                                    <p className="text-sm text-gray-300">{event.artistName} - {event.type}</p>
                                </div>
                                <button onClick={() => removeEvent(event.id)} className="text-gray-400 hover:text-red-500 p-1 rounded-full"><TrashIcon /></button>
                            </div>
                        )) : <p className="text-gray-400">No events for this day.</p>}
                    </div>
                </div>

                <div className="bg-gray-800 bg-opacity-60 rounded-xl shadow-lg p-6">
                    <button onClick={() => setShowEventForm(!showEventForm)} className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500">
                        <PlusIcon />
                        {showEventForm ? 'Close Form' : 'Add New Event'}
                    </button>
                    {/* ✅ 型を変換した handleAddEvent を渡す */}
                    {showEventForm && (
                        <EventForm
                            myArtists={myArtists}
                            addEvent={handleAddEvent}
                            preselectedDate={selectedDate}
                            closeForm={() => setShowEventForm(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

interface EventFormProps {
    myArtists: Artist[];
    addEvent: (event: Omit<Event, 'id'>) => void;
    preselectedDate: Date | null;
    closeForm: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ myArtists, addEvent, preselectedDate, closeForm }) => {
    const [title, setTitle] = useState('');
    const [artistName, setArtistName] = useState(myArtists[0]?.name || '');
    const [date, setDate] = useState(preselectedDate ? format(preselectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
    const [type, setType] = useState<Event['type']>('Live');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !artistName || !date) {
            alert('Please fill all fields.');
            return;
        }
        addEvent({ title, artistName, date, type });
        setTitle('');
        setArtistName(myArtists[0]?.name || '');
        setType('Live');
        closeForm();
    };

    if (myArtists.length === 0) {
        return <p className="text-yellow-400 mt-4 text-center">Please add an artist first before creating an event.</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 animate-fade-in-sm">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">Event Title</label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
                <label htmlFor="artistName" className="block text-sm font-medium text-gray-300">Artist</label>
                <select id="artistName" value={artistName} onChange={e => setArtistName(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                    {myArtists.map(artist => <option key={artist.name} value={artist.name}>{artist.name}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-300">Date</label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-300">Event Type</label>
                <select id="type" value={type} onChange={e => setType(e.target.value as Event['type'])} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                    <option>Live</option>
                    <option>Release</option>
                    <option>TV Appearance</option>
                    <option>Other</option>
                </select>
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">Save Event</button>
        </form>
    );
};

export default EventCalendarView;
