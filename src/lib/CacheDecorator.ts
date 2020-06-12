import 'reflect-metadata/Reflect';
import { getCacheManager, getKeyGenerator } from './CacheInstance';
import { Cache } from './CacheModel';
import { getParamNames } from './utils';

export const METADATA_KEY_CACHE_DEFAULTS = '_cache_defaults';
export const METADATA_KEY_CACHE_KEYS = '_cache_keys';
export const METADATA_KEY_CACHE_VALUE = '_cache_value';


export interface CacheParams {
  cacheName?: string;
}

export interface CacheEvictParams extends CacheParams {
  afterInvocation?: boolean;
  allEntries: boolean;
  key?: ''
}

export interface CacheableParams extends CacheParams {
  key?: string;
}


export function CacheConfig(cacheName: string): ClassDecorator {
  return (target: Function): void => {
    Reflect.defineMetadata(METADATA_KEY_CACHE_DEFAULTS, cacheName, target);
  };
}

export function Cacheable(params?: CacheableParams): MethodDecorator {
  params = getDefaultParams(params);
  return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const cache: Cache = getCache(target, params);
      const cacheKey: string = getKeyGenerator().generate(target, propertyKey, args, params.key);
      const oldVal: any = cache.get(cacheKey);
      if (oldVal !== undefined) {
        console.info('get data from cache: ', propertyKey);
        return oldVal;
      }
      const result = originalMethod.apply(this, args);
      if (result !== undefined) {
        console.info(`cache data: ${cacheKey} => ${result}`);
        cache.put(cacheKey, result)
      }
      return result;
    };

    return descriptor;
  };
}


export function CacheEvict(params?: CacheEvictParams): MethodDecorator {
  params = getDefaultParams(params)
  return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
    console.log('cache all entries: ', params.allEntries)

    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const cache: Cache = getCache(target, params);
      const cacheKey: string = getKeyGenerator().generate(target, propertyKey, args, params.key);

      if (!params.afterInvocation) {
        if (params.allEntries) {
          cache.clear()
        } else {
          cache.evict(cacheKey);
        }
      }
      const result: any = originalMethod.apply(this, args);
      if (params.afterInvocation) {
        if (params.allEntries) {
          cache.clear()
        } else {
          cache.evict(cacheKey);
        }
      }

      return result;
    };
    return descriptor;
  };
}


function getCache(target: Object, params: CacheParams): Cache {
  let cacheName: string = undefined
  if (!params || !params.cacheName) {
    cacheName = Reflect.getMetadata(METADATA_KEY_CACHE_DEFAULTS, target.constructor) || '';
  }

  const cache: Cache = getCacheManager().getCache(cacheName);
  if (!cache) {
    throw new Error(`Cache '${cacheName}' not found for ${target.constructor.name}`);
  }
  return cache;
}

function getDefaultParams<T>(cacheParams: CacheParams): T {
  // @ts-ignore
  return Object.assign({
    afterInvocation: true
  }, cacheParams || {});
}


function getArgsObject(func: Function, args: any[]) {
  let paramName = getParamNames(func);
}