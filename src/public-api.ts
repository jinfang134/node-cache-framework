/*
 * Public API Surface of cache
 */

export { EnableCaching } from './lib/CacheModule';
export { CacheConfig, Cacheable, CacheEvict, CachePut } from './lib/CacheDecorator';
export { CacheManager } from './lib/cache-manager/CacheManager';
export { SimpleCacheManager } from './lib/cache-manager/SimpleCacheManager';
export { DynamoDBCache } from './lib/impl/DynamoDBCache';
export { getCacheManager, initCache } from './lib/CacheInstance';
export { Cache } from './lib/CacheModel';
export { NoOpCache } from './lib/impl/no-op-cache';
export { StorageCache } from './lib/impl/StorageCache';
export { MemoryCache } from './lib/impl/MemoryCache';
export { DefaultKeyGenerator } from './lib/key-generator/KeyGenerator';
export * from './lib/utils'