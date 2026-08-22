require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/profile', require('./src/routes/profile'));
app.use('/api/schemes', require('./src/routes/schemes'));
app.use('/api/eligibility', require('./src/routes/eligibility'));
app.use('/api/bot', require('./src/routes/bot'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'SchemeSaathi API' }));

app.listen(PORT, () => {
  console.log(`SchemeSaathi server running on http://localhost:${PORT}`);
});
