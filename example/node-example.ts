import { initCache, Cache } from '../src/public-api'
import { UserService } from './UserService';
import { DynamoDBCache } from './DynamoDBCache';
import { MyCache } from './MyCache';


const service = new UserService();


initCache({
    cache: DynamoDBCache,
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