import { responseInterceptor, Options, fixRequestBody } from 'http-proxy-middleware';
import axios from 'axios';
import type * as http from 'http';

type _Cookie = false | string | {
    [domain: string]: string
};

export interface DevServerProxy{ // doc: https://github.com/chimurai/http-proxy-middleware#http-proxy-options
    [path: string]: Options
}

const certificatePaylod = new Map(); // 代理时的授权访问凭证
const proxy: DevServerProxy = {
    '/api': {
        // target: 'http://192.168.3.1:5001',
        target: 'https://www.example.com',
        changeOrigin: true,
        /* pathRewrite: {
            '^/': '', // rewrite...
        }, */
        selfHandleResponse: true, // 开启拦截来自上游的响应 responseInterceptor
        onProxyReq(proxyReq: http.ClientRequest, req: http.IncomingMessage, res: http.ServerResponse) {
            // add custom header to request
            certificatePaylod.set('domain', `${proxyReq.protocol}//${proxyReq.host}`/* 代理配置中的 target 属性值 */); // 设置许可域
            if (certificatePaylod.has('token')) proxyReq.setHeader('token', certificatePaylod.get('token')); // 如果 certificatePaylod 存在 token 则自动写入header
            // or log the req
        },
        onProxyRes: responseInterceptor(async (responseBuffer: Buffer, proxyRes: http.IncomingMessage, req: http.IncomingMessage, res: http.ServerResponse) => {
            const response = responseBuffer.toString('utf8'); // 从代理目标获取到的数据
            const result = JSON.parse(response); // 数据源解析成JSON格式

            if (result.code === '403') { // 登录凭证过期
                await axios.post(`${certificatePaylod.get('domain')}/login`, { // 处理自动授权登录并保存访问凭证
                    userName: 'example@examplecom',
                    password: 'example'
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(({headers, data}) => {
                    if (headers.token) certificatePaylod.set('token', headers.token); // 存储token
                    if (data.id) certificatePaylod.set('userId', data.userId); // 存储userId
                    console.log(`已自动完成授权，授权用户 -> ${certificatePaylod.get('userId')}`);
                });

                return JSON.stringify({ // manipulate response and return the result
                    code: 'http-proxy-middleware-certificate-error',
                    message: 'http-proxy-middleware-error: 登录失效，已自动重新登录，请刷新界面'
                });
            }

            return response;
        })
    }
};

module.exports = proxy;
