import * as crypto from 'crypto';

export function Measure(threshold): MethodDecorator {
    threshold = threshold || 0
    return (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
        const oldValue: any = descriptor.value;
        descriptor.value = async function () {
            const start: number = new Date().getTime();
            const res: any = await oldValue.apply(this, arguments);
            const time: number = new Date().getTime() - start;
            if (time > threshold) {
                console.info(`called function [${name}], take: ${time} ms`);
            }
            return res;
        };
        return descriptor;
    }
}


/**
 * get parameter name for a function
 *
 * @export
 * @param {*} func
 * @returns name list
 */
export function getParamNames(func) {
    const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
    const ARGUMENT_NAMES = /([^\s,]+)/g;
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];
    return result;
}

export function hashCode(str: string) {
    let hashStr = 0;
    if (str.length === 0) return hashStr;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        // tslint:disable-next-line: no-bitwise
        hashStr = ((hashStr << 5) - hashStr) + char;
        // tslint:disable-next-line: no-bitwise
        hashStr = hashStr & hashStr; // Convert to 32bit integer
    }
    return hashStr;
}

export function hash(str: string) {
    const md5 = crypto.createHash('md5');// 定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    md5.update(str);
    const result = md5.digest('hex');  // 加密后的值d
    return result;
}

/**
 * Tests to see if the object is an ES2015 (ES6) Promise
 * @see {@link https://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects}
 * @param value the object to test
 */
export function isPromise(value: any): value is PromiseLike<any> {
    return !!value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}