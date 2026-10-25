import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { config } from './config/env.js';

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log('====================================================');
      console.log(` 🌱 AgriCare AI Backend running on port ${config.port}`);
      console.log(` 🌐 Environment: ${config.nodeEnv}`);
      console.log(` 🏥 Health Check: http://localhost:${config.port}/api/health`);
      console.log('====================================================');
    });

    const handleExit = async (signal) => {
      console.log(`\nReceived ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleExit('SIGINT'));
    process.on('SIGTERM', () => handleExit('SIGTERM'));
  } catch (err) {
    console.error('Fatal error starting AgriCare server:', err);
    process.exit(1);
  }
};

startServer();
