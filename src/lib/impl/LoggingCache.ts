import { Cache } from '../CacheModel';

export class LoggingCache implements Cache {
    name: string;

    private readonly cache: Cache;

    constructor(cache: Cache) {
        this.cache = cache;
        this.name = cache.name;
    }
    get<T>(key: string): T {
        return this.cache.get(key)
    }
    put<T>(key: string, value: T): void {
        this.cache.put(key, value)
    }
    evict(key: string): void {
        this.cache.evict(key)
    }
    clear(): void {
        this.cache.clear()
    }

}