const request = require('supertest');
const app = require('./server.js');

describe('API Tasks', () => {
  it('devrait retourner le statut 200 sur la route GET /api/tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});