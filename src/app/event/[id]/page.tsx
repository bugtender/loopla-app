import { notFound } from "next/navigation";
import Link from "next/link";
import { Event } from "@/types/events"
import fs from 'fs';
import path from "path";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";

async function getEvent(id: string): Promise<Event | null> {
  try {
    const eventsFilePath = path.join(process.cwd(), "data", "events.json");
    const fileContents = fs.readFileSync(eventsFilePath, "utf8");
    const events: Event[] = JSON.parse(fileContents);
    return events.find((event) => event.id === id) || null;
  } catch {
    return null;
  }
}

export default async function EventDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <Box sx={{ bgcolor: "grey.50", py: 6, minHeight: "100vh" }}>
      <Container maxWidth="sm">
        <Box sx={{ mb: 3 }}>
          <Button component={Link} href="/" variant="text" color="primary">
            Back to Events
          </Button>
        </Box>

        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {event.title}
              </Typography>
            </Box>

            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  📅 Date & Time
                </Typography>
                <Typography variant="body1">{dayjs(event.date).format("YYYY-MM-DD HH:mm")}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  📍 Location
                </Typography>
                <Typography variant="body1">{event.location}</Typography>
              </Grid>
            </Grid>
 
            {event.description && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  📝 Description
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {event.description}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Button component={Link} href="/" variant="contained" color="primary">
                Back to All Events
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}