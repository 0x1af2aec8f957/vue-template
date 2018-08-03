import os from 'os';
import i18n from '../setup/i18n-setup';
import {
  http, cookies, toast, md5, moment,
} from '../utils/common';
import {
  encrypt, decrypt, generateKey, generateIv,
} from '../utils/aes_128_cbc';
import { typeOf } from '../utils';
import jockey from '../utils/jockey';

const isSigned = false; // 是否支持接口签名
// const isRefresh = true; // 是否需要缓存

const xhrDefaultConfig = {
  headers: {
    OS: JSON.stringify({
      platform: os.platform(),
      totalmem: os.totalmem(),
      freemem: os.freemem(),
      endianness: os.endianness(),
      arch: os.arch(),
      tmpdir: os.tmpdir(),
      type: os.type(),
    }),
    'Content-Type': 'application/json;charset=UTF-8',
    'Cache-Control': 'no-cache',
    // 'User-Agent': os.release(),
    DEVICESOURCE: 'web',
    Accept: 'application/json',
  },
  // timeout: 1000,
};

function httpInit(instance) {
  instance.interceptors.request.use(config => ({
    ...config,
    headers: {
      ...xhrDefaultConfig.headers,
      deviceID: md5(`${navigator.userAgent}${cookies.get('token')}`),
      token: cookies.get('token'),
      'X-B3-Traceid': moment().valueOf() * 1000, // Traceid
      'X-B3-Spanid': moment().valueOf() * 1000,
      Language: i18n.locale,
    },
    transformRequest: [
      (data = {}/* , headers */) => {
        const cryptoKey = generateKey(config.url);
        const cryptoIv = generateIv(cryptoKey);

        if (isSigned) {
          return (typeOf(data) === 'formData' ? data : encrypt(cryptoKey, cryptoIv, data));
        }

        return typeOf(data) === 'object' ? Object.entries(data).reduce((acc, cur) => acc.append(...cur) || acc, new FormData()) : data;
      },
    ],
  }), (error) => {
    toast(error.message);
    return Promise.reject(error);
  });

  instance.interceptors.response.use((/* response */{ data = {}, config: { url }}) => {
    // Do something with response data
    const cryptoKey = generateKey(url);
    const cryptoIv = generateIv(cryptoKey);

    const newData = isSigned ? decrypt(cryptoKey, cryptoIv, data): data;

    if (typeOf(data) !== 'object') return newData;
    switch (data?.code) {
      case '100000': // 去登录
        toast('请登录');
        cookies.expire('token');
        jockey.send('login'); // 原生登录
        return Promise.reject(new Error(`${data.code} 登录超时`));
      case '000000': // 正常
        return data.data;
      /* case '100007':
        return data; // 账户已经存在 */
      default:
        try {
          toast(data.msg || data.message);
          return Promise.reject(new Error(data.msg));
        } catch (error) {
          return data;
        }
    }
  }, (error) => {
    const { response, __CANCEL__ } = error;
    if (!__CANCEL__) toast(response.message || response.data.message);
    throw new Error(response);
  });

  return instance;
}

export default typeof Proxy === 'undefined' ? {
  instance: (uri) => {
    const { baseURL = uri, timeout } = xhrDefaultConfig;
    return httpInit(http.create({
      baseURL,
      timeout,
    }));
  },
} : new Proxy(Object.create(null),
  {
    get(target, key) {
      if (key === 'instance') return null;
      const { baseURL = key, timeout } = xhrDefaultConfig;
      return httpInit(http.create({
        baseURL,
        timeout,
      }));
    },
  });
