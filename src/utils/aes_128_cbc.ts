// import crypto from 'crypto';
import md5 from 'md5';

export const generateKey = (urlStr: string) => window.crypto.subtle.importKey( // 根据url生成key
    'raw',
    Uint8Array.from(md5(String(urlStr.split('/').pop())).substr(0, 16).split('').map((item: string, index: number) => item.charCodeAt(index))),
    'AES-CBC',
    true,
    ['encrypt', 'decrypt']
);
    // .then((cryptoKey) => crypto.subtle.exportKey(md5(String(urlStr.split('/').pop())), cryptoKey));
// export const generateKey = (urlStr: string) => md5(String(urlStr.split('/').pop())); // 根据url生成key

export async function generateIv(key: PromiseReturnType<typeof generateKey>) { // 根据key生成iv
    // const _key = md5(String(_key.split('/').pop()));
    const _key = new TextDecoder('utf-8').decode(await crypto.subtle.exportKey('raw', key));
    const array = [];

    for (let idx = 1; idx <= _key.length; idx += 1) { // 生成二叉树数组层级
    // eslint-disable-next-line no-bitwise
        if ((idx & idx + 1) === 0) { // 是否处于二叉树节点上[即是不是2的幂运算结果，附加已遍历过的二叉树节点数据]
            const index = idx - 1;
            const row = (Math.log2(idx + 1)); // 当前行数
            array.push(
                idx === 1
                    ? _key[index]
                    : _key.slice((2 ** (row/* 二叉树当前行数 */ - 1)) - 1, idx)
            );
        }
    }

    const chars = array
        .map((item, index) => { // 反转二叉树数组
            if (index === 0) return item; // 首个无需反转
            let str = '';
            for (let idx = 1; idx <= item.length; idx += 1) {
                if (idx % 2 === 0) { // 偶数反转
                    const eq = idx - 1;
                    str += item[eq] + item[eq - 1]; // 交换元素位置
                }
            }
            return str;
        })
        .slice(0, 16)
        .map((item, index) => item.charCodeAt(index)); // 转换成 ascii array

    return crypto.getRandomValues(new Uint8Array(chars));
}

// export function generateIv(key: string) { // 根据key生成iv
//     const array = [];
//     for (let idx = 1; idx <= key.length; idx += 1) { // 生成二叉树数组层级
//     // eslint-disable-next-line no-bitwise
//         if ((idx & idx + 1) === 0) { // 是否处于二叉树节点上[即是不是2的幂运算结果，附加已遍历过的二叉树节点数据]
//             const index = idx - 1;
//             const row = (Math.log2(idx + 1)); // 当前行数
//             array.push(
//                 idx === 1
//                     ? key[index]
//                     : key.slice((2 ** (row/* 二叉树当前行数 */ - 1)) - 1, idx)
//             );
//         }
//     }

//     return array.map((item, index) => { // 反转二叉树数组
//         if (index === 0) return item; // 首个无需反转
//         let str = '';
//         for (let idx = 1; idx <= item.length; idx += 1) {
//             if (idx % 2 === 0) { // 偶数反转
//                 const eq = idx - 1;
//                 str += item[eq] + item[eq - 1]; // 交换元素位置
//             }
//         }
//         return str;
//     }).join('');
// }

/**
 * 加密方法
 * @param key 加密key
 * @param data     需要加密的数据
 * @returns string
 */
export async function encrypt(key: PromiseReturnType<typeof generateKey>, data: any) {
    const iv = await generateIv(key);
    return window.crypto.subtle.encrypt(
        {
            name: 'AES-CBC',
            iv
        },
        key,
        new TextEncoder().encode(typeof data === 'string' ? data : JSON.stringify(data))
    ).then((encrypted) => btoa(String.fromCharCode(...Array.from(new Uint8Array(encrypted)))));
}

// export function encrypt(key: string, iv: string, data: any) {
//     const cipher = crypto.createCipheriv('aes-128-cbc', key.substr(0, 16), iv.substr(0, 16));
//     let crypted = cipher.update(typeof data === 'string' ? data : JSON.stringify(data), 'utf8', 'binary');
//     crypted += cipher.final('binary');
//     // eslint-disable-next-line no-buffer-constructor
//     crypted = new Buffer(crypted, 'binary').toString('base64');
//     return crypted;
// }

/**
 * 解密方法
 * @param key      解密的key
 * @param data  密文
 * @returns string
 */
export async function decrypt(key: PromiseReturnType<typeof generateKey>, data?: any) {
    // eslint-disable-next-line no-buffer-constructor
    const iv = await generateIv(key);
    return window.crypto.subtle.decrypt(
        {
            name: 'AES-CBC',
            iv
        },
        key,
        new TextEncoder().encode(typeof data === 'string' ? data : await encrypt(key, data))
    ).then((decrypted) => new TextDecoder('utf-8').decode(decrypted));
}

// export function decryptFunc(key: string, iv: string, data?: any) {
//     // eslint-disable-next-line no-buffer-constructor
//     const crypted = new Buffer(typeof data === 'string' ? data : encrypt(key.substr(0, 16), iv.substr(0, 16), data), 'base64').toString('binary');
//     const decipher = crypto.createDecipheriv('aes-128-cbc', key.substr(0, 16), iv.substr(0, 16));
//     let decoded = decipher.update(crypted, 'binary', 'utf8');
//     decoded += decipher.final('utf8');
//     return typeof decoded === 'string' ? JSON.parse(decoded) : decoded;
// }
