const crypto = require('crypto');  // 加载crypto库

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
    let hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

export function hash(str: string) {
    const md5 = crypto.createHash('md5');// 定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    md5.update(str);
    const result = md5.digest('hex');  // 加密后的值d
    return result;
}