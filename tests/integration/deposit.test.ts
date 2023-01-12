import { clearDb } from '@tests/utils/clear-db';
import { createApiServer } from '@tests/utils/create-api-server';
import { register } from '@vending-machine/domains/auth';
import { ALLOWED_DEPOSIT_VALUES } from '@vending-machine/domains/user';
import { Server } from 'http';
import request from 'supertest';

describe('deposit', () => {
  let apiServer: Server;

  beforeAll(() => {
    apiServer = createApiServer();
  });

  afterEach(() => clearDb());

  afterAll(() => {
    apiServer.close();
  });

  it('increases deposit', async () => {
    const { user, token } = await register({ username: 'John', password: 'john', role: 'buyer' });
    expect(user.deposit).toBe(0);

    const response = await request(apiServer)
      .post('/api/deposit')
      .send({ cents: 50 })
      .set('Cookie', [`token=${token}`])
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body.deposit).toBe(50);
  });

  it('handles invalid deposit value', async () => {
    const { user, token } = await register({ username: 'John', password: 'john', role: 'buyer' });
    expect(user.deposit).toBe(0);

    const response = await request(apiServer)
      .post('/api/deposit')
      .send({ cents: 1 })
      .set('Cookie', [`token=${token}`])
      .expect(400)
      .expect('Content-Type', /json/);

    expect(response.body.message).toBe(`Only ${ALLOWED_DEPOSIT_VALUES.join(', ')} cents allowed`);
  });

  it('excludes users without "buyer" role', async () => {
    const { user, token } = await register({ username: 'John', password: 'john', role: 'seller' });
    expect(user.deposit).toBe(0);

    const response = await request(apiServer)
      .post('/api/deposit')
      .send({ cents: 1 })
      .set('Cookie', [`token=${token}`])
      .expect(401)
      .expect('Content-Type', /json/);

    expect(response.body.message).toBe('Unauthorized');
  });
});
