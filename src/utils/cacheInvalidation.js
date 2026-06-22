import { deleteCacheByPrefixes } from "../services/cache.service.js";
import { cachePrefixes } from "./cacheKeys.js";

async function invalidatePublicVideoCaches() {
  await deleteCacheByPrefixes([cachePrefixes.publicVideoLists]);
}

async function invalidateChannelCaches(userId) {
  if (!userId) {
    return;
  }

  await deleteCacheByPrefixes([
    cachePrefixes.channelStats(userId),
    cachePrefixes.channelVideos(userId),
  ]);
}

async function invalidateCommentCaches(videoId) {
  if (!videoId) {
    return;
  }

  await deleteCacheByPrefixes([cachePrefixes.videoComments(videoId)]);
}

async function invalidatePlaylistCaches({ ownerId, playlistId }) {
  const prefixes = [];

  if (ownerId) {
    prefixes.push(
      cachePrefixes.userPlaylists(ownerId),
      cachePrefixes.channelStats(ownerId)
    );
  }

  if (playlistId) {
    prefixes.push(cachePrefixes.playlist(playlistId));
  }

  if (prefixes.length) {
    await deleteCacheByPrefixes(prefixes);
  }
}

async function invalidateVideoOwnerCaches({ ownerId, videoId }) {
  await invalidatePublicVideoCaches();
  await invalidateChannelCaches(ownerId);

  if (videoId) {
    await invalidateCommentCaches(videoId);
  }
}

export {
  invalidateChannelCaches,
  invalidateCommentCaches,
  invalidatePlaylistCaches,
  invalidatePublicVideoCaches,
  invalidateVideoOwnerCaches,
};
