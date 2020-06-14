import { KeyGenerator } from './KeyGenerator';

export interface Cache {

  /**
   * Return the cache name.
   */
  readonly name: string;

  /**
   * Return the value to which this cache maps the specified key
   */
  get<T>(key: string): T;

  /**
   * Associate the specified value with the specified key in this cache.
   * If the cache previously contained a mapping for this key, the old
   * value is replaced by the specified value.
   */
  put<T>(key: string, value: T): void;

  /**
   * Evict the mapping for this key from this cache if it is present.
   */
  evict(key: string): void;

  /**
   * Remove all mappings from the cache.
   */
  clear(): void;

}

export interface CacheConfig {
  type: string;
  ttl?: number,
  maxKeys?: number,
  keyGenerator?: KeyGenerator,
}

export enum CacheType {
  MEMORY_CACHE,
  LUR_CACHE,
}
