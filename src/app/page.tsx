'use client';

import { useEffect, useState } from "react";
import { Event } from "./types/events";

export default function Home() {

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(()=> {
    fetchEvents()
  }, [])

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
        <div >
          {events.map((event) => (
            <div>
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <p>{event.date}</p>
            </div>
          ))}
        </div>
      </main>
      <footer>
      </footer>
    </div>
  );
}
