const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { error } = require('console');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const getStories = () => {
    const filePath = path.join(__dirname, 'stories.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileData);
};

app.get('/', (req, res) => {
    res.send('Dark Stories API - online & working!');
});

app.get('/api/stories', (req, res) => {
    try {
        const stories = getStories();
        res.json(stories);
    } catch (error) {
        res.status(500).json({ error:  'Failed to load the stories.'});
    }
});

app.get('/api/stories/random', (req, res) => {
    try {
        const stories = getStories();
        const randomIndex = Math.floor(Math.random() * stories.length);
        res.json(stories[randomIndex]);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while selecting a random story.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server runs at http://localhost:${PORT} address.`);
});