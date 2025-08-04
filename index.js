const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fetch = require('node-fetch');



dotenv.config();
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const whoCanAccess = process.env.WHO_CAN_ACCESS

app.use((req, res, next) => {
  const origin = req.get('origin');
  console.log('Origin:', origin);
  console.log('coming:', whoCanAccess);
  if (origin !== whoCanAccess) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});


app.post('/api/proxy', async (req, res) => {
  try {
    // Make sure MAILER_API_URL and SECRET_KEY are set in your .env
    const response = await fetch(process.env.MAILER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.GLENSCOTT_MAILER_API_KEY  // Secret key injected here, NOT from frontend
      },
      body: JSON.stringify(req.body)
    });

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend middleware running on port ${PORT}`);
});
