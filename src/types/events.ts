export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
}
export interface CreateEventData {
    title: string;
    description: string;
    date: string;
    location: string;
}