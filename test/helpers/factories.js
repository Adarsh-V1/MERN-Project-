import { Comment } from "../../src/models/comment.model.js";
import { HotTake } from "../../src/models/hotTake.model.js";
import { Like } from "../../src/models/like.model.js";
import { Playlist } from "../../src/models/playlist.model.js";
import { Subscription } from "../../src/models/subscription.model.js";
import { User } from "../../src/models/user.model.js";
import { Video } from "../../src/models/video.model.js";

let sequence = 0;

export async function createUser(overrides = {}) {
  sequence += 1;
  return User.create({
    fullName: `Test User ${sequence}`,
    username: `test_user_${sequence}`,
    email: `test${sequence}@example.com`,
    password: "Password@123",
    ...overrides,
  });
}

export function authHeader(user) {
  return `Bearer ${user.generateAccessToken()}`;
}

export async function createVideo(owner, overrides = {}) {
  return Video.create({
    videoFile: "https://cdn.example.com/video.mp4",
    thumbnail: "https://cdn.example.com/thumbnail.jpg",
    owner: owner._id,
    title: "Test video",
    description: "A test video description",
    duration: 42,
    ...overrides,
  });
}

export async function createComment(owner, video, overrides = {}) {
  return Comment.create({
    owner: owner._id,
    video: video._id,
    content: "A test comment",
    ...overrides,
  });
}

export async function createPlaylist(owner, overrides = {}) {
  return Playlist.create({
    owner: owner._id,
    name: "Test playlist",
    description: "A test playlist description",
    videos: [],
    ...overrides,
  });
}

export async function createHotTake(owner, overrides = {}) {
  return HotTake.create({
    owner: owner._id,
    content: "A test hot take",
    ...overrides,
  });
}

export async function createSubscription(subscriber, channel) {
  return Subscription.create({
    subscriber: subscriber._id,
    channel: channel._id,
  });
}

export async function createLike(user, target) {
  return Like.create({
    likedBy: user._id,
    ...target,
  });
}
