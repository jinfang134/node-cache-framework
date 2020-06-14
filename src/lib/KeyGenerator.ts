import { hashCode, hash } from './utils';

export interface KeyGenerator {
    generate(target: Object, propertyKey: string | symbol, args: any, key?: string): string;
}

export class DefaultKeyGenerator implements KeyGenerator {
    constructor() {
    }

    template(tpl, data) {
        const pattern = /\$\{([^\}\}]+)?\}/g;
        let body = 'return "';
        body += tpl.replace(pattern, function (m, g) {
            return '" + this.' + g.trim() + ' + "';
        });
        body += '";';
        return new Function(body.replace(/[\t\n\r]/g, '')).apply(data);
    };


    generate(target: any, propertyKey: string | symbol, args: any, key?: string): string {
        if (!key) {
            return propertyKey.toString() + JSON.stringify(args)
        }
        console.log('args:', JSON.stringify(args))
        return this.template(key, args)
    }

}

export class HashKeyGenerator extends DefaultKeyGenerator {
    generate(target: Object, propertyKey: string | symbol, args: any, key?: string): string {
        if (!key) {
            return propertyKey.toString() +'_'+ hash(JSON.stringify(args))
        }
        console.log('args:', JSON.stringify(args))
        return this.template(key, args)
    }
}