import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import { logger } from './utils/logger.js'
import { ApiError } from './utils/ApiError.js'
import { ensureDatabaseConnection } from './middlewares/database.middleware.js'


const app = express()

app.use(requestLogger)

app.use(cors({
   origin:process.env.CORS_ORIGIN, 
   credentials :true,
}))

app.use(express.json({limit:"20kb"})) 
app.use(express.urlencoded({limit:'20kb'}))
app.use(express.static("public"))

app.use(cookieParser())
app.use(ensureDatabaseConnection)



import { userRouter } from './routes/user.routes.js'
import { dashboardRouter } from './routes/dashboard.routes.js'
import { videoRouter } from './routes/video.routes.js'
import { playlistRouter } from './routes/playlist.routes.js'
import { likeRouter } from './routes/like.routes.js'
import { commentRouter } from './routes/comment.routes.js'
import { subscriptionRouter } from './routes/subscription.routes.js'
import { hotTakeRouter } from './routes/hotTake.routes.js'
import { requestLogger } from './middlewares/logger.middleware.js'

   


app.use("/api/v1/users",userRouter)

app.use("/api/v1/takes",hotTakeRouter)

app.use("/api/v1/subscriptions",subscriptionRouter)

app.use("/api/v1/videos",videoRouter)

app.use("/api/v1/comments",commentRouter)

app.use("/api/v1/likes",likeRouter)

app.use("/api/v1/playlist",playlistRouter)

app.use("/api/v1/dashboard",dashboardRouter)

app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use((err, req, res, next) => {
  const malformedMultipartMessages = new Set([
    "Malformed part header",
    "Unexpected end of form",
    "Multipart: Boundary not found",
  ]);

  const isMultipartError =
    err instanceof multer.MulterError ||
    malformedMultipartMessages.has(err.message);

  const statusCode = isMultipartError
    ? 400
    : err.statusCode || err.status || 500;

  const message = isMultipartError
    ? "Malformed multipart/form-data request. Check form-data field names for hidden newlines and let the client set the Content-Type boundary."
    : err.message || "Internal Server Error";

  const logData = {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    error: err.message,
    stack: err.stack,
  };

  if (statusCode >= 500) {
    logger.error("Request failed", logData);
  } else {
    logger.warn("Request rejected", logData);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    stack:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });
});

export default app
