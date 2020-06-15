import { Cache } from '../CacheModel';

export class MemoryCache implements Cache {

  readonly name: string;
  private cache: Map<string, any> = new Map<string, any>();

  constructor(name: string) {
    this.name = name;
  }
  keys(): string[] {
    return Array.from(this.cache.keys());
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
    this.cache.set(key, value);
  }

}
