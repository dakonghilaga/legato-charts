import Router from '@koa/router';
import Koa from 'koa';
import request from 'supertest';

import { trackService } from 'resources/track';
import route from 'resources/track/actions/list';

jest.mock('resources/track', () => ({
  trackService: {
    listTracks: jest.fn(),
  },
}));

const mockListTracks = trackService.listTracks as jest.Mock;

const app = new Koa();
const router = new Router();
route(router);
app.use(router.routes());

describe('GET /tracks', () => {
  it('should validate query parameters and call trackService.listTracks', async () => {
    const mockedTracksData = [
      {
        _id: '67262d56b384d97534f16d66',
        name: 'The 1',
        artistNameLabel: 'Taylor Swift',
        albumName: 'Folklore',
        artistName: 'Taylor Swift',
        releaseYear: 2020,
      },
    ];

    mockListTracks.mockResolvedValueOnce(mockedTracksData);

    const response = await request(app.callback()).get('/').query({
      page: '1',
      perPage: '5',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedTracksData);
    expect(mockListTracks).toHaveBeenCalledWith({
      page: 1,
      perPage: 5,
    });
  });

  it('should return a 400 error when the parameters are invalid', async () => {
    const response = await request(app.callback()).get('/').query({
      page: '-1',
    });

    expect(response.status).toBe(400);
  });
});
