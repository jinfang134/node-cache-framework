import { Cache } from '../CacheModel';

export class LoggingCache implements Cache {
    name: string;
    protected requests = 0;
    protected hits = 0;
    protected logEnable = process.env.DEBUG_ENABLE == 'true';

    private readonly cache: Cache;

    constructor(cache: Cache) {
        this.cache = cache;
        this.name = cache.name;
    }



    get<T>(key: string): T {
        this.requests++;
        const value: T = this.cache.get(key)
        if (value != null) {
            this.hits++;
        }
        if (this.logEnable) {
            console.log(`get data from cache, key: ${key}, value: ${JSON.stringify(value)}`)
            console.log("Cache Hit Ratio [" + this.name + "]: " + this.getHitRatio());
        }
        return value;
    }
    put<T>(key: string, value: T): void {
        if (this.logEnable) {
            console.log(`caching data in [${this.name}], key: ${key}, value: ${JSON.stringify(value)}`)
        }
        this.cache.put(key, value)
    }
    evict(key: string): void {
        if (this.logEnable) {
            console.log(`evict key [${this.name}]: ${key}`)
        }
        this.cache.evict(key)
    }
    clear(): void {
        if (this.logEnable) {
            console.log(`clear cache [${this.name}]`)
        }
        this.cache.clear()
    }

    private getHitRatio() {
        return this.hits / this.requests;
    }

}