import request from 'supertest';
import { app } from '../../app';

it('should clears cookie after sign out', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(response.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
