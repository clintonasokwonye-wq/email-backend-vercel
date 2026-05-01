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
    const { grantId, folder = 'inbox', limit = 50, offset = 0 } = req.query;

    if (!grantId) {
      return res.status(400).json({ error: 'Grant ID is required' });
    }

    const messages = await nylas.messages.list({
      identifier: grantId,
      queryParams: {
        in: [folder],
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });

    res.status(200).json({ 
      messages: messages.data,
      nextCursor: messages.nextCursor,
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: error.message });
  }
}
