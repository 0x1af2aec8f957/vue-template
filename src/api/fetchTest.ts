import{ useHttp } from '../plugins/http';

const [api] = useHttp('/mock');

export function fetchMockTest(): Promise<any> {
    return api.get('/test', { params: { t: Date.now().valueOf() } }).then((r: any) => {
        console.log(`获取到mock数据：${JSON.stringify(r)}`);
        return r;
    });
}