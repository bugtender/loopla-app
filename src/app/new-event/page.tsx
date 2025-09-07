"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { CreateEventData } from "@/types/events";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function CreateEvent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateEventData>({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  const [errors, setErrors] = useState<Partial<CreateEventData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateEventData> = {};

    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.date = "Date must be in the future";
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/");
      } else {
        const errorData = await response.json();
        setErrors({ title: errorData.error });
      }
    } catch {
      setErrors({ title: "Error creating event" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof CreateEventData])
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
  };

  return (
    <Box sx={{ bgcolor: "grey.50", py: 6, minHeight: "100vh" }}>
      <Container maxWidth="sm">
        <Box sx={{ mb: 3 }}>
          <Button component={Link} href="/" variant="text" color="primary">
            Back to Events
          </Button>
        </Box>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Create New Event
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title (must end with emoji)"
                error={Boolean(errors.title)}
                helperText={errors.title}
                fullWidth
              />

              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter event description"
                multiline
                rows={4}
                error={Boolean(errors.description)}
                helperText={errors.description}
                fullWidth
              />

              <DateTimePicker
                label="Date & Time"
                onChange={(newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    date: newValue ? newValue.toISOString() : "",
                  }));
                  if (errors.date) {
                    setErrors((prev) => ({ ...prev, date: "" }));
                  }
                }}
                minDate={dayjs(new Date())}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: Boolean(errors.date),
                    helperText: errors.date,
                  },
                }}
              />

              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={Boolean(errors.location)}
                placeholder="Enter event location"
                helperText={errors.location}
                fullWidth
              />

              <Box sx={{ display: "flex", justifyContent: "end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
              </Box>
            </Box>
          </LocalizationProvider>
        </Paper>
      </Container>
    </Box>
  );
}