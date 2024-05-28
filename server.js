const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');

dotenv.config();

const app = express();

// Enable CORS for all routes and allow requests from the frontend origin
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Frontend origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
}));

// Increase the limit for the request body size
app.use(bodyParser.json({ limit: '50mb' })); // You can adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/properties', propertyRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 8000;

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected...');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
