import { KeyGenerator } from './key-generator/KeyGenerator';

export interface Cache {

  /**
   * Return the cache name.
   */
  readonly name: string;

  /**
   * Return the value to which this cache maps the specified key
   */
  get<T>(key: string): T | Promise<T>;

  /**
   * Associate the specified value with the specified key in this cache.
   * If the cache previously contained a mapping for this key, the old
   * value is replaced by the specified value.
   */
  put<T>(key: string, value: T, ttl?: number): void | Promise<void>;

  /**
   * Evict the mapping for this key from this cache if it is present.
   */
  evict(key: string): void | Promise<void>;

  /**
   * Remove all mappings from the cache.
   */
  clear(): void | Promise<void>;

  keys(): string[] | Promise<string[]>;

}

export interface CacheConfig {
  ttl?: number,
  maxKeys?: number,
  keyGenerator?: KeyGenerator,
  cache?: new (name: string) => Cache,
}

