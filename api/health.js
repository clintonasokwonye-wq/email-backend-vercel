export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Email backend server is running',
    timestamp: new Date().toISOString()
  });
}
