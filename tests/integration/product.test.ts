import { clearDb } from '@tests/utils/clear-db';
import { createApiServer } from '@tests/utils/create-api-server';
import { register } from '@vending-machine/domains/auth';
import { createProduct } from '@vending-machine/domains/product';
import { Server } from 'http';
import request from 'supertest';

describe('product', () => {
  let apiServer: Server;

  beforeAll(() => {
    apiServer = createApiServer();
  });

  afterEach(() => clearDb());

  afterAll(() => {
    apiServer.close();
  });

  it('creates a product', async () => {
    const { user: seller, token } = await register({ username: 'Seller', password: 'seller', role: 'seller' });

    const response = await request(apiServer)
      .post('/api/products')
      .send({ productName: 'Coca Cola', cost: 50, amountAvailable: 10 })
      .set('Cookie', [`token=${token}`])
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject({
      productName: 'Coca Cola',
      cost: 50,
      amountAvailable: 10,
      seller: {
        id: seller.id,
        username: 'Seller',
        deposit: 0,
        role: 'seller',
        productIds: [],
      },
      id: 1,
      sellerId: seller.id,
    });
  });

  it('prevents creating a product if user is not a seller', async () => {
    const { token } = await register({ username: 'Buyer', password: 'buyer', role: 'buyer' });

    const response = await request(apiServer)
      .post('/api/products')
      .send({ productName: 'Coca Cola', cost: 50, amountAvailable: 10 })
      .set('Cookie', [`token=${token}`])
      .expect(401)
      .expect('Content-Type', /json/);

    expect(response.body.message).toBe('Unauthorized');
  });

  it('returns a product', async () => {
    const { user: seller, token } = await register({ username: 'Seller', password: 'seller', role: 'seller' });
    const product = await createProduct({ productName: 'Coca Cola', cost: 50, amountAvailable: 10 }, seller);

    const response = await request(apiServer)
      .get(`/api/products/${product.id}`)
      .set('Cookie', [`token=${token}`])
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject({
      id: product.id,
      productName: 'Coca Cola',
      cost: 50,
      amountAvailable: 10,
      sellerId: seller.id,
    });
  });

  it('returns products', async () => {
    const { user: seller, token } = await register({ username: 'Seller', password: 'seller', role: 'seller' });
    const cocaCola = await createProduct({ productName: 'Coca Cola', cost: 50, amountAvailable: 10 }, seller);
    const fanta = await createProduct({ productName: 'Fanta', cost: 25, amountAvailable: 3 }, seller);

    const response = await request(apiServer)
      .get(`/api/products`)
      .set('Cookie', [`token=${token}`])
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject([
      {
        id: cocaCola.id,
        productName: 'Coca Cola',
        cost: 50,
        amountAvailable: 10,
        sellerId: seller.id,
      },
      {
        id: fanta.id,
        productName: 'Fanta',
        cost: 25,
        amountAvailable: 3,
        sellerId: seller.id,
      },
    ]);
  });

  it('updates your product', async () => {
    const { user: seller, token } = await register({ username: 'Seller', password: 'seller', role: 'seller' });
    const product = await createProduct({ productName: 'Coca Cola', cost: 50, amountAvailable: 10 }, seller);

    const response = await request(apiServer)
      .patch(`/api/products/${product.id}`)
      .send({ productName: 'Coca Cola Zero', cost: 25, amountAvailable: 5 })
      .set('Cookie', [`token=${token}`])
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject({
      id: product.id,
      productName: 'Coca Cola Zero',
      cost: 25,
      amountAvailable: 5,
      sellerId: seller.id,
    });
  });

  it('prevents updating products from others', async () => {
    const { user: seller } = await register({ username: 'Seller', password: 'seller', role: 'seller' });
    const product = await createProduct({ productName: 'Coca Cola', cost: 50, amountAvailable: 10 }, seller);
    const { token } = await register({ username: 'Buyer', password: 'buyer', role: 'buyer' });

    const response = await request(apiServer)
      .patch(`/api/products/${product.id}`)
      .send({ productName: 'Coca Cola Zero', cost: 25, amountAvailable: 5 })
      .set('Cookie', [`token=${token}`])
      .expect(401)
      .expect('Content-Type', /json/);

    expect(response.body.message).toBe('Unauthorized');
  });

  it('deletes your product', async () => {
    const { user: seller, token } = await register({ username: 'Seller', password: 'seller', role: 'seller' });
    const product = await createProduct({ productName: 'Coca Cola', cost: 50, amountAvailable: 10 }, seller);

    const response = await request(apiServer)
      .delete(`/api/products/${product.id}`)
      .set('Cookie', [`token=${token}`])
      .expect(203)
      .expect('Content-Type', /json/);

    expect(response.body.message).toBe(`Product ${product.id} deleted`);
  });

  it('prevents deleting products from others', async () => {
    const { user: seller } = await register({ username: 'Seller', password: 'seller', role: 'seller' });
    const product = await createProduct({ productName: 'Coca Cola', cost: 50, amountAvailable: 10 }, seller);
    const { token } = await register({ username: 'Buyer', password: 'buyer', role: 'buyer' });

    const response = await request(apiServer)
      .delete(`/api/products/${product.id}`)
      .set('Cookie', [`token=${token}`])
      .expect(401)
      .expect('Content-Type', /json/);

    expect(response.body.message).toBe('Unauthorized');
  });
});
