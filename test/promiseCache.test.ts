import { CacheConfig, Cacheable, CachePut, CacheEvict, getCacheManager, EnableCaching, Cache } from '../src/public-api';

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
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    id,
                    name: 'user',
                    age: '23'
                })
            }, 1000)
        })
    }

    @CachePut({ key: '${id}' })
    saveUser(id: number, user: any) {
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

// tslint:disable-next-line: max-classes-per-file
class PromiseCache implements Cache {

    readonly name: string;
    private cache: Map<string, any> = new Map<string, any>();
    private lock: boolean;

    constructor(name: string) {
        this.name = name;
    }

    keys(): Promise<string[]> {
        const self = this
        return new Promise((resolve, reject) => {
            setInterval(() => {
                if (!self.lock) {
                    resolve(Array.from(self.cache.keys()));
                }
            }, 100)
        })
    }


    clear(): void {
        this.cache.clear();
    }

    evict(key: string): void {
        this.lock = true
        setTimeout(() => {
            this.cache.delete(key);
            this.lock = false
        }, 100)
    }

    get<T>(key: string): Promise<T> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.cache.get(key))
            }, 100)
        })
    }

    put<T>(key: string, value: T): void {
        this.lock = true
        setTimeout(() => {
            this.lock = false
            this.cache.set(key, value);
        }, 100)
    }

}


const service = new UserService();
EnableCaching({
    cache: PromiseCache
})

const cache = getCacheManager().getCache('hello')

test.skip('cache data at first time', async () => {
    const user = await service.getUser(2);
    expect(await cache.get('user_2')).toEqual(user);
})

test('put data into cache', async () => {
    const userData = { id: 3, name: 'test' }
    const result = service.saveUser(3, userData);
    expect(await cache.get('3')).toEqual(userData)
})

test('evict for specific key in cache', async () => {
    const user = service.getUser(4);
    service.deleteUser(4)
    expect(await cache.get('user_4')).toBe(undefined)
})

test.skip('clear cache', async () => {
    cache.clear()
    for (let i = 0; i < 10; i++) {
        service.saveUser(i, { id: i, name: 'name' + i })
    }
    const keys = await cache.keys();
    expect(keys.length).toBe(10)
    service.deleteAllUsers();
    const keys2 = await cache.keys();
    expect(keys2.length).toBe(0)
})
