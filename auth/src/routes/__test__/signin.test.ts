import request from 'supertest';
import { app } from '../../app';

it('should returns a 400 on invalid email', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test',
      password: 'password',
    })
    .expect(400);
});

it('should returns a 400 on invalid password', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@t.com',
      password: '1',
    })
    .expect(400);
});

it('should returns a 400 with missing email and password', async () => {
  return request(app).post('/api/users/signin').send({}).expect(400);
});

it('should return 200 if user pass is correct and set cookie', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@t.com',
      password: 'password',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@t.com',
      password: 'password',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});

it('should return 400 if password is incorrect', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@t.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@t.com',
      password: 'wrongpass',
    })
    .expect(400);
});

it('should return 400 if user does not exist', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@t.com',
      password: 'password',
    })
    .expect(400);
});
