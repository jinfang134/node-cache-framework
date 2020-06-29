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
        this.deleteAllUsers()
        console.log('save to db:', user)
        return user
    }

    @CacheEvict({ key: 'user_${id}' })
    deleteUser(id: number) {
        console.log('delete user from db')
    }


    @CacheEvict({ allEntries: true })
    deleteAllUsers() {
        console.log('db: delete all user')
    }
}

const service = new UserService();
EnableCaching({})

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
    cache.clear()
    for (let i = 0; i < 10; i++) {
        service.saveUser(i, { id: i, name: 'name' + i })
    }
    let keys = cache.keys() as string[];
    expect(keys.length).toBe(1)
    console.log(keys)
    service.deleteAllUsers();
    keys = cache.keys() as string[]
    expect(keys.length).toBe(0)
})
