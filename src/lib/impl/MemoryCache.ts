import { Cache } from '../CacheModel';

export class MemoryCache implements Cache {

  readonly name: string;
  private cache: Map<string, any> = new Map<string, any>();

  constructor(name: string) {
    this.name = name;
  }

  clear(): void {
    this.cache.clear();
  }

  evict(key: string): void {
    this.cache.delete(key);
  }

  get<T>(key: string): T {
    return this.cache.get(key);
  }

  put<T>(key: string, value: T): void {
    console.log('set ',key,value)
    this.cache.set(key, value);
  }

}
