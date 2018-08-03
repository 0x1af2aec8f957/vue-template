import http from '../plugins/http';
import { Joi } from '../utils/common';
// import store from '../store';
import schemas from './schemas';

const version = 'v1'; // http://www.notescript.app/api/v1/test
const key = `/test/${version}`;

const api = http[key] || http.instance(key); // api modules.test

class Service {
  api = api;

  // 需要验证参数的接口请使用@validate装饰器同步抛出错误给下一层业务组件
  // 不关心返回状态的api,可直接返回api的promise，无需重复书写async功能函数
  // @validate(schemas.test) // 可以在此处验证参数
  test(params) {
    // 进行参数验证的promise，在then方法回调里必须返回一个新的promise对象，否则会导致请求失败后走成功(then)方法，期望去catch处理异常。
    // return this.api.post('/news', params);
    return Joi.validate(params, schemas.test).then(values => this.api.post('/news', values));
  }

  uploadFile(params) {
    this.api.post('/upload/file', params);
  }

  quotationHistory(params, cancelToken) {
    this.api.post('/quotation/history', params, { cancelToken });
  }
}

export default new Service();
