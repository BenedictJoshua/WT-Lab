require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 3 },
  email: { type: String, required: true, trim: true, lowercase: true },
  mobile: { type: String, required: true, match: /^[0-9]{10}$/ },
  age: { type: Number, required: true, min: 18, max: 60 },
  favouriteFood: { type: String, required: true, trim: true }
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);

app.get('/api/health', (_req, res) => {
  res.json({
    server: 'running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/customers', async (_req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 }).lean();
    res.json(customers);
  } catch (error) {
    console.error('Fetch customers failed:', error.message);
    res.status(500).json({ error: 'Unable to retrieve registrations. Check the database connection.' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    console.error('Save customer failed:', error.message);
    res.status(400).json({ error: error.message || 'Invalid registration data.' });
  }
});

async function startServer() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing. Add it to backend/.env (see .env.example).');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected successfully.');
    app.listen(PORT, () => {
      console.log(`Ziv Celestial backend running at http://localhost:${PORT}`);
      console.log(`Experiment 10: http://localhost:${PORT}/exp10.html`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.error('Check MONGODB_URI, network access and MongoDB service.');
    process.exit(1);
  }
}

startServer();
