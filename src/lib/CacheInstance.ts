import { CacheManager } from './cache-manager/CacheManager';
import { MemoryCache } from './impl/MemoryCache';
import { Cache, CacheType, CacheConfig } from './CacheModel';
import { AutoCacheManager } from './cache-manager/AutoCacheManager';
import { DefaultKeyGenerator } from './KeyGenerator';

const CACHE_INSTANCE = {
  manager: undefined,
  keyGenerator: undefined,
  type: undefined,
};


export function getCacheType() {
  return CACHE_INSTANCE.type
}

export function setCacheType(type: string): void {
  switch (type) {
    case 'memory':
      CACHE_INSTANCE.type = CacheType.MEMORY_CACHE
      break;
    case 'lru':
      CACHE_INSTANCE.type = CacheType.LUR_CACHE
    default:
      break;
  }
  CACHE_INSTANCE.type = type
}

export function createCache(name: string): Cache {
  let cache: Cache = undefined;
  switch (CACHE_INSTANCE.type) {
    case CacheType.MEMORY_CACHE:
      cache = new MemoryCache(name)
    default:
      cache = new MemoryCache(name)
  }
  return cache;
}

export function initCache(config: CacheConfig) {
  if (config.keyGenerator == undefined) {
    CACHE_INSTANCE.keyGenerator = new DefaultKeyGenerator();
  } else {
    CACHE_INSTANCE.keyGenerator = config.keyGenerator
  }
  setCacheType(config.type)
  let default_cache: Cache = createCache('default')
  CACHE_INSTANCE.manager = new AutoCacheManager([default_cache]);
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
