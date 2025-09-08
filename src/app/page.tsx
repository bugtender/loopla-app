'use client';

import { useEffect, useState } from "react";
import { Event } from "@/types/events"
import Link from "next/link";
import {
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  CardActionArea,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid
} from "@mui/material";
import dayjs from "dayjs";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents , setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [sortBy, setSortBy] = useState('title');

  useEffect(()=> {
    fetchEvents()
  }, [])

  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('eventCreateSuccess');
    if(success==='true'){
      setSuccessMessage('Event created successfully! 🎉');
      setTimeout(()=> setSuccessMessage(''), 3000);
      window.history.replaceState({}, '', '/')
    }
  })

  useEffect(() =>{
    const filtered = events.filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase()))

    filtered.sort((a, b) => {
      if(sortBy === 'title'){
        return a.title.length - b.title.length
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      }
    })
  
    setFilteredEvents(filtered)
  },[events, searchTerm, sortBy])

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

          <Link href="/create">
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 3 }}
            >
              Create New Event
            </Button>
          </Link>

          <Grid container spacing={2} sx={{ width: "100%" }}>
            <Grid size={8} >
              <TextField
                fullWidth
                label="Search event by title..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>

            <Grid size={4}>
              <FormControl fullWidth>
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "title" | "date")}
                  label="Sort By"
                >
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          { successMessage && <Alert severity="success">{successMessage}</Alert> }

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
                    📅 {dayjs(event.date).format("dddd, MMMM D, YYYY h:mm A")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📍 {event.location}
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
