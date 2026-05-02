import Imap from 'imap';
import { simpleParser } from 'mailparser';

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

function fetchEmails(imap, limit = 50) {
  return new Promise((resolve, reject) => {
    imap.once('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) {
          reject(err);
          return;
        }

        const total = box.messages.total;
        if (total === 0) {
          imap.end();
          resolve([]);
          return;
        }

        const start = Math.max(1, total - limit + 1);
        const end = total;

        const fetch = imap.seq.fetch(`${start}:${end}`, {
          bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
          struct: true
        });

        const emails = [];

        fetch.on('message', (msg, seqno) => {
          let buffer = '';
          let attributes = null;

          msg.on('body', (stream, info) => {
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
          });

          msg.once('attributes', (attrs) => {
            attributes = attrs;
          });

          msg.once('end', () => {
            simpleParser(buffer).then((parsed) => {
              emails.push({
                id: `${seqno}`,
                subject: parsed.subject || '(No Subject)',
                from: [{
                  name: parsed.from?.value?.[0]?.name || parsed.from?.value?.[0]?.address || 'Unknown',
                  email: parsed.from?.value?.[0]?.address || 'unknown@example.com'
                }],
                to: parsed.to?.value?.map(t => ({ name: t.name, email: t.address })) || [],
                date: parsed.date ? Math.floor(parsed.date.getTime() / 1000) : Math.floor(Date.now() / 1000),
                snippet: (parsed.text || parsed.html || '').substring(0, 200),
                unread: !attributes?.flags?.includes('\\Seen'),
                starred: attributes?.flags?.includes('\\Flagged'),
                body: parsed.html || parsed.text || '',
              });
            }).catch((err) => {
              console.error('Parse error:', err);
            });
          });
        });

        fetch.once('error', (err) => {
          reject(err);
        });

        fetch.once('end', () => {
          imap.end();
          // Sort by date descending (newest first)
          emails.sort((a, b) => b.date - a.date);
          resolve(emails);
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = 50 } = req.query;
    const imap = connectToZoho();
    const messages = await fetchEmails(imap, parseInt(limit));

    res.status(200).json({ 
      messages,
      nextCursor: null,
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch emails'
    });
  }
}
