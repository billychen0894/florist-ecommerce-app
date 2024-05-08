import { defineConfig } from 'cypress';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        async clearTestUser() {
          await prisma.user.delete({
            where: {
              email: 'test10@test.com',
            },
          });
          return null;
        },
        async seedTestUser() {
          const hashedPassword = await bcrypt.hash('TestTest10', 10);
          await prisma.user.create({
            data: {
              name: 'test10 test10',
              email: 'test10@test.com',
              password: hashedPassword,
              emailVerifyToken: '',
            },
          });
          return null;
        },
      });
    },
    baseUrl: 'http://localhost:3000',
  },
});
