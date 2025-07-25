import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv(); // Menggunakan environment variables Vercel

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Handle preflight requests
  }

  try {
    const isActive = await redis.get('website_active');

    // Jika status belum pernah diset, default ke true
    const status = isActive === null ? true : (isActive === 'true');

    res.status(200).json({ active: status });
  } catch (error) {
    console.error('Error fetching website status:', error);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
}