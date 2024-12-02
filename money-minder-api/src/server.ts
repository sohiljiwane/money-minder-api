import http from 'http';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import app from './app';

// Load environment variables
dotenv.config();

// Server configuration
const PORT = process.env.PORT || 3000;

// MySQL Sequelize connection configuration
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'Chungusbungus@11',
  database: process.env.DB_NAME || 'money_minder',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    freezeTableName: true,
    underscored: true,
    timestamps: true
  }
});

// Create HTTP server
const server = http.createServer(app);

// Database connection function
const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL database connected successfully');
  } catch (error) {
    console.error('MySQL connection error:', error);
    process.exit(1);
  }
};

// Start server function
const startServer = () => {
  connectDatabase()
    .then(() => {
      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    });
};

// Only start server if this file is being run directly
if (require.main === module) {
  startServer();
}

export { sequelize, server, startServer };
export default server;