import axios from 'axios';
import { sendText } from '@/lib/whatsapp';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WhatsApp helper', () => {
  const envBackup = process.env;
  beforeAll(() => {
    process.env.WA_TOKEN = 'test_token';
    process.env.WA_NUMBER = '123456';
  });
  afterAll(() => {
    process.env = envBackup;
  });

  it('posts to correct endpoint with bearer token', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { messages: ['id'] },
      status: 200,
    });

    const res = await sendText('60123456789', 'Hello');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://graph.facebook.com/v18.0/123456/messages',
      expect.objectContaining({ to: '60123456789', text: { body: 'Hello' } }),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test_token',
        }),
      })
    );
    expect(res.success).toBe(true);
  });
});
