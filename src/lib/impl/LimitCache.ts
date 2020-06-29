import { Cache } from '../CacheModel';

/**
 * A decorator to limit the cache size .
 */
export class LimitCache implements Cache {

    private cache: Cache;
    private maxKeys: number;
    private size: number;
    readonly name: string;

    constructor(cache: Cache, maxKeys: number) {
        this.cache = cache;
        this.name = cache.name;
        this.maxKeys = maxKeys || 10000
        this.size = 0;
        console.log('create limit cache', this.maxKeys)
    }

    get<T>(key: string): T | Promise<T> {
        return this.cache.get(key)
    }

    put<T>(key: string, value: T, ttl?: number): void | Promise<void> {
        this.size++;
        if (this.size > this.maxKeys) {
            this.cache.evict(this.keys()[0])
        }
        this.cache.put(key, value)
    }

    evict(key: string): void | Promise<void> {
        this.size--;
        this.cache.evict(key)
    }

    clear(): void | Promise<void> {
        this.size = 0
        this.cache.clear();
    }

    keys(): string[] | Promise<string[]> {
        return this.cache.keys();
    }

}