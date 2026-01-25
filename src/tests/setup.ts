// file: src/tests/setup.ts
import { beforeAll, afterAll } from 'vitest';

beforeAll(() => {
  // Setup for tests
  console.log('Test suite starting...');
});

afterAll(() => {
  // Cleanup after tests
  console.log('Test suite complete.');
});
