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
    // --- TAMBAHKAN LOG INI ---
    console.log(`[set-status] Received 'active' status: ${active} (type: ${typeof active})`); 
    // --- END LOG ---

    if (typeof active !== 'boolean') {
      console.error(`[set-status] Invalid type for 'active': ${typeof active}`); 
      return res.status(400).json({ error: 'Invalid status provided' });
    }

    await redis.set('website_active', String(active)); // Simpan sebagai string 'true' atau 'false'
    // --- TAMBAHKAN LOG INI ---
    console.log(`[set-status] Successfully stored 'website_active' as: ${String(active)}`); 
    // --- END LOG ---

    res.status(200).json({ message: 'Status updated successfully', active });
  } catch (error) {
    console.error('[set-status] Error setting website status:', error);
    res.status(500).json({ error: 'Failed to set status' });
  }
}
