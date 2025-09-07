'use client';

import { useEffect, useState } from "react";
import { Event } from "@/types/events"
import Link from "next/link";
import { Container, TextField, Typography, Card, CardContent, Box, Button, CardActionArea, CircularProgress } from "@mui/material";
import dayjs from "dayjs";

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
    //  events sorted by length of title, shortest first
    filtered.sort((a, b) => {
      return a.title.length - b.title.length
    })
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "grey.50", py: 6, minHeight: "100vh" }}>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Upcoming Event
          </Typography>


          <Link href="/new-event">
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 3 }}
            >
              Create New Event
            </Button>
          </Link>


          <TextField
            fullWidth
            label="Search event by title..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {filteredEvents.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              {searchTerm ? "No events found matching your search" : "No events"}
            </Typography>
          ) : (
            filteredEvents.map((event) => (
             <Card sx={{ width: "100%" }} key={event.id}>
              <CardActionArea component={Link} href={`/event/${event.id}`}>
                <CardContent>
                  <Typography variant="h6">{event.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dayjs(event.date).format("YYYY-MM-DD HH:mm")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.location}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            ))
          )}
        </Box>
      </Container>
    </Box>
  );
}
