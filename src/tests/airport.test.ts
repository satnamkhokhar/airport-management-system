import request from 'supertest';
import app from '../index';

describe('Airport Endpoints', () => {

  let createdId: number;

  // CREATE
  it('POST /api/airports - should create an airport', async () => {
    const res = await request(app)
      .post('/api/airports')
      .send({ Name: 'Hartsfield-Jackson', Location: 'Atlanta, GA', IATACode: 'ATL' });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Airport created');
    expect(res.body.AirportID).toBeDefined();
    createdId = res.body.AirportID;
  });

  // READ ALL
  it('GET /api/airports - should return list of airports', async () => {
    const res = await request(app).get('/api/airports');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // READ ONE
  it('GET /api/airports/:id - should return a single airport', async () => {
    const res = await request(app).get(`/api/airports/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.IATACode).toBe('ATL');
  });

  // UPDATE
  it('PUT /api/airports/:id - should update an airport', async () => {
    const res = await request(app)
      .put(`/api/airports/${createdId}`)
      .send({ Name: 'Hartsfield-Jackson Updated', Location: 'Atlanta, GA', IATACode: 'ATL' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Airport updated');
  });

  // DELETE
  it('DELETE /api/airports/:id - should delete an airport', async () => {
    const res = await request(app).delete(`/api/airports/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Airport deleted');
  });

  // NOT FOUND
  it('GET /api/airports/:id - should return 404 for missing airport', async () => {
    const res = await request(app).get('/api/airports/99999');
    expect(res.statusCode).toBe(404);
  });

  // MISSING FIELDS
  it('POST /api/airports - should return 400 if fields are missing', async () => {
    const res = await request(app)
      .post('/api/airports')
      .send({ Name: 'Missing Fields' });
    expect(res.statusCode).toBe(400);
  });

});