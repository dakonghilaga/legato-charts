import Koa from 'koa';
import request from 'supertest';

import publicRoutes from '../public.routes';

describe('GET /health', () => {
  let app: Koa;

  beforeEach(() => {
    app = new Koa();
    publicRoutes(app);
  });

  it('should return status 200 on GET /health', async () => {
    const response = await request(app.callback()).get('/health');
    expect(response.status).toBe(200);
  });
});
