import { defineConfig } from 'prisma/config';

export default defineConfig({
  migrate: {
    seed: {
      run: 'ts-node --transpile-only prisma/seed.ts',
    },
  },
});
