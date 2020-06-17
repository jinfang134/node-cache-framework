# express-cache

[![GitHub stars](https://img.shields.io/github/stars/jinfang134/express-cache.svg?style=social&label=Stars&style=for-the-badge)](https://github.com/jinfang134/express-cache/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/jinfang134/express-cache.svg?style=social&label=Fork&style=for-the-badge)](https://github.com/jinfang134/express-cache/network)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/jinfang134/express-cache/blob/master/LICENSE)

A easy-to-use cache resolution for node application inspired by spring cache. The caching abstraction allows consistent use of various caching solutions with minimal impact on the code.

## LICENSE

**NOTE:** This project is licensed under [The MIT License](https://github.com/jinfang134/express-cache/blob/master/LICENSE). Completely free, you can arbitrarily use and modify this plugin. If this plugin is useful to you, you can **Star** this repo, your support is my biggest motive force, thanks.

## Example

You could check these 2 example below to get started.

- [express example](example/express-example.ts)
- [node application example](example/express-example.ts)

## Core API

### Declarative annotation-based caching

For caching declaration, the abstraction provides a set of Java annotations:

- `@CacheConfig` shares some common cache-related settings at class-level
- `@Cacheable` triggers cache population
- `@CacheEvict` triggers cache eviction
- `@CachePut` updates the cache without interfering with the method execution
  Let us take a closer look at each annotation:

#### @CacheConfig annotation

specifying the name of the cache to use for every cache operation of the class. This is where @CacheConfig comes into play.

```javascript
@CacheConfig("hello")
export class UserService {}
```

**params**

- name: cache name to use, if not specified, the `default` cache will be used.

#### @Cacheable annotation

As the name implies, @Cacheable is used to demarcate methods that are cacheable - that is, methods for whom the result is stored into the cache so on subsequent invocations (with the same arguments), the value in the cache is returned without having to actually execute the method.

```javascript
    @Cacheable({key: '${id}_${name}'})
    find(id: number, name: string) {
        console.log('load from method.')
        return 'hello'
    }

```

**params**

| Name      | Comment                                           | Required |
| --------- | ------------------------------------------------- | -------- |
| cacheName | cache name to use                                 | false    |
| key       | specifying the key of the data saved in the cache | false    |
| ttl       | ttl time, unit: ms                                | false    |

**key example**

- `${id}`
- ${id}_${user.name}

#### @CacheEvict annotation

The cache abstraction allows not just population of a cache store but also eviction. This process is useful for removing stale or unused data from the cache. Opposed to `@Cacheable`, annotation `@CacheEvict` demarcates methods that perform cache _eviction_, that is methods that act as triggers for removing data from the cache.

params
