module.exports = {
  app_name: process.env.APP_NAME,
  port: process.env.APP_PORT,
  debug: process.env.APP_DEBUG,
  database: {
    uri: process.env.MONGO_CONNECTION,
    options: {
      user: process.env.MONGO_USERNAME,
      pass: process.env.MONGO_PASSWORD
    },
    // Enable mongoose debug mode
    debug: !!process.env.MONGODB_DEBUG
  },
};