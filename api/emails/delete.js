import Nylas from 'nylas';

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY,
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { grantId, messageId } = req.query;

    if (!grantId || !messageId) {
      return res.status(400).json({ error: 'Grant ID and Message ID are required' });
    }

    await nylas.messages.destroy({
      identifier: grantId,
      messageId,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ error: error.message });
  }
}
