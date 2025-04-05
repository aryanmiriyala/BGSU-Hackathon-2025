// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Updated CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://gebhartlt:n57zTw$QKB2CgV3i@cluster0.jsacasx.mongodb.net/disease?retryWrites=true&w=majority')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schema definition
const diseaseSchema = new mongoose.Schema({
    country: String,
    diseaseName: String,
    diseaseCategory: String,
    populationAffected: Number,
    healthcareAccess: Number,
    treatmentType: String,
    availabilityOfVaccines: String,
    recoveryRate: Number
});

const Disease = mongoose.model('Disease', diseaseSchema);

// Routes
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Disease API" });
});

app.get('/test', (req, res) => {
    res.json({ message: "API is working!" });
});

app.get('/api/countries', async (req, res) => {
    try {
        const countries = await Disease.distinct('country');
        res.json(countries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/diseases', async (req, res) => {
    try {
        const diseases = await Disease.find().limit(100);
        res.json(diseases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/diseases/:country', async (req, res) => {
    try {
        // Set headers explicitly
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Credentials', true);

        const countryName = req.params.country;
        console.log('Searching for country:', countryName);

        const diseases = await Disease.find({
            country: new RegExp(countryName, 'i')
        });

        console.log(`Found ${diseases.length} diseases for ${countryName}`);
        res.json(diseases);

    } catch (error) {
        console.error('Error in /api/diseases/:country:', error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/test-db', async (req, res) => {
    try {
        const count = await Disease.countDocuments();
        const sample = await Disease.findOne();
        res.json({
            totalDocuments: count,
            sampleDocument: sample,
            message: 'Database connection test'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Database test failed',
            error: error.message
        });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});