import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv(); // Menggunakan environment variables Vercel

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Handle preflight requests
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { active } = req.body;

    if (typeof active !== 'boolean') {
      return res.status(400).json({ error: 'Invalid status provided' });
    }

    await redis.set('website_active', String(active)); // Simpan sebagai string 'true' atau 'false'

    res.status(200).json({ message: 'Status updated successfully', active });
  } catch (error) {
    console.error('Error setting website status:', error);
    res.status(500).json({ error: 'Failed to set status' });
  }
}