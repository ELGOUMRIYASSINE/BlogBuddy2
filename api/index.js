// Vercel serverless function for the API
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Dynamic import the server
    const { default: app } = await import('../dist/server/index.js');
    return app(req, res);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server Error' });
  }
}