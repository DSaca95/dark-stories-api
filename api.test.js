const request = require('supertest');
const app = require('./server');

describe('Dark Stories API - Tntegrációs Tesztek', () => {

    describe('GET /', () => {
        it('Sikeresen válaszolnia kell text formátumban', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toBe(200);
            expect(res.text).toBe('Dark Stories API - online & working!');
        });
    });

    describe('GET /api/meta', () => {
        it('Vissza kell adnia a meta objektumot a megfelelő kulcsokkal', async () => {
            const res = await request(app).get('/api/meta');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('stories');
            expect(res.body).toHaveProperty('categories');
            expect(res.body).toHaveProperty('difficulties');
            expect(res.body).toHaveProperty('languages');
            expect(Array.isArray(res.body.categories)).toBe(true);
        });
    });

    describe('GET /api/categories', () => {
        it('Sikeresen vissza kell adnia a kategóriák tömbjét', async () => {
            const res = await request(app).get('/api/categories');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/stories/count', () => {
        it('Vissza kell adnia egy objektumot a történetek számával', async () => {
            const res = await request(app).get('/api/stories/count');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('count');
            expect(typeof res.body.count).toBe('number');
        });
    });

    describe('GET /api/stories/random', () => {
        it('Vissza kell adnia egyetlen random történetet', async () => {
            const res = await request(app).get('/api/stories/random');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body).not.toBeInstanceOf(Array); // Egy darab kártyánál nem tömböt várunk
        });

        it('Több random történetet kell visszaadnia a kért szűrésekkel és mezőkkel', async () => {
            const count = 3;
            const res = await request(app)
                .get(`/api/stories/random?difficulty=hard&count=${count}&lang=hu&fields=id,title`);
            
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(count);
            
            res.body.forEach(story => {
                expect(story).toHaveProperty('id');
                expect(story).toHaveProperty('title');
                expect(story).not.toHaveProperty('riddle');
                expect(story).not.toHaveProperty('solution');
            });
        });

        it('Hibát kell dobnia, ha a count paraméter nem pozitív szám', async () => {
            const res = await request(app).get('/api/stories/random?count=-5');
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('GET /api/stories/:id', () => {
        it('Vissza kell adnia a megfelelő történetet létező ID esetén', async () => {
            const res = await request(app).get('/api/stories/1');
            expect(res.statusCode).toBe(200);
            expect(res.body.id).toBe(1);
        });

        it('404-es hibát kell visszaadnia, ha nem létezik a történet', async () => {
            const res = await request(app).get('/api/stories/999999');
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error', 'Story not found.');
        });
    });

    describe('GET /api/stories query paraméterekkel', () => {
        it('Megfelelően kell lapoznia (pagination) ha van "page" paraméter', async () => {
            const res = await request(app).get('/api/stories?page=1&limit=5');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('page', 1);
            expect(res.body).toHaveProperty('limit', 5);
            expect(res.body).toHaveProperty('total');
            expect(Array.isArray(res.body.stories)).toBe(true);
            expect(res.body.stories.length).toBeLessThanOrEqual(5);
        });

        it('Többszörös kategória és nehézség szűrésnek működnie kell', async () => {
            const res = await request(app).get('/api/stories?category=crime,mystery&difficulty=easy,medium');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            
            res.body.forEach(story => {
                const cat = story.category.toLowerCase();
                const diff = story.difficulty.toLowerCase();
                expect(['crime', 'mystery']).toContain(cat);
                expect(['easy', 'medium']).toContain(diff);
            });
        });
    });
});