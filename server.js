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

// Determine the correct origin for CORS based on the environment
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 'https://storied-madeleine-9b2e05.netlify.app' : 'http://127.0.0.1:5500',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
};

// Enable CORS with the options
app.use(cors(corsOptions));

// Configure body-parser to handle post requests
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/auth', authRoutes);

// Connect to MongoDB
const PORT = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected...');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('CORS configuration:', JSON.stringify(corsOptions));
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

