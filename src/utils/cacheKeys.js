function buildQueryKey(parts) {
  return Object.entries(parts)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");
}

const cacheKeys = {
  publicVideoList(query) {
    return `videos:public:list:${buildQueryKey(query) || "default"}`;
  },
  videoComments(videoId, query) {
    return `comments:video:${videoId}:${buildQueryKey(query) || "default"}`;
  },
  channelStats(userId) {
    return `dashboard:stats:${userId}`;
  },
  channelVideos(userId) {
    return `dashboard:videos:${userId}`;
  },
  userPlaylists(userId) {
    return `playlists:user:${userId}`;
  },
  playlist(playlistId) {
    return `playlists:item:${playlistId}`;
  },
};

const cachePrefixes = {
  publicVideoLists: "videos:public:list:",
  videoComments(videoId) {
    return `comments:video:${videoId}:`;
  },
  channelStats(userId) {
    return `dashboard:stats:${userId}`;
  },
  channelVideos(userId) {
    return `dashboard:videos:${userId}`;
  },
  userPlaylists(userId) {
    return `playlists:user:${userId}`;
  },
  playlist(playlistId) {
    return `playlists:item:${playlistId}`;
  },
};

const cacheTtlSeconds = {
  publicVideoList: 60,
  videoComments: 45,
  channelStats: 90,
  channelVideos: 60,
  playlists: 120,
};

export { cacheKeys, cachePrefixes, cacheTtlSeconds };
