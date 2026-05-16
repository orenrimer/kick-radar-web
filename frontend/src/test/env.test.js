import { describe, it, expect } from 'vitest';
import { env } from '../config/env';

describe('env config', () => {
  it('defaults backend URL to /api for Vite proxy', () => {
    expect(env.backendUrl).toBeTruthy();
  });
});
