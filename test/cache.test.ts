import { CacheConfig, Cacheable, CachePut, CacheEvict, getCacheManager, EnableCaching } from '../src/public-api';

@CacheConfig('hello')
class UserService {

    @Cacheable()
    find(id: number, name: string) {
        console.log('load from method.')
        return 'hello'
    }

    @Cacheable({ key: 'user_${id}' })
    getUser(id: number) {
        console.log('get user from db')
        this.deleteAllUsers();
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    id: 23,
                    name: 'user',
                    age: '23'
                })
            }, 1000)
        })
    }

    @CachePut({ key: '${id}' })
    saveUser(id: number, user: any) {
        return user
    }

    @CachePut({ key: 'user_ttl${id}', ttl: 500 })
    saveUserTtl(id: number, user: any) {
        return user
    }

    @CacheEvict({ key: 'user_${id}' })
    deleteUser(id: number) {
        console.log('delete user from db')
    }


    @CacheEvict({ allEntries: true })
    deleteAllUsers() { }
}

const service = new UserService();
EnableCaching({
    maxKeys: 10,
    ttl: 1000// ms
})

const cache = getCacheManager().getCache('hello')

test('cache data at first time', async () => {
    const user = await service.getUser(2);
    expect(cache.get('user_2')).toEqual(user);
})

test('put data into cache', () => {
    const userData = { id: 3, name: 'test' }
    const result = service.saveUser(3, userData);
    expect(cache.get('3')).toEqual(userData)
})

test('evict for specific key in cache', () => {
    const user = service.getUser(4);
    service.deleteUser(4)
    expect(cache.get('user_4')).toBe(undefined)
})

test('clear cache', () => {
    for (let i = 0; i < 10; i++) {
        service.saveUser(i, { id: i, name: 'name' + i })
    }
    let keys = cache.keys() as string[];
    expect(keys.length).toBe(10)
    service.deleteAllUsers();
    keys = cache.keys() as string[]
    expect(keys.length).toBe(0)
})

test('should not contain more than maxkeys items in cache', () => {
    cache.clear()
    for (let i = 0; i < 20; i++) {
        service.saveUser(i, { id: i, name: 'name' + i })
    }
    expect(cache.keys()).toHaveLength(10)
})

test('get item should be undefined after ttl reached', done => {
    cache.clear();
    const userData = { id: 3, name: 'test' }
    const result = service.saveUser(3, userData);
    expect(cache.get('3')).toEqual(userData)
    setTimeout(() => {
        expect(cache.get('3')).toEqual(undefined)
        done()
    }, 1100)
})


test('get item should not null before ttl reached', done => {
    cache.clear();
    const userData = { id: 3, name: 'test' }
    const result = service.saveUser(3, userData);
    expect(cache.get('3')).toEqual(userData)
    setTimeout(() => {
        expect(cache.get('3')).toEqual(userData)
        done()
    }, 500)
})



test('test function ttl setting', done => {
    cache.clear();
    const userData = { id: 3, name: 'test' }
    service.saveUserTtl(4, userData);
    expect(cache.get('user_ttl4')).toEqual(userData)
    setTimeout(() => {
        expect(cache.get('user_ttl4')).toEqual(undefined)
        done()
    }, 600)
})


