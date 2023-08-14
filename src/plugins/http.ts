import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource, Canceler } from 'axios';

import http from 'axios'; /// doc: https://github.com/axios/axios#axios-api
import moment from 'dayjs'; /// doc: https://momentjs.com/docs
import cookies from 'cookies-js'; /// doc: https://github.com/ScottHamper/Cookies

import { getI18nLanguage } from '../setup/i18n-setup';
import router from '../setup/router-setup';
import { typeOf, deepCopy } from '../utils/common';
import { generateKey, decrypt, encrypt, generateIv } from '../utils/aes_128_cbc';

export type { AxiosInstance };

export enum AcceptType {
    Json = 'application/json',
    Plain = 'ext/plain',
    Multipart = 'multipart/form-data',
    stream = 'application/json, ext/plain',
}

const xhrDefaultConfig: AxiosRequestConfig = {
    headers: {
        'Content-Type': AcceptType.Json, /// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
        'Cache-Control': 'no-cache', /// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
        deviceID: `WEB-${window.navigator.userAgent}`,
        Accept: `${AcceptType.Json};charset=UTF-8` /// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept
        // Connection: 'Keep-Alive', /// HTTP1.1, https://en.wikipedia.org/wiki/HTTP_persistent_connection
        // 'Accept-Encoding': 'gzip', /// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
        // 'Accept-Charset': 'utf-8', /// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Charset
    }
    // timeout: 1000,
};

function httpInit(instance: AxiosInstance): AxiosInstance {
    instance.interceptors.request.use(async (config: AxiosRequestConfig): Promise<any> => {
        const cryptoKey =  await generateKey(String(config.url));
        const cryptoIv =  await generateIv(await generateKey(String(config.url), false));
        const currData = config.method === 'post' && config.headers?.isDecrypt ? await encrypt(cryptoKey, cryptoIv, config.data) : JSON.stringify(config.data);

        return {
            ...config,
            headers: {
                pretreatment: true, // 是否进行数据预处理，不进行预处理将返回原始的数据结构到集成层（适用于获取完整的数据结构，而非仅获取需要的数据）
                token: cookies.get('token'),
                'X-B3-Traceid': moment().valueOf() * 1000, // Traceid
                'X-B3-Spanid': moment().valueOf() * 1000, // Spanid
                'Accept-Language': getI18nLanguage(), // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
                ...config.headers
            },
            transformRequest: [
                (data: {[key: string]: any}, headers: {[key: string]: any}) => {    
                    // if (headers['Content-Type']=== AcceptType.Json) return currData;
                    // if (headers['Content-Type'] === AcceptType.Plain) return currData;
                    if (headers['Content-Type'] === AcceptType.Multipart) return Object.entries(data).reduce((acc: FormData, cur: [string, any]): FormData => {
                        acc.append(...cur);
                        return acc;
                    }, new FormData());

                    if (headers['Content-Type'] === AcceptType.stream) return Object.entries(data).reduce((acc: FormData, cur: [string, any]): FormData => {
                        acc.append(...cur);
                        return acc;
                    }, new FormData());

                    return currData;
                }
            ]
        }
    }, (error: Error) => Promise.reject(error) /* toast(error.message) */);

    instance.interceptors.response.use(async (response: AxiosResponse): Promise<any> => {
        const {
            data,
            config: { headers, url }
        }: {
            data: any,
            config: AxiosRequestConfig
        } = response;
        const cryptoKey =  await generateKey(String(url));
        const cryptoIv =  await generateIv(await generateKey(String(url), false));

        if (Object.prototype.toLocaleString.call(data) === '[object Blob]') return data; // 二进制下载文件
        const newData: {[key: string]: any} = response.headers.decrypt === 'true' ? await decrypt(cryptoKey, cryptoIv, data) : deepCopy(data);
        if (typeOf(newData) !== 'object' || !headers?.pretreatment) return newData;

        if (newData.code === 0) { // 去登录，错误提示、异常抛出由后续流程继续处理
            cookies.expire('token'); // 使凭证过期
            router.replace('/login'); // 主动登录
        }

        if (newData.status === 1) { // 正常
            return newData.data;
        }

        return Promise.reject(newData?.msg || newData?.message);
    }, (error: any) => {
        const { response /* __CANCEL__ */ } = error;
        // if (!__CANCEL__) toast(response.message || response.data.message); // 非主动取消请求的接口
        // throw new Error(response); // Android-8.1.0 Chrome 打开此处会导致报错无法进入
    });

    return instance;
}

/**
 * 根据配置创建一个Axios实例，该实例支持取消
 *
 * @param uri String Axios中的baseURL参数
 * @return [AxiosInstance, Canceler] 返回一个元组；该元组头部为初始化好的Axios实例，尾部为取消当前实例请求的方法
 */
export function useHttp(uri: string): [AxiosInstance, Canceler] {
    const { CancelToken } = http;
    const { baseURL = uri, timeout, headers } = xhrDefaultConfig;
    const source: CancelTokenSource = CancelToken.source();

    return [
        httpInit(
            http.create({
                baseURL,
                timeout,
                headers,
                cancelToken: source.token
            })
        ),
        source.cancel
    ];
}

export default typeof Proxy === 'undefined' ? {
    instance: (uri: string): AxiosInstance => {
        const { baseURL = uri, timeout, headers } = xhrDefaultConfig;
        return httpInit(http.create({
            baseURL,
            timeout,
            headers
        }));
    }
} : new Proxy(Object.create(null),
    {
        get(target, key: string): AxiosInstance | null {
            if (key === 'instance') {
                throw new Error('当前运行环境支持Proxy，已阻断调用instance方法获取HTTP实例');
                return null;
            }
            const { baseURL = key, timeout, headers } = xhrDefaultConfig;
            return httpInit(http.create({
                baseURL,
                timeout,
                headers
            }));
        }
    });
