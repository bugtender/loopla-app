'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateEventData } from "../types/events";

export default function CreateEvent(){
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    date: '',
    location: ''
  });

  const [errors, setErrors] = useState<Partial<CreateEventData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateEventData> = {}

    if(!formData.date){
      newErrors.date = "Date is required"
    } else {
      const selectedDate = new Date(formData.date)
      const now = new Date();
      if( selectedDate <= now) {
        newErrors.date= 'Date must be in the future'
      }
    }

    if(!formData.location.trim()){
      newErrors.location = 'location is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length ===0

  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true)

    try {
      const response = await fetch('api/events', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if(response.ok) {
        router.push('/?')
      }else {
        const errorData = await response.json();
        setErrors({ title: errorData.error })
      }
    } catch {
      setErrors({ title: "Error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if(errors[name as keyof CreateEventData]) 
      setErrors(prev => ({
        ...prev,
      [name]:''
      }));
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit} >
          <input
            type='text'
            name='title'
            id='title'
            onChange={handleChange}
            placeholder="Enter event title (must end with emoji)"
          />
          <textarea
            id='description'
            name='description'
            value = {formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter event's description"
          />
          <input
            type="datetime-local"
            id='date'
            name='date'
            value={formData.date}
            onChange={handleChange}
          />
          <input
            type="text"
            id='location'
            name='location'
            value={formData.location}
            onChange={handleChange}
          />
          
          <button
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create event' }
          </button>
        </form>
      </div>
    </div>
  )
}