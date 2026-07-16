const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Dark Stories API',
            version: '1.0.0',
            description: 'A lightweight REST API serving detective-style Dark Stories ("Black Stories") riddle cards.',
            contact: {
                name: 'Developer Support'
            }
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Local development server' 
            }
        ]
    },
    apis: [__filename]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(helmet({
    contentSecurityPolicy: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "https://fastly.jsdelivr.net"],
        "script-src": ["'self'", "'unsafe-inline'", "https://fastly.jsdelivr.net"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fastly.jsdelivr.net"]
    }
}));

app.use(cors());
app.use(express.json());
app.use(compression());
app.use(morgan('dev'));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api', apiLimiter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const getStories = () => {
    const filePath = path.join(__dirname, 'stories.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileData);
};

const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex --;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

const formatStory = (story, lang, includeSolution = false, includeHints = true) => {
    let base = {
        id: story.id,
        category: story.category,
        difficulty: story.difficulty
    };

    if (lang && ['hu', 'en'].includes(lang.toLowerCase())) {
        const targetLang = lang.toLowerCase();
        const localized = story[targetLang];

        base.title = localized.title;
        base.riddle = localized.riddle;

        if (includeSolution) base.solution = localized.solution;
        if (includeHints) base.host_hints = localized.host_hints;
    } else {
        base.hu = { title: story.hu.title, riddle: story.hu.riddle };
        base.en = { title: story.en.title, riddle: story.en.riddle };

        if (includeSolution) {
            base.hu.solution = story.hu.solution;
            base.en.solution = story.en.solution;
        }
        if (includeHints) {
            base.hu.host_hints = story.hu.host_hints;
            base.en.host_hints = story.en.host_hints;
        }
    }
    return base;
    };

    const projectFields = (story, fieldsString) => {
        if (!fieldsString) return story;
        const requestedFields = fieldsString.split(',').map(f => f.trim());
        let projected = {};
        requestedFields.forEach(field => {
            if (story[field] !== undefined) {
                projected[field] = story[field];
            }
        });
        return projected;
    }

app.get('/', (req, res) => {
    res.send('Dark Stories API - online & working!');
});

app.get('/api/meta', (req, res) => {
    try {
        const stories = getStories();
        const categories = [...new Set(stories.map(s => s.category.toLowerCase()))];
        const difficulties = [...new Set(stories.map(s => s.difficulty.toLowerCase()))];

        res.json({
            stories: stories.length,
            categories,
            difficulties,
            languages: ['hu', 'en']
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve metadata.' });
    }
});

app.get('/api/categories', (req, res) => {
    try {
        const stories = getStories();
        const categories = [...new Set(stories.map(s => s.category.toLowerCase()))];
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve categories.' });
    }
});

app.get('/api/difficulties', (req, res) => {
    try {
        const stories = getStories();
        const difficulties = [...new Set(stories.map(s => s.difficulty.toLowerCase()))];
        res.json(difficulties);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve difficulties.' });
    }
});

app.get('/api/statistics', (req, res) => {
    try {
        const stories = getStories();
        const total = stories.length;
        const categoriesCount = [...new Set(stories.map(s => s.category))].length;

        let totalHints = 0;
        stories.forEach(s => {
            const huHints = s.hu?.host_hints?.length || 0;
            const enHints = s.en?.host_hints?.length || 0;
            totalHints += (huHints + enHints) / 2;
        });
        const averageHints = total > 0 ? parseFloat((totalHints / total).toFixed(1)) : 0;

        const easy = stories.filter(s => s.difficulty.toLowerCase() === 'easy').length;
        const medium = stories.filter(s => s.difficulty.toLowerCase() === 'medium').length;
        const hard = stories.filter(s => s.difficulty.toLowerCase() === 'hard').length;

        res.json({
            stories: total,
            categories: categoriesCount,
            averageHints,
            easy,
            medium,
            hard
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve statistics.' });
    }
});

app.get('/api/stories/count', (req, res) => {
    try {
        const stories = getStories();
        res.json({ count: stories.length });
    } catch (error) {
        res.status(500).json({ error: 'Failed to count stories.' });
    }
});

app.get('/api/stories/random', (req, res) => {
    try {
        let stories = getStories();
        const { category, difficulty, lang, includeSolution, includeHints, count, fields } = req.query;

        const showSolution = includeSolution === 'true';
        const showHints = includeHints !== 'false';

        if (category) {
            const categories = category.toLowerCase().split(',').map(c => c.trim());
            stories = stories.filter(story => categories.includes(story.category.toLowerCase()));
        }

        if (difficulty) {
            const difficulties = difficulty.toLowerCase().split(',').map(d => d.trim());
            stories = stories.filter(story => difficulties.includes(story.difficulty.toLowerCase()));
        }
        if (stories.length === 0) {
            return res.status(404).json({ error: 'No stories available.' });
        }

        let formattedStories = stories.map(story => {
            const formatted = formatStory(story, lang, showSolution, showHints);
            return projectFields(formatted, fields);
        });

        formattedStories = shuffleArray(formattedStories);

        if (count) {
            const countNum = parseInt(count, 10);
            if (isNaN(countNum) || countNum <= 0) {
                return res.status(400).json({ error: 'Count parameter must be a positive number.' });
            }
            const selected = formattedStories.slice(0, countNum);
            return res.json(selected);
        }

        res.json(formattedStories[0]);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while selecting a random story.' });
    }
});

app.get('/api/stories', (req, res) => {
    try {
        let stories = getStories();
        const { search, category, difficulty, sortBy, order, lang, page, limit, offset, includeSolution, includeHints, shuffle, fields } = req.query;

        const showSolution = includeSolution === 'true';
        const showHints = includeHints !== 'false';

        if (search) {
            const searchLower = search.toLowerCase();
            stories = stories.filter(story => {
                const matchId = story.id.toString() === search;

                if (lang && ['hu', 'en'].includes(lang.toLocaleLowerCase())) {
                    const localized = story[lang.toLowerCase()];
                    return matchId ||
                        localized.title.toLowerCase().includes(searchLower) ||
                        localized.riddle.toLowerCase().includes(searchLower);
                } else {
                    return matchId ||
                        story.hu.title.toLowerCase().includes(searchLower) ||
                        story.en.title.toLowerCase().includes(searchLower) ||
                        story.hu.riddle.toLowerCase().includes(searchLower) ||
                        story.en.riddle.toLowerCase().includes(searchLower);
                }

            });
        }

        if (category) {
            const categories = category.toLowerCase().split(',').map(c => c.trim());
            stories = stories.filter(story => categories.includes(story.category.toLowerCase()));
        }

        if (difficulty) {
            const difficulties = difficulty.toLowerCase().split(',').map(d => d.trim());
            stories = stories.filter(story => difficulties.includes(story.difficulty.toLowerCase()));
        }

        let processedStories = stories.map(story => formatStory(story, lang, showSolution, showHints));

        if (shuffle !== 'true') {
            const sortField = sortBy || 'id';
            const sortOrder = order === 'desc' ? -1 : 1;

            processedStories.sort((a, b) => {
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
        } else {
            processedStories = shuffleArray(processedStories);
        }
        
        if (fields) {
            processedStories = processedStories.map(story => projectFields(story, fields));
        }

        if (page) {
            const total = processedStories.length;
            const pageNum = parseInt(page, 10) || 1;
            const limitNum = parseInt(limit, 10) || 20;

            const startIndex = (pageNum - 1) * limitNum;
            const endIndex = pageNum * limitNum;
            const paginatedStories = processedStories.slice(startIndex, endIndex);

            return res.json({
                page: pageNum,
                limit: limitNum,
                total: total,
                pages: Math.ceil(total / limitNum),
                stories: paginatedStories
            });
        }

        if (limit || offset) {
            const offsetNum = parseInt(offset, 10) || 0;
            const limitNum = limit ? parseInt(limit, 10) : processedStories.length;

            processedStories = processedStories.slice(offsetNum, offsetNum + limitNum);
        }

        res.json(processedStories);
    } catch (error) {
        res.status(500).json({ error:  'Failed to load the stories.'});
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

        const { lang, includeSolution, includeHints, fields } = req.query;
        const showSolution = includeSolution === 'true';
        const showHints = includeHints !== 'false';

        let formatted = formatStory(story, lang, showSolution, showHints);
        formatted = projectFields(formatted, fields);

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: 'An error occured while retrieving the story.' });
    }
})

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server runs at http://localhost:${PORT} address.`);
        console.log(`Swagger documentation available a http://localhost:${PORT}/api/docs`);
    });
}

module.exports = app;
