import Imap from 'imap';

function connectToZoho() {
  return new Imap({
    user: process.env.ZOHO_EMAIL,
    password: process.env.ZOHO_PASSWORD,
    host: 'imap.zoho.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  });
}

function updateEmail(imap, messageId, updates) {
  return new Promise((resolve, reject) => {
    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err) => {
        if (err) {
          reject(err);
          return;
        }

        const flags = [];
        if (typeof updates.unread !== 'undefined') {
          flags.push(updates.unread ? '-\\Seen' : '\\Seen');
        }
        if (typeof updates.starred !== 'undefined') {
          flags.push(updates.starred ? '\\Flagged' : '-\\Flagged');
        }

        if (flags.length === 0) {
          imap.end();
          resolve({ success: true });
          return;
        }

        imap.seq.addFlags(messageId, flags, (err) => {
          imap.end();
          if (err) {
            reject(err);
          } else {
            resolve({ success: true });
          }
        });
      });
    });

    imap.once('error', (err) => {
      reject(err);
    });

    imap.connect();
  });
}

export default async function handler(req, res) {
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
    const { messageId, unread, starred } = req.body;

    if (!messageId) {
      return res.status(400).json({ error: 'Message ID is required' });
    }

    const imap = connectToZoho();
    await updateEmail(imap, messageId, { unread, starred });

    res.status(200).json({ 
      success: true,
    });
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to update email'
    });
  }
}
