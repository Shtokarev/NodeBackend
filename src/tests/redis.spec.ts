import { redisMockFabric } from './mockFabrics';
import { initRedisClient } from '../utils/init-redis';

const mockRedisOn = jest.fn();
const mockCreateClient = jest.fn(() => redisMockFabric({ on: mockRedisOn }));

jest.mock('redis', () => ({
  createClient: (...rest) => mockCreateClient.call(null, ...rest),
}));

describe('Redis initializing', () => {

  it('should invoke redis.createClient with host in params', () => {
    const host = 'testHostName';
    initRedisClient({ host });

    expect(mockCreateClient).toHaveBeenCalledWith({ host });
  });

  it('autoReconnect should handle redis.on "error" signal', () => {
    const host = 'testHostName';
    initRedisClient({ host });

    expect(mockRedisOn).toHaveBeenCalledWith('error', expect.any(Function));
  });
});
