import { initCache } from './CacheInstance';
import { Cache, CacheConfig } from './CacheModel';
import { SimpleCacheManager } from './cache-manager/SimpleCacheManager';


export function EnableCaching(config: CacheConfig) {
  initCache(config)
  console.log(config)
  return (req: any, res: any, next: any) => {
    next()
  }
}
