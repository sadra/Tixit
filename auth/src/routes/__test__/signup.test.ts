import request from 'supertest';
import { app } from '../../app';

it('should returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@t.com',
      password: 'password',
    })
    .expect(201);
});

it('should returns a 400 on invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test',
      password: 'password',
    })
    .expect(400);
});

it('should returns a 400 on invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@t.com',
      password: '1',
    })
    .expect(400);
});

it('should returns a 400 with missing email and password', async () => {
  return request(app).post('/api/users/signup').send({}).expect(400);
});

it('should dissallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@t.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@t.com',
      password: 'password',
    })
    .expect(400);
});

it('should sets cookie after sunccessful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@t.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
