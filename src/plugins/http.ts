import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource, Canceler } from 'axios';

import http from 'axios'; /// doc: https://github.com/axios/axios#axios-api
import moment from 'moment'; /// doc: https://momentjs.com/docs
import cookies from 'cookies-js'; /// doc: https://github.com/ScottHamper/Cookies

import { getI18nLanguage } from '../setup/i18n-setup';
import router from '../setup/router-setup';
import { typeOf, deepCopy } from '../utils/common';

export type { AxiosInstance };

enum AcceptType {
    Json = 'application/json',
    Plain = 'ext/plain',
    Multipart = 'application/x-www-form-urlencoded'
}

const xhrDefaultConfig: AxiosRequestConfig = {
    headers: {
        'Content-Type': `${AcceptType.Json};charset=UTF-8`, /// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
        'Cache-Control': 'no-cache', /// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
        deviceID: `WEB-${window.navigator.userAgent}`,
        Accept: AcceptType.Json /// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept
        // Connection: 'Keep-Alive', /// HTTP1.1, https://en.wikipedia.org/wiki/HTTP_persistent_connection
        // 'Accept-Encoding': 'gzip', /// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
        // 'Accept-Charset': 'utf-8', /// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Charset
    }
    // timeout: 1000,
};

function httpInit(instance: AxiosInstance): AxiosInstance {
    instance.interceptors.request.use((config: AxiosRequestConfig): any => ({
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
                switch (true) {
                case headers.Accept === AcceptType.Json:
                    return JSON.stringify(data);
                case headers.Accept === AcceptType.Plain:
                    return JSON.stringify(data);
                case headers.Accept === AcceptType.Multipart:
                    return Object.entries(data).reduce((acc: FormData, cur: [string, any]): FormData => {
                        acc.append(...cur);
                        return acc;
                    }, new FormData());
                default:
                    break;
                }
            }
        ]
    }), (error: Error) => Promise.reject(error) /* toast(error.message) */);

    instance.interceptors.response.use((response: AxiosResponse): any => {
        const {
            data,
            config: { headers }
        }: {
            data: any,
            config: AxiosRequestConfig
        } = response;

        const newData: {[key: string]: any} = deepCopy(data);

        if (typeOf(newData) !== 'object' || !headers?.pretreatment) return newData;

        switch (true) {
        case newData.code === 0: // 去登录示例
            // toast('请登录');
            cookies.expire('token');
            router.replace('login');
            return Promise.reject(new Error(`${data.code} 登录超时`));
        case newData.status === 1: // 正常
            return newData.data;
        case newData.result === 'success': // 正常
            return newData.content;
        default:
            return Promise.reject(new Error(newData?.msg || newData?.message));
        }
    }, (error) => {
        const { response /* __CANCEL__ */ } = error;
        // if (!__CANCEL__) toast(response.message || response.data.message); // 非主动取消请求的接口
        throw new Error(response);
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
