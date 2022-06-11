import {DBClient} from "$lib/server/db/client";
import type {RequestHandler} from './__types/index';

// @ts-ignore
export const get: RequestHandler = async function ({locals, params}) {
  if (!locals.loggedIn) {
    return {status: 403}
  }
  const exportifyUser = locals.exportifyUser
  const albums = await DBClient.getLibraryTracks(exportifyUser, params?.library)
  return {
    status: albums.status,
    body: {
      items: albums.item,
      last_updated: albums.last_updated
    }
  }
}

