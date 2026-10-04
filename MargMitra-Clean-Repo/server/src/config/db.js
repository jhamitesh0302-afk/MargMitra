let prisma = null;

try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });
} catch (error) {
  console.log('[MargMitra] Notice: Prisma client not generated yet (' + error.message + '). DataStore will use the fallback store.');
}

module.exports = {
  prisma
};
