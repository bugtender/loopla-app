import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { Event } from "@/app/types/events";


const eventFilePath = path.join(process.cwd(), 'data', 'events.json')

function readEventsFromFile(): Event[] {
    try {
        const content = fs.readFileSync(eventFilePath, 'utf8')
        return JSON.parse(content)
    } catch {
        return [];
    }
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