export const config = {
  environment: process.env.NODE_ENV,
  database: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    name: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
  },
  auth: {
    token: {
      secret: process.env.TOKEN_SECRET!,
    },
    accessToken: {
      secret: process.env.ACCESS_TOKEN_SECRET!,
      lifetime: parseInt(process.env.ACCESS_TOKEN_LIFETIME!),
    },
    refreshToken: {
      secret: process.env.REFRESH_TOKEN_SECRET!,
      lifetime: parseInt(process.env.REFRESH_TOKEN_LIFETIME!),
    },
  },
};
