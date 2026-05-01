// Shared storage (in production, use a database like Vercel KV or Supabase)
const connectedAccounts = new Map();

export default function handler(req, res) {
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
    const { grantId, accountName, email } = req.body;
    
    if (!grantId) {
      return res.status(400).json({ error: 'Grant ID is required' });
    }

    // Store the account info
    const account = {
      id: grantId,
      grantId,
      name: accountName || email || 'Email Account',
      email,
      connectedAt: new Date().toISOString(),
    };

    connectedAccounts.set(grantId, account);

    res.status(200).json({ 
      success: true, 
      account 
    });
  } catch (error) {
    console.error('Error saving account:', error);
    res.status(500).json({ error: error.message });
  }
}
