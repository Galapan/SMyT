const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes or other modules here
// const { supabase } = require('./supabaseClient');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Prueba 1');
});

// Example route using Supabase (if needed directly)
// app.get('/api/test', async (req, res) => {
//   const { data, error } = await supabase.from('test').select('*');
//   res.json({ data, error });
// });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
