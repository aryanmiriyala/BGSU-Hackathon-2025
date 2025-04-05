// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express.json());

mongoose.connect('mongodb+srv://gebhartlt:n57zTw$QKB2CgV3i@cluster0.jsacasx.mongodb.net/disease?retryWrites=true&w=majority')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

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

// Get grouped diseases for a country
app.get('/api/diseases/:country', async (req, res) => {
    try {
        const countryName = req.params.country;
        console.log('Fetching diseases for:', countryName);

        const diseases = await Disease.aggregate([
            // Match the country
            {
                $match: {
                    country: new RegExp(countryName, 'i')
                }
            },
            // Group by disease name
            {
                $group: {
                    _id: '$diseaseName',
                    diseaseCategory: { $first: '$diseaseCategory' },
                    populationAffected: { $sum: '$populationAffected' },
                    healthcareAccess: { $avg: '$healthcareAccess' },
                    treatmentType: { $first: '$treatmentType' },
                    availabilityOfVaccines: { $first: '$availabilityOfVaccines' },
                    recoveryRate: { $avg: '$recoveryRate' },
                    occurrences: { $sum: 1 }
                }
            },
            // Reshape the data to match the expected format
            {
                $project: {
                    _id: 0,
                    diseaseName: '$_id',
                    diseaseCategory: 1,
                    populationAffected: 1,
                    healthcareAccess: { $round: ['$healthcareAccess', 2] },
                    treatmentType: 1,
                    availabilityOfVaccines: 1,
                    recoveryRate: { $round: ['$recoveryRate', 2] },
                    occurrences: 1
                }
            },
            // Sort by population affected
            {
                $sort: {
                    populationAffected: -1
                }
            }
        ]);

        if (!diseases || diseases.length === 0) {
            return res.json([]);
        }

        console.log(`Found ${diseases.length} unique diseases for ${countryName}`);
        res.json(diseases);

    } catch (error) {
        console.error('Error getting diseases:', error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Disease API" });
});

app.get('/test', (req, res) => {
    res.json({ message: "API is working!" });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});