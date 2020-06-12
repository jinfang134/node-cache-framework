/*
 * Public API Surface of cache
 */

export { EnableCaching } from './lib/CacheModule';
export { CacheConfig, Cacheable, CacheEvict } from './lib/CacheDecorator';
export { CacheManager } from './lib/cache-manager/CacheManager';
export { SimpleCacheManager } from './lib/cache-manager/SimpleCacheManager';
export { getCacheManager, initCache } from './lib/CacheInstance';
export { Cache } from './lib/CacheModel';
export { NoOpCache } from './lib/impl/no-op-cache';
export { StorageCache } from './lib/impl/StorageCache';
export { MemoryCache } from './lib/impl/MemoryCache';
export { DefaultKeyGenerator } from './lib/KeyGenerator';
