import { initCache, Cache } from '../src/public-api'
import { UserService } from './UserService';


const service = new UserService();

class MyCache implements Cache {
    readonly name: string;
    private cache: Map<string, any> = new Map<string, any>();

    constructor(name: string) {
        this.name = name;
    }
    keys(): string[] {
        return Array.from(this.cache.keys());
    }

    clear(): void {
        this.cache.clear();
    }

    evict(key: string): void {
        this.cache.delete(key);
    }

    get<T>(key: string): T {
        return this.cache.get(key);
    }

    put<T>(key: string, value: T): void {
        this.cache.set(key, value);
    }


}

initCache({
    cache: MyCache,
})

function main() {
    service.getUser(23);
    service.getUser(23);
    service.deleteUser(23)
    service.getUser(23)
    service.deleteAllUsers()
    service.getUser(23)

    service.find(12, 'test');
    service.find(12, 'test');
}

main();