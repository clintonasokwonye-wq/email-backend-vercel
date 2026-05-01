import Nylas from 'nylas';

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY,
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { grantId, to, cc, bcc, subject, body, replyToMessageId } = req.body;

    if (!grantId || !to || !subject) {
      return res.status(400).json({ error: 'Grant ID, recipient, and subject are required' });
    }

    const requestBody = {
      to: Array.isArray(to) ? to : [{ email: to }],
      subject,
      body: body || '',
    };

    if (cc) requestBody.cc = Array.isArray(cc) ? cc : [{ email: cc }];
    if (bcc) requestBody.bcc = Array.isArray(bcc) ? bcc : [{ email: bcc }];
    if (replyToMessageId) requestBody.replyToMessageId = replyToMessageId;

    const message = await nylas.messages.send({
      identifier: grantId,
      requestBody,
    });

    res.status(200).json({ 
      success: true, 
      messageId: message.data.id,
      message: message.data,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message });
  }
}
