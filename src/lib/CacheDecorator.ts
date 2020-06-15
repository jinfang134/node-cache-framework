import 'reflect-metadata/Reflect';
import { getCacheManager, getKeyGenerator } from './CacheInstance';
import { Cache } from './CacheModel';
import { getParamNames, isPromise } from './utils';

export const METADATA_KEY_CACHE_DEFAULTS = '_cache_defaults';
export const METADATA_KEY_CACHE_KEYS = '_cache_keys';
export const METADATA_KEY_CACHE_VALUE = '_cache_value';


export interface CacheParams {
  cacheName?: string;
  key?: string;
}

export interface CacheEvictParams extends CacheParams {
  afterInvocation?: boolean;
  allEntries?: boolean;
}

export interface CacheableParams extends CacheParams {
  ttl?: number // second
}


export function CacheConfig(cacheName: string): ClassDecorator {
  return (target: any): void => {
    Reflect.defineMetadata(METADATA_KEY_CACHE_DEFAULTS, cacheName, target);
  };
}

function CacheAction<T extends CacheParams>(action: (cache, cacheKey, originalMethod, args) => {}, params?: T): MethodDecorator {
  params = getDefaultParams(params);
  return (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
    const originalMethod = descriptor.value;
    descriptor.value = (...args: any[]) => {
      const cache: Cache = getCache(target, params);
      const argsObj: any = getArgsObject(originalMethod, args)
      const cacheKey: string = getKeyGenerator().generate(target, propertyKey, argsObj, params.key);
      return action(cache, cacheKey, originalMethod, args);
    };
    return descriptor;
  };
}

export function Cacheable(params?: CacheableParams): MethodDecorator {
  params = getDefaultParams(params);
  return CacheAction<CacheableParams>((cache, cacheKey, originalMethod, args) => {
    const oldVal: any = cache.get(cacheKey);
    if (oldVal !== undefined) {
      return oldVal;
    }
    const result = originalMethod.apply(this, args);
    if (isPromise(result)) {
      result.then((data) => {
        cache.put(cacheKey, data)
        return data;
      })
    } else if (result !== undefined) {
      cache.put(cacheKey, result)
    }
    return result;
  }, params)
}


export function CachePut(params?: CacheableParams): MethodDecorator {
  params = getDefaultParams(params);
  return CacheAction<CacheableParams>((cache, cacheKey, originalMethod, args) => {
    const result: any = originalMethod.apply(this, args);
    if (isPromise(result)) {
      result.then((data) => {
        cache.put(cacheKey, data)
        return data
      })
    } else if (result !== undefined) {
      cache.put(cacheKey, result)
    }
    return result;
  }, params)

}

export function CacheEvict(params?: CacheEvictParams): MethodDecorator {
  params = getDefaultParams(params);
  return CacheAction<CacheEvictParams>((cache, cacheKey, originalMethod, args) => {
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
  }, params)

}


function getCache(target: any, params: CacheParams): Cache {
  let cacheName: string
  if (!params || !params.cacheName) {
    cacheName = Reflect.getMetadata(METADATA_KEY_CACHE_DEFAULTS, target.constructor) || 'default';
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


function getArgsObject(func: () => {}, args: any[]) {
  const paramName = getParamNames(func);
  if (paramName.length === 0) {
    return {}
  }
  const result = {}
  for (let i = 0; i < paramName.length; i++) {
    result[paramName[i]] = args[i]
  }
  return result;
}