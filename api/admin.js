import { Redis } from '@upstash/redis';
const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
const PASS = '1Abcdeghfjsalskdj213474987@#@#%^@*&()(*&^%$#A';

export default async function(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { action, pass, name } = req.body;
  if (pass !== PASS) return res.status(401).json({ error: 'unauthorized' });
  if (action === 'clear') await redis.del('leaderboard');
  if (action === 'delete') await redis.zrem('leaderboard', name);
  return res.json({ ok: true });
}
