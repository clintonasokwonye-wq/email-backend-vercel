import Nylas from 'nylas';

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY,
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { grantId, q, limit = 50 } = req.query;

    if (!grantId || !q) {
      return res.status(400).json({ error: 'Grant ID and search query are required' });
    }

    const messages = await nylas.messages.list({
      identifier: grantId,
      queryParams: {
        searchQueryNative: q,
        limit: parseInt(limit),
      },
    });

    res.status(200).json({ messages: messages.data });
  } catch (error) {
    console.error('Error searching emails:', error);
    res.status(500).json({ error: error.message });
  }
}
