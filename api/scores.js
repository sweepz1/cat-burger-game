import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function (req, res) {
  if (req.method === 'GET') {
    const raw = await redis.zrange('leaderboard', 0, 9, { rev: true, withScores: true });
    const scores = [];
    for (let i = 0; i < raw.length; i += 2) {
      scores.push({ name: raw[i], score: raw[i + 1] });
    }
    return res.json(scores);
  }

  if (req.method === 'POST') {
    const { name, score } = req.body;
    await redis.zadd('leaderboard', { score, member: name });
    return res.json({ ok: true });
  }
}
