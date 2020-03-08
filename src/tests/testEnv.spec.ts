
import {
  PORT,
  REDIS_HOST,
  MONGODB_CONNECTION_STRING,
} from '../utils/env-loader';


describe('Test environment variables', () => {
  it('should have PORT', () => {
    expect(Number.parseInt(PORT, 10)).toBe(8000);
  });

  it('should have MONGODB_CONNECTION_STRING', () => {
    expect(MONGODB_CONNECTION_STRING).toBe('mongodb://localhost:27017/test');
  });

  it('should have REDIS_HOST', () => {
    expect(REDIS_HOST).toBe('localhost');
  });
});