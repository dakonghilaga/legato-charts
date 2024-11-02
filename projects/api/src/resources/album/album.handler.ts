import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import { trackService } from 'resources/track';

import logger from 'logger';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { Album } from 'types';

const { ALBUMS } = DATABASE_DOCUMENTS;

// Track - Album marriage
// Listens to newly created album,
// then update all related songs with the created album.
eventBus.on(`${ALBUMS}.created`, async (data: InMemoryEvent<Album>) => {
  const { dataSourceAttributes, ...albumDetails } = data.doc;

  try {
    await trackService.atomic.updateMany(
      {
        artistName: dataSourceAttributes?.artist_main,
        albumName: dataSourceAttributes?.album,
      },
      { $set: { album: albumDetails } },
    );
  } catch (err) {
    logger.error(`${ALBUMS}.created handle error: ${err}`);
  }
});
