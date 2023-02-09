import{ useHttp } from '../plugins/http';

const [api] = useHttp('/api');

// export function fetchMockTest(): Promise<any> {
//     return api.get('/test' /* path: /api/test */, { params: { t: Date.now().valueOf() } }).then((r: any) => {
//         console.log(`获取到mock数据：${JSON.stringify(r)}`);
//         return r;
//     });
// }

export function fetchMockTest(): Promise<any> {
    return api.get('/v1/info/app/download', { params: {appType: 2} }).then((r: any) => {
        console.log(`获取到mock数据：${JSON.stringify(r)}`);
        return r;
    });
}