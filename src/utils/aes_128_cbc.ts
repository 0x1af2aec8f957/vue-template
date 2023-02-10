import md5 from 'md5';

/// NOTE: web.crypto 仅在 HTTPS 环境下可用
export const generateKey = (urlStr: string, isCompliance: boolean = true) => { // 根据url生成key
    const key = md5(String(urlStr.split('/').pop()));

    return window.crypto.subtle.importKey( // 根据url生成key
        'raw',
        new TextEncoder().encode(isCompliance ? key.slice(0, 16) /* 合规的情况下只允许16位 */ : key),
        {
            name: "AES-CBC",
            length: 128,
        },
        true,
        ['encrypt', 'decrypt']
    )
}

export async function generateIv(key: CryptoKey, isCompliance: boolean = true) { // 根据key生成iv
    const label = new TextDecoder('utf-8').decode(await crypto.subtle.exportKey('raw', key));
    const array = [];

    for (let idx = 1; idx <= label.length; idx += 1) { // 生成二叉树数组层级
        if ((idx & idx + 1) !== 0) continue;

        // 是否处于二叉树节点上[即是不是2的幂运算结果，附加已遍历过的二叉树节点数据]
        const index = idx - 1;
        const row = (Math.log2(idx + 1)); // 当前行数
        array.push(
            idx === 1
                ? label[index]
                : label.slice((2 ** (row/* 二叉树当前行数 */ - 1)) - 1, idx)
        );
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
        .join('');

    // return crypto.getRandomValues(new TextEncoder().encode(chars));
    return new TextEncoder().encode(isCompliance ? chars.slice(0, 16) /* 合规的情况下只允许16位 */ : chars);
}

/**
 * 加密方法
 * @param {CryptoKey} key 加密的key
 * @param {ArrayBuffer} iv 加密的iv
 * @param {any} data  密文
 * @returns string
 */
export async function encrypt(key: CryptoKey, iv: Uint8Array, data: any) {
    return window.crypto.subtle.encrypt(
        {
            name: 'AES-CBC',
            length: 128,
            iv
        },
        key,
        // new TextEncoder().encode(typeof data === 'string' ? data : JSON.stringify(data))
        Uint8Array.from(typeof data === 'string' ? data : JSON.stringify(data), (str) => str.charCodeAt(0))
    ).then((encrypted) => btoa(String.fromCharCode(...Array.from(new Uint8Array(encrypted)))));
}

/**
 * 解密方法
 * @param {CryptoKey} key 解密的key
 * @param {ArrayBuffer} iv 解密的iv
 * @param {any} data  密文
 * @returns string
 */
export async function decrypt(key: CryptoKey, iv: Uint8Array, data: any) {
    return window.crypto.subtle.decrypt(
        {
            name: 'AES-CBC',
            length: 128,
            iv: iv.slice(0, 16)
        },
        key,
        // new TextEncoder().encode(typeof data === 'string' ? atob(data) : await encrypt(urlStr, data))
        Uint8Array.from(atob(typeof data === 'string' ? data : await encrypt(key, iv, data)), (str) => str.charCodeAt(0))
    ).then((decrypted) => {
        const decoded = new TextDecoder('utf-8').decode(decrypted);
        return typeof decoded === 'string' ? JSON.parse(decoded) : decoded;
    });
}
