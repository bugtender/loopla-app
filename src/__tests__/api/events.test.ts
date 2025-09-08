import { POST } from '@/app/api/events/route';
import fs from 'fs';

jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

class MockRequest {
  constructor(private body: string) {}
  
  async json() {
    return JSON.parse(this.body);
  }
}

describe('/api/events', () => {
  const mockEventsData = [
    {
      id: '1',
      title: 'Test Event 🎉',
      description: 'Test description',
      date: '2025-12-25T10:00:00.000Z',
      location: 'TEST LOCATION'
    }
  ];

  describe('POST', () => {
    const validEventData = {
      title: 'New Event 🚀',
      description: 'New event description',
      date: '2025-12-31T15:00:00.000Z',
      location: 'new location'
    };

    beforeEach(() => {
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockEventsData));
      mockFs.existsSync.mockReturnValue(true);
      mockFs.writeFileSync.mockImplementation(() => {});

      jest.spyOn(Date, 'now').mockReturnValue(1234567890);
    });

    it('should create a new event successfully', async () => {
      const request = new MockRequest(JSON.stringify(validEventData)) as any;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe(validEventData.title);
      expect(data.location).toBe('NEW LOCATION');
      expect(data.id).toBe('1234567890');
      expect(mockFs.writeFileSync).toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      const invalidData = {
        description: 'Missing required fields'
      };

      const request = new MockRequest(JSON.stringify(invalidData)) as any;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Title, date and location are required');
    });

    it('should handle file write errors', async () => {
      mockFs.writeFileSync.mockImplementation(() => {
        throw new Error('Write failed');
      });

      const request = new MockRequest(JSON.stringify(validEventData)) as any;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Fail to create event');
    });
    
    it('should convert location to uppercase', async () => {
      const request = new MockRequest(JSON.stringify(validEventData)) as any;

      const response = await POST(request);
      const data = await response.json();

      expect(data.location).toBe('NEW LOCATION');
    });
  });
});