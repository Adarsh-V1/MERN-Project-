import winston from "winston";

const { combine, timestamp, errors, splat, json, colorize, printf } =
  winston.format;

const consoleFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  splat(),
  printf(({ timestamp, level, message, stack, service, ...metadata }) => {
    const extra =
      Object.keys(metadata).length > 0 ? ` ${JSON.stringify(metadata)}` : "";

    return `${timestamp} ${level}: ${stack || message}${extra}`;
  })
);

const fileFormat = combine(
  timestamp(),
  errors({ stack: true }),
  splat(),
  json()
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
];

// Vercel Functions should log to stdout/stderr. Their deployed application
// directory is not a suitable place for persistent log files.
if (!process.env.VERCEL) {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: fileFormat,
      maxsize: 5_000_000,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: fileFormat,
      maxsize: 5_000_000,
      maxFiles: 5,
    })
  );
}

const logger = winston.createLogger({
  silent: process.env.NODE_ENV === "test",
  level:
    process.env.LOG_LEVEL ||
    (process.env.NODE_ENV === "production" ? "info" : "debug"),

  defaultMeta: {
    service: "mern-project-api",
  },

  transports,
});

export { logger };
