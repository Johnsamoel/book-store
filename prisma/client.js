const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const connect = async () => {
    await prisma.$connect();
}  

const closeClientConnect = async () => {
  return await prisma.$disconnect();
};

module.exports = {
  prisma,
  connect,
  closeClientConnect
};
