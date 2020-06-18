import { DefaultKeyGenerator } from './KeyGenerator'
import { hash } from '../utils'

export class HashKeyGenerator extends DefaultKeyGenerator {
    generate(target: any, propertyKey: string | symbol, args: any, key?: string): string {
        if (!key) {
            return propertyKey.toString() +'_'+ hash(JSON.stringify(args))
        }
        return this.template(key, args)
    }
}