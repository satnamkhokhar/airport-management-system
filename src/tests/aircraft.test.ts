import request from 'supertest';
import app from '../index';

describe('Aircraft Endpoints', () => {

  let createdId: number;

  it('POST /api/aircraft - should create an aircraft', async () => {
    const res = await request(app)
      .post('/api/aircraft')
      .send({ TailNumber: 'N99999', Model: 'Boeing 737', Capacity: 180 });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Aircraft created');
    expect(res.body.AircraftID).toBeDefined();
    createdId = res.body.AircraftID;
  });

  it('GET /api/aircraft - should return list of aircraft', async () => {
    const res = await request(app).get('/api/aircraft');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/aircraft/:id - should return a single aircraft', async () => {
    const res = await request(app).get(`/api/aircraft/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.Model).toBe('Boeing 737');
  });

  it('PUT /api/aircraft/:id - should update an aircraft', async () => {
    const res = await request(app)
      .put(`/api/aircraft/${createdId}`)
      .send({ TailNumber: 'N99999', Model: 'Boeing 737 MAX', Capacity: 200 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Aircraft updated');
  });

  it('DELETE /api/aircraft/:id - should delete an aircraft', async () => {
    const res = await request(app).delete(`/api/aircraft/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Aircraft deleted');
  });

  it('GET /api/aircraft/:id - should return 404 for missing aircraft', async () => {
    const res = await request(app).get('/api/aircraft/99999');
    expect(res.statusCode).toBe(404);
  });

  it('POST /api/aircraft - should return 400 if fields are missing', async () => {
    const res = await request(app)
      .post('/api/aircraft')
      .send({ TailNumber: 'N00000' });
    expect(res.statusCode).toBe(400);
  });

});