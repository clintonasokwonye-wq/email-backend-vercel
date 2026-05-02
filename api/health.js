export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Zoho email backend is running',
    timestamp: new Date().toISOString()
  });
}
