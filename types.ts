
export interface Artist {
    name: string;
    genre: string;
    description: string;
    officialWebsite: string;
}

export interface Event {
    id: string;
    artistName: string;
    title: string;
    date: string; // YYYY-MM-DD format
    type: 'Live' | 'Release' | 'TV Appearance' | 'Other';
}

export type View = 'dashboard' | 'calendar' | 'my-artists' | 'search' | 'settings';
