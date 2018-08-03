// eslint-disable-next-line max-classes-per-file
import type { AxiosInstance } from 'axios';

import http from '../plugins/http';

abstract class Api {
    protected api: AxiosInstance;

    constructor() {
        const baseUrl: string = '/mock';
        this.api = http[baseUrl] || http.instance(baseUrl);
    }

    // protected abstract verifyParamsSchema<T>(params: object, schema: object): T | null;  // 如果需要中间件拦截(参数验证等服务)，可以使用Joi集成服务
}

class FetchTest extends Api {
    fetchMockTest(): Promise<any> {
        return this.api.get('/test' /* path: /api/test */, { params: { t: Date.now().valueOf() } }).then((r: any) => {
            console.log(`获取到mock数据：${JSON.stringify(r)}`);
            return r;
        });
    }
}

export default new FetchTest();
