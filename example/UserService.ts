import { CacheConfig, Cacheable, CacheEvict, CachePut } from '../src/public-api'


@CacheConfig('hello')
export class UserService {

    @Cacheable()
    find(id: number, name: string) {
        console.log('load from method.')
        return 'hello'
    }

    @Cacheable({key: 'user_${id}'})
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

    @CacheEvict({key: 'user_${id}'})
    deleteUser(id: number) {
        console.log('delete user from db')
    }


    @CacheEvict({ allEntries: true })
    deleteAllUsers() {
        console.log('db: delete all user')
    }
}
