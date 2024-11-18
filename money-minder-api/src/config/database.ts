import { PrismaClient } from '@prisma/client';

// Create a single instance of Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Handle potential connection errors
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to the database');
  })
  .catch((error: any) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });

// Handle cleanup on application shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
});

export default prisma;