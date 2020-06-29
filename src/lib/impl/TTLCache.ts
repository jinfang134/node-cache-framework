import { Cache } from '../CacheModel';
import { MemoryCache } from './MemoryCache';

export class TTLCache implements Cache {

    readonly name: string;
    private ttlMap: Map<string, any> = new Map<string, any>();
    private cache: Cache;

    constructor(cache: Cache) {
        this.cache = cache;
        this.name = cache.name;
    }

    get<T>(key: string): T | Promise<T> {
        const now = new Date().getTime();
        if (now > this.ttlMap.get(key)) {
            this.evict(key)
            return;
        }
        return this.cache.get(key)
    }

    put<T>(key: string, value: T, ttl?: number): void | Promise<void> {
        if (ttl > 0) {
            this.ttlMap.set(key, new Date().getTime() + ttl)
        }
        this.cache.put(key, value)
    }

    evict(key: string): void | Promise<void> {
        this.ttlMap.delete(key);
        this.cache.evict(key)
    }

    clear(): void | Promise<void> {
        this.ttlMap.clear();
        this.cache.clear();
    }

    keys(): string[] | Promise<string[]> {
        return this.cache.keys();
    }



}