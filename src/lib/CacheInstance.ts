import { CacheManager } from './cache-manager/CacheManager';
import { MemoryCache } from './impl/MemoryCache';
import { Cache, CacheConfig } from './CacheModel';
import { AutoCacheManager } from './cache-manager/AutoCacheManager';
import { DefaultKeyGenerator } from './key-generator/KeyGenerator';
import { LoggingCache } from './impl/LoggingCache';
import { HashKeyGenerator } from './key-generator/HashKeyGenerator';
import { TTLCache } from './impl/TTLCache';
import { LimitCache } from './impl/LimitCache';

const CACHE_INSTANCE = {
  manager: undefined,
  keyGenerator: undefined,
  cache: undefined,
  ttl: 0,
  maxKeys: 0,
  logLevel: 'debug',
};


export function createCache(name: string): Cache {
  if (CACHE_INSTANCE.cache) {
    return new LoggingCache(new CACHE_INSTANCE.cache(name))
  }
  const ttlcache = new TTLCache(new LoggingCache(new MemoryCache(name)));
  return CACHE_INSTANCE.maxKeys ? new LimitCache(ttlcache, CACHE_INSTANCE.maxKeys) : ttlcache;
}

export function EnableCaching(config: CacheConfig) {
  CACHE_INSTANCE.keyGenerator = config.keyGenerator || new HashKeyGenerator();
  CACHE_INSTANCE.cache = config.cache
  CACHE_INSTANCE.ttl = config.ttl || 0;
  CACHE_INSTANCE.maxKeys = config.maxKeys || 0;
  CACHE_INSTANCE.manager = new AutoCacheManager();
}

export function getConfig() {
  return {
    ttl: CACHE_INSTANCE.ttl,
    maxKeys: CACHE_INSTANCE.maxKeys,
    logLevel: CACHE_INSTANCE.logLevel
  }
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
