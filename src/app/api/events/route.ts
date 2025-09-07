import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { CreateEventData, Event } from "@/app/types/events";

const eventFilePath = path.join(process.cwd(), 'data', 'events.json')

function readEventsFromFile(): Event[] {
  try {
    const content = fs.readFileSync(eventFilePath, 'utf8')
    return JSON.parse(content)
  } catch {
    return [];
}
}

function writeEventToFile(events: Event[]): void {
  const dir = path.dirname(eventFilePath)
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir, {recursive: true});
  }
  fs.writeFileSync(eventFilePath, JSON.stringify(events, null, 2))
}

export async function GET(){
  try{
    const events = readEventsFromFile()
    return NextResponse.json(events)
      
  } catch {
    return NextResponse.json(
        {error: 'Failed to get events'},
        {status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateEventData = await request.json();

    const { title, date, description, location } = body

    if( !title || !date || !location){
      return NextResponse.json(
        {error: 'Title, date and location are required'},
        {status: 400 }
      )
    }

    // const emojiRegex = ''
    // if (!emojiReget.test(title)){
    //   return NextResponse.json(
    //     {error: 'Title must contain at least an emoji at the end'},
    //     {status: 400 }
    //   )
    // }

    const events = readEventsFromFile();
    const newEvent: Event = {
      id: Date.now.toString(),
      title: title,
      description: description || '',
      date: new Date(date).toISOString(),
      location: location.toUpperCase()
    }

    events.push(newEvent);
    writeEventToFile(events)

    return NextResponse.json(newEvent, { status: 201 })
  } catch {
    return NextResponse.json(
      {error: 'Fail to create event'},
      {status: 500}
    )
  }
}