import express from 'express';
import next from 'next';
import mongoose from 'mongoose';
import { StreetLight } from './models/StreetLight.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.prepare().then(() => {
  const server = express();

  server.use(express.json());

  // API routes
  server.get('/api/streetlights', async (req, res) => {
    const streetlights = await StreetLight.find();
    res.json(streetlights);
  });

  server.post('/api/streetlights', async (req, res) => {
    const newStreetLight = new StreetLight(req.body);
    await newStreetLight.save();
    res.json(newStreetLight);
  });

  // Next.js pages
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
