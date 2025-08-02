require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
app.use(cors());

const app = express();
connectDB(); // Connect to DB

app.use(express.json());
const nocRoutes = require('./routes/noc');
app.use('/noc', nocRoutes);
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend running ✅' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});