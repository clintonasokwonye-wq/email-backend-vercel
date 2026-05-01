import Nylas from 'nylas';

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY,
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { grantId, messageId, unread, starred, folders } = req.body;

    if (!grantId || !messageId) {
      return res.status(400).json({ error: 'Grant ID and Message ID are required' });
    }

    const requestBody = {};
    if (typeof unread !== 'undefined') requestBody.unread = unread;
    if (typeof starred !== 'undefined') requestBody.starred = starred;
    if (folders) requestBody.folders = folders;

    const message = await nylas.messages.update({
      identifier: grantId,
      messageId,
      requestBody,
    });

    res.status(200).json({ 
      success: true, 
      message: message.data,
    });
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ error: error.message });
  }
}
