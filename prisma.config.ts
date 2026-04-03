import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://smitbhoir@localhost:5432/jayshree_collections',
  },
} as Parameters<typeof defineConfig>[0]);
