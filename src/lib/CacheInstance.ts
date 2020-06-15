import { CacheManager } from './cache-manager/CacheManager';
import { MemoryCache } from './impl/MemoryCache';
import { Cache, CacheType, CacheConfig } from './CacheModel';
import { AutoCacheManager } from './cache-manager/AutoCacheManager';
import { DefaultKeyGenerator } from './key-generator/KeyGenerator';
import { LoggingCache } from './impl/LoggingCache';
import { HashKeyGenerator } from './key-generator/HashKeyGenerator';

const CACHE_INSTANCE = {
  manager: undefined,
  keyGenerator: undefined,
  cache: undefined
};


export function createCache(name: string): Cache {
  return new LoggingCache(new CACHE_INSTANCE.cache(name));
}

export function initCache(config: CacheConfig) {
  CACHE_INSTANCE.keyGenerator = config.keyGenerator || new HashKeyGenerator();
  CACHE_INSTANCE.cache = config.cache || MemoryCache
  const defaultCache: Cache = createCache('default')
  CACHE_INSTANCE.manager = new AutoCacheManager([defaultCache]);
}

export function getKeyGenerator() {
  if (!CACHE_INSTANCE.keyGenerator) {
    throw new Error('No cache key generator found, initCache before')
  }
  return CACHE_INSTANCE.keyGenerator;
}

export function getCacheManager(): CacheManager {
  if (!CACHE_INSTANCE.manager) {
    throw new Error('No cache found, `initCacheManager` before');
  }
  return CACHE_INSTANCE.manager;
}
