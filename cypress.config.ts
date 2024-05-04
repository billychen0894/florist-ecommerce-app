import { defineConfig } from 'cypress';
import { PrismaClient } from '@prisma/client';

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
          await prisma.user.create({
            data: {
              name: 'test10 test10',
              email: 'test10@test.com',
              password: 'TestTest10',
            },
          });
          return null;
        },
      });
    },
    baseUrl: 'http://localhost:3000',
  },
});
