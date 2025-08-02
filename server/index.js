const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend running ✅' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});