import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Your Next.js app URL
      methods: ["GET", "POST", "PATCH", "DELETE"]
    }
  });

app.use(cors({
    origin: 'http://localhost:3001', // Main server's address
}));
  
  

mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const streetLightSchema = new mongoose.Schema({
  id: String,
  dateOfFixing: String,
  intensity: Number,
  workingCondition: String,
});

const StreetLight = mongoose.model('StreetLight', streetLightSchema);

io.on('connection', (socket) => {
  console.log('A user connected');

  const sendStreetLightsData = async () => {
    const streetLights = await StreetLight.find();
    socket.emit('streetLightsData', streetLights);
  };

  sendStreetLightsData();

  const changeStream = StreetLight.watch();
  changeStream.on('change', async (change) => {
    if (change.operationType === 'update' || change.operationType === 'insert' || change.operationType === 'delete') {
        const updatedStreetLights = await StreetLight.find();
        io.emit('streetLightsData', updatedStreetLights);
    }
  });

  async function repeat(){
    const updatedStreetLights = await StreetLight.find();
    io.emit('streetLightsData', updatedStreetLights);
    sendStreetLightsData();
  }

  while(1) {
    sendStreetLightsData();
  }

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/api/streetlights', async (req, res) => {
  const streetLights = await StreetLight.find();
  res.json(streetLights);
});

app.get('/api/streetlights', async (req, res) => {
    const { location } = req.query;
  
    // Create a query object
    const query = {};
  
    // Add location to the query if it exists
    if (location) {
      query.location = location;
    }
  
    // Fetch the filtered street lights from the database
    const streetLights = await StreetLight.find(query);
    
    // Send the filtered data back to the client
    res.json(streetLights);
  });
  
  

app.post('/api/streetlights', async (req, res) => {
  const newLight = new StreetLight(req.body);
  await newLight.save();
  res.json(newLight);
});

app.delete('/api/streetlights/:id', async (req, res) => {
  await StreetLight.deleteOne({ id: req.params.id });
  res.status(204).send();
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});