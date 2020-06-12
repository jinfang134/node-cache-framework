import { CacheManager } from './CacheManager';
import { Cache } from '../CacheModel';
import { SimpleCacheManager } from './SimpleCacheManager';
import { getCacheType, createCache } from '../CacheInstance';
import { CacheType } from 'src/lib/CacheModel';
import { MemoryCache } from '../impl/MemoryCache';

export class AutoCacheManager implements CacheManager {
    private readonly manager: CacheManager;

    constructor(caches?: Cache[]) {
        this.manager = new SimpleCacheManager(caches);
    }
    addCache(cache: Cache): void {
        this.manager.addCache(cache);
    }

    getCache(name: string): Cache {
        let cache: Cache = this.manager.getCache(name)
        if (cache == null) {
            cache = createCache(name);
            this.addCache(cache);
        }
        return cache;
    }

    getCacheNames(): string[] {
        return this.manager.getCacheNames();
    }

}