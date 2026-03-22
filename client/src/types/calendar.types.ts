export type ViewType = 'day' | 'week' | 'month' | 'year';

export interface ICalendarEvent {
    type: 'visits' | 'calls' | 'tasks';
    count: number;
}

export interface IDetailedEvent {
    time: string;
    title: string;
    doctor: string;
    room: string;
    type: 'visit' | 'call';
    exam: string;
}

export interface ICalendarState {
    currentDate: Date;
    view: ViewType;
}