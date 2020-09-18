/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncRedisClient } from '../utils/init-redis';

export const redisMockFabric = (spies: any) => ({
  get: spies?.get ? spies.get : () => { /*-empty-*/ },
  set: spies?.set ? spies.set : () => { /*-empty-*/ },
  setex: spies?.setex ? spies.setex : () => { /*-empty-*/ },
  sadd: spies?.sadd ? spies.sadd : () => { /*-empty-*/ },
  srem: spies?.srem ? spies.srem : () => { /*-empty-*/ },
  smembers: spies?.smembers ? spies.smembers : () => { /*-empty-*/ },
  on: spies?.on ? spies.on : () => { /*-empty-*/ },
} as AsyncRedisClient);
