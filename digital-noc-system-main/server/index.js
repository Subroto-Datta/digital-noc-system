require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();
const nocRoutes = require('./routes/noc');

app.use(cors());

connectDB(); // Connect to DB

app.use(express.json());
app.use('/noc', nocRoutes);

app.get('/noc/test', (req, res) => {
  res.send("noc test route");
})

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend running ✅' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});