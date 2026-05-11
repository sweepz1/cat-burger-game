import { kv } from '@vercel/kv';

export default async function (req, res) {
  if (req.method === 'GET') {
    const raw = await kv.zrange('leaderboard', 0, 9, { rev: true, withScores: true });
    const scores = [];
    for (let i = 0; i < raw.length; i += 2) {
      scores.push({ name: raw[i], score: raw[i + 1] });
    }
    return res.json(scores);
  }
  
  if (req.method === 'POST') {
    const { name, score } = req.body;
    await kv.zadd('leaderboard', { score, member: name });
    return res.json({ ok: true });
  }
}
