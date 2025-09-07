'use client';

import { useEffect, useState } from "react";
import { Event } from "./types/events";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents , setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(()=> {
    fetchEvents()
  }, [])

  useEffect(() =>{
    //  quick filter by lowercase
    const filtered = events.filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase()))

    setFilteredEvents(filtered)
  },[events, searchTerm])

  const fetchEvents = async () => {
    try{
      const response = await fetch('/api/events');
      if(response.ok) {
        const data = await response.json();
        setEvents(data)
      }
    } catch (error) {
      console.error('Failed to fetch events: ', error)
    } finally {
      setLoading(false)
    }
  }

  if(loading){
    return (
      <div>Loading events....</div>
    )
  }

  return (
    <div >
      <main >
        <div>
          <input
            type="text"
            placeholder="Search event by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div>
          {filteredEvents.length === 0 ? (
            <p>
              {searchTerm ? 'No events foud match your search' : 'No events'} 
            </p>
          ):(
            filteredEvents.map((event) => (
              <div>
                <h2>{event.title}</h2>
                <p>{event.date}</p>
                <p>{event.location}</p>
              </div>
            )))
          } 
        </div>
      </main>
      <footer>
      </footer>
    </div>
  );
}
