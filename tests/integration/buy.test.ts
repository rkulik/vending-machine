import { clearDb } from '@tests/utils/clear-db';
import { createApiServer } from '@tests/utils/create-api-server';
import { register } from '@vending-machine/domains/auth';
import { createProduct } from '@vending-machine/domains/product';
import { deposit } from '@vending-machine/domains/user';
import { Server } from 'http';
import request from 'supertest';

describe('buy', () => {
  let apiServer: Server;

  beforeAll(() => {
    apiServer = createApiServer();
  });

  afterEach(() => clearDb());

  afterAll(() => {
    apiServer.close();
  });

  it('buys products', async () => {
    const { user: seller } = await register({ username: 'Seller', password: 'seller', role: 'seller' });
    const product = await createProduct({ productName: 'Coca Cola', cost: 50, amountAvailable: 10 }, seller);

    const { user: buyer, token } = await register({ username: 'Buyer', password: 'buyer', role: 'buyer' });
    await deposit({ cents: 100 }, buyer);

    const response = await request(apiServer)
      .post('/api/buy')
      .send({ productId: product.id, amount: 2 })
      .set('Cookie', [`token=${token}`])
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject({
      total: 100,
      products: [
        {
          id: product.id,
          productName: 'Coca Cola',
          cost: 50,
          amountAvailable: 8,
          sellerId: seller.id,
        },
        {
          id: product.id,
          productName: 'Coca Cola',
          cost: 50,
          amountAvailable: 8,
          sellerId: seller.id,
        },
      ],
      change: [],
    });
  });

  it('returns change', async () => {
    const { user: seller } = await register({ username: 'Seller', password: 'seller', role: 'seller' });
    const product = await createProduct({ productName: 'Coca Cola', cost: 50, amountAvailable: 10 }, seller);

    const { user: buyer, token } = await register({ username: 'Buyer', password: 'buyer', role: 'buyer' });
    await deposit({ cents: 100 }, buyer);

    const response = await request(apiServer)
      .post('/api/buy')
      .send({ productId: product.id, amount: 1 })
      .set('Cookie', [`token=${token}`])
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject({
      total: 50,
      products: [
        {
          id: product.id,
          productName: 'Coca Cola',
          cost: 50,
          amountAvailable: 9,
          sellerId: seller.id,
        },
      ],
      change: [50],
    });
  });

  it('excludes users without "buyer" role', async () => {
    const { user: seller, token } = await register({ username: 'Seller', password: 'seller', role: 'seller' });
    const product = await createProduct({ productName: 'Coca Cola', cost: 50, amountAvailable: 10 }, seller);

    const response = await request(apiServer)
      .post('/api/buy')
      .send({ productId: product.id, amount: 1 })
      .set('Cookie', [`token=${token}`])
      .expect(401)
      .expect('Content-Type', /json/);

    expect(response.body.message).toBe('Unauthorized');
  });

  it('handles insufficient product stock', async () => {
    const { user: seller } = await register({ username: 'Seller', password: 'seller', role: 'seller' });
    const product = await createProduct({ productName: 'Coca Cola', cost: 50, amountAvailable: 10 }, seller);

    const { user: buyer, token } = await register({ username: 'Buyer', password: 'buyer', role: 'buyer' });
    await deposit({ cents: 100 }, buyer);

    const response = await request(apiServer)
      .post('/api/buy')
      .send({ productId: product.id, amount: 11 })
      .set('Cookie', [`token=${token}`])
      .expect(409)
      .expect('Content-Type', /json/);

    expect(response.body.message).toBe('Only 10 products left');
  });

  it('handles insufficient deposit', async () => {
    const { user: seller } = await register({ username: 'Seller', password: 'seller', role: 'seller' });
    const product = await createProduct({ productName: 'Coca Cola', cost: 105, amountAvailable: 10 }, seller);

    const { user: buyer, token } = await register({ username: 'Buyer', password: 'buyer', role: 'buyer' });
    await deposit({ cents: 100 }, buyer);

    const response = await request(apiServer)
      .post('/api/buy')
      .send({ productId: product.id, amount: 1 })
      .set('Cookie', [`token=${token}`])
      .expect(409)
      .expect('Content-Type', /json/);

    expect(response.body.message).toBe('You have to deposit 5 more cents to be able to buy this product');
  });

  it('handles insufficient amount', async () => {
    const { user: seller } = await register({ username: 'Seller', password: 'seller', role: 'seller' });
    const product = await createProduct({ productName: 'Coca Cola', cost: 105, amountAvailable: 10 }, seller);

    const { user: buyer, token } = await register({ username: 'Buyer', password: 'buyer', role: 'buyer' });
    await deposit({ cents: 100 }, buyer);

    const response = await request(apiServer)
      .post('/api/buy')
      .send({ productId: product.id, amount: 0 })
      .set('Cookie', [`token=${token}`])
      .expect(400)
      .expect('Content-Type', /json/);

    expect(response.body.message).toBe('Amount must be greater than 0');
  });
});
