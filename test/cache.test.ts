import test from 'ava';
import { CacheConfig, Cacheable, CachePut, CacheEvict, getCacheManager, initCache } from '../src/public-api';

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
initCache({})

const cache = getCacheManager().getCache('hello')

test('cache data at first time', async  t => {
    const user = await service.getUser(2);
    t.deepEqual(cache.get('user_2'), user);
})

test('put data into cache', t => {
    const userData = { id: 3, name: 'test' }
    const result = service.saveUser(3, userData);
    t.deepEqual(cache.get('3'), userData)
})

test('evict for specific key in cache', t => {
    const user = service.getUser(4);
    service.deleteUser(4)
    t.is(cache.get('user_4'), undefined, '')
})

test('clear cache', t => {
    cache.clear()
    for (let i = 0; i < 10; i++) {
        service.saveUser(i, { id: i, name: 'name' + i })
    }
    let keys = cache.keys() as string[];
    t.is(keys.length, 1)
    console.log(keys)
    service.deleteAllUsers();
    keys = cache.keys() as string[]
    t.is(keys.length, 0)
})
