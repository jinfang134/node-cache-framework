import { CacheConfig, Cacheable, CacheEvict, CachePut } from '../src/public-api'


@CacheConfig('hello')
export class UserService {

    @Cacheable({ key: '${id}_${name}' })
    find(id: number, name: string) {
        console.log('load from method.')
        return 'hello'
    }

    @Cacheable()
    getUser(id: number) {
        console.log('get user from db')
        return {
            id: 23,
            name: 'user',
            age: '23'
        }
    }

    @CachePut({ key: '${id}' })
    saveUser(id: number, user: any) {
        console.log('save to db')
        return user
    }

    @CacheEvict()
    deleteUser(id: number) {
        console.log('delete user from db')
    }


    @CacheEvict({ allEntries: true })
    deleteAllUsers() {
        console.log('clear cache')
    }
}
