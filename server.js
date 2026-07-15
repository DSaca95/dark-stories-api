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
        let stories = getStories();
        const { search, category, difficulty, sortBy, order } = req.query;

        if (search) {
            const searchLower = search.toLowerCase();
            stories = stories.filter(story => {
                const matchTitle = story.title.toLowerCase().includes(searchLower);
                const matchRiddle = story.riddle.roLowerCase().includes(searchLower);
                const matchId = story.id.toString() === search;
                return matchTitle || matchRiddle || matchId;
            });
        }

        if (category) {
            stories = stories.filter(story => story.category.toLowerCase() === category.toLowerCase());
        }

        if (difficulty) {
            stories = stories.filter(story => story.difficulty.toLowerCase() === difficulty.toLowerCase());
        }

        const sortField = sortBy || 'id';
        const sortOrder = order === 'desc' ? -1 : 1;

        stories.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];
            
            if (typeof valA === 'string') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }

            if (valA < valB) return -1 * sortOrder;
            if (valA > valB) return 1 * sortOrder;
            return 0; 
        });

        res.json(stories);
    } catch (error) {
        res.status(500).json({ error:  'Failed to load the stories.'});
    }
});

app.get('/api/stories/random', (req, res) => {
    try {
        const stories = getStories();
        if (stories.length === 0) {
            return res.status(404).json({ error: 'No stories available.' });
        }
        const randomIndex = Math.floor(Math.random() * stories.length);
        res.json(stories[randomIndex]);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while selecting a random story.' });
    }
});

app.get('/api/stories/:id', (req, res) => {
    try {
        const stories = getStories();
        const storyId = parseInt(req.params.id, 10);
        const story = stories.find(s => s.id === storyId);

        if (!story) {
            return res.status(404).json({ error: 'Story not found.' });
        }
        res.json(story);
    } catch (error) {
        res.status(500).json({ error: 'An error occured while retrieving the story.' });
    }
})

app.listen(PORT, () => {
    console.log(`Server runs at http://localhost:${PORT} address.`);
});