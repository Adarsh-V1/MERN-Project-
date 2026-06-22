import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MERN Project API",
      version: "1.0.0",
      description: "API documentation for your backend",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Local server",
      },
    ],
    tags: [
      {
        name: "Users",
        description: "Authentication and user profile endpoints",
      },
      { name: "Videos", description: "Video management endpoints" },
      { name: "Comments", description: "Comment endpoints" },
      { name: "Dashboard", description: "Dashboard and analytics endpoints" },
      { name: "Playlists", description: "Playlist endpoints" },
      { name: "Likes", description: "Like and unlike endpoints" },
      { name: "Subscriptions", description: "Subscription endpoints" },
      { name: "Hot Takes", description: "Hot take endpoints" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
      schemas: {
        ApiMessage: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
            data: {
              type: "object",
              nullable: true,
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Something went wrong",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec };
