import crypto from 'crypto';
import md5 from 'md5';

export const generateKey = (urlStr: string) => md5(String(urlStr.split('/').pop())); // 根据url生成key

export function generateIv(key: string) { // 根据key生成iv
    const array = [];
    for (let idx = 1; idx <= key.length; idx += 1) { // 生成二叉树数组层级
    // eslint-disable-next-line no-bitwise
        if ((idx & idx + 1) === 0) { // 是否处于二叉树节点上[即是不是2的幂运算结果，附加已遍历过的二叉树节点数据]
            const index = idx - 1;
            const row = (Math.log2(idx + 1)); // 当前行数
            array.push(
                idx === 1
                    ? key[index]
                    : key.slice((2 ** (row/* 二叉树当前行数 */ - 1)) - 1, idx)
            );
        }
    }

    return array.map((item, index) => { // 反转二叉树数组
        if (index === 0) return item; // 首个无需反转
        let str = '';
        for (let idx = 1; idx <= item.length; idx += 1) {
            if (idx % 2 === 0) { // 偶数反转
                const eq = idx - 1;
                str += item[eq] + item[eq - 1]; // 交换元素位置
            }
        }
        return str;
    }).join('');
}

/**
 * 加密方法
 * @param key 加密key
 * @param iv       向量
 * @param data     需要加密的数据
 * @returns string
 */
export function encrypt(key: string, iv: string, data: any) {
    const cipher = crypto.createCipheriv('aes-128-cbc', key.substr(0, 16), iv.substr(0, 16));
    let crypted = cipher.update(typeof data === 'string' ? data : JSON.stringify(data), 'utf8', 'binary');
    crypted += cipher.final('binary');
    // eslint-disable-next-line no-buffer-constructor
    crypted = new Buffer(crypted, 'binary').toString('base64');
    return crypted;
}

/**
 * 解密方法
 * @param key      解密的key
 * @param iv       向量
 * @param data  密文
 * @returns string
 */
export function decryptFunc(key: string, iv: string, data?: any) {
    // eslint-disable-next-line no-buffer-constructor
    const crypted = new Buffer(typeof data === 'string' ? data : encrypt(key.substr(0, 16), iv.substr(0, 16), data), 'base64').toString('binary');
    const decipher = crypto.createDecipheriv('aes-128-cbc', key.substr(0, 16), iv.substr(0, 16));
    let decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return typeof decoded === 'string' ? JSON.parse(decoded) : decoded;
}
