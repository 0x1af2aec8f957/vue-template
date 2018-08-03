type _Cookie = false | string | {
    [domain: string]: string
};

export interface DevServerProxy{ // doc: https://github.com/chimurai/http-proxy-middleware#http-proxy-options
    [path: string]: {
        target: string;
        pathRewrite?: {
            [path: string]: string
        } | ((path: string, req?: object) => string | Promise<string>);
        router?: {
            [path: string]: string
        } | ((req: object) => string | Promise<string>);
        forward?: string;
        agent?: { // doc: https://nodejs.org/api/http.html#http_new_agent_options
            keepAlive?: boolean,
            keepAliveMsecs?: number,
            maxSockets?: number,
            maxTotalSockets?: number,
            maxFreeSockets?: number,
            scheduling?: string,
            timeout?: number
        };
        ssl?: { // doc: https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
            key: string,
            cert: string,
        };
        logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'silent',
        logProvider?: (provider: any) => object,
        ws?: boolean;
        xfwd?: boolean;
        secure?: boolean;
        toProxy?: boolean;
        prependPath?: boolean;
        ignorePath?: boolean;
        localAddress?: string;
        changeOrigin?: boolean;
        preserveHeaderKeyCase?: boolean;
        auth?: string;
        hostRewrite?: string | number;
        autoRewrite?: string | number;
        protocolRewrite?: 'http' | 'https';
        cookieDomainRewrite?: _Cookie;
        cookiePathRewrite?: _Cookie;
        headers?: {
            [requestFieldKey: string]: any // doc: https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Request_fields
        };
        proxyTimeout?: number; // in millis
        timeout?: number; // in millis
        followRedirects?: boolean;
        selfHandleResponse?: boolean;
        buffer?: any;
    }
}

const proxy: DevServerProxy = {
    '/api': {
        // target: 'http://192.168.3.1:5001',
        target: 'https://www.example.com',
        changeOrigin: true
        /* pathRewrite: {
            '^/': '', // rewrite...
        }, */
    }
};

module.exports = proxy;
