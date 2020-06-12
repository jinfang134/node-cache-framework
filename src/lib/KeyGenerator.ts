
export interface KeyGenerator {
    generate(target: Object, propertyKey: string | symbol, args: any, key?: string): string;
}

export class DefaultKeyGenerator implements KeyGenerator {
    constructor() {
    }

    template(tpl, data) {
        var pattern = /\$\{([^\}\}]+)?\}/g;
        var body = 'return "';
        body += tpl.replace(pattern, function (m, g) {
            return '" + this.' + g.trim() + ' + "';
        });
        body += '";';
        return new Function(body.replace(/[\t\n\r]/g, '')).apply(data);
    };


    generate(target: Object, propertyKey: string | symbol, args: any, key?: string): string {
        if (!key) {
            return propertyKey.toString() + JSON.stringify(args)
        }
        console.log('args:', JSON.stringify(args))
        return propertyKey.toString() + this.template(key, args)
    }

}