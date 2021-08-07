import request from 'supertest';
import { app } from '../../app';

it('should response with details of current user', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/current-user')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@t.com');
});

it('should response with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/current-user')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
