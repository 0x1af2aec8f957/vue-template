import mqtt from 'mqtt';
import store from '../store';
import { cookies, moment } from '../utils/common';

let instance = null;
let transitionState = false; // 过渡切换状态
const cacheQueue = new Map();
/* eslint-disable class-methods-use-this,no-console */

const switchVisibility = (event) => { // 当前网页tab切换
  transitionState = event.target.visibilityState === 'hidden';
  console.info(`%c${transitionState ? 'MQTT-SERVICE已挂起' : 'MQTT-SERVICE已唤醒'}`, `color:${transitionState ? 'red' : 'blue'}`);
};

class MQTTService {
  /**
   * 业务方获取推送服务
   * @param options
   *           .domain            string(Y)
   *           .username          string(Y)
   *           .password          string(Y)
   *           .clientId          string(Y)
   */
  
  get clientId() {
    const random = (digit = 10) => Math.random().toString(16).substr(2, digit);

    return cookies
      .set('clientId', `web-${cookies.get('token') || random(5)}-${random()}`)
      .get('clientId');
  }
  
  constructor() {
    const options = Object.values(store.getters.mqttConfig);
    const { clientId } = this;
    const client = mqtt.connect(options[0], Object.assign({ clientId }, options[1]));

    client.on('connect', this.onConnect);
    client.on('reconnect', this.onReconnect);
    client.on('close', this.onClose.bind(this));
    this.client = client;
    
    client.on('message', (_topic, message) => {
      if (!cacheQueue.size || transitionState || !cacheQueue.has(_topic)) return;
      const str = new TextDecoder('utf-8').decode(message);
      if (str === 'close') return;
      cacheQueue.get(_topic)(JSON.parse(str));
    });
  }

  onConnect() {
    console.log(`[${moment().format()}]%cMQTT-SERVICE连接成功`, 'color:blue;');
    document.addEventListener('visibilitychange', switchVisibility);
  }

  subscribe(topic) {
    console.info('正在订阅：', topic);
    const { client } = this;

    return (success, failed) => {
      client.subscribe(topic, (err) => {
        process.nextTick(() => { transitionState = false; });
        return err ? failed && failed(err) : success && cacheQueue.set(topic, success);
      });

      return client;
    };
  }

  onReconnect() {
    console.warn(`${moment().format()}%cMQTT-SERVICE重连中`, 'color:red;');
  }

  onClose() {
    const { clientId, client: { options = {} } } = this;
    options.clientId = clientId; // 替换原有clientId，防止当前用户被自己踢下线

    document.removeEventListener('visibilitychange', switchVisibility);
    console.warn(`${moment().format()}%cMQTT-SERVICE链接断开`, 'color:red');
  }

  unsubscribe(topic, success) {
    transitionState = true;
    cacheQueue.delete(topic);
    console.info('取消订阅:', topic);
    const { client } = this;
    // eslint-disable-next-line no-console
    if (topic && client.connected) client.unsubscribe(topic, err => (err ? console.error(topic, err) : typeof success === 'function' && success(topic)));
    return client;
  }

  get connect() { // 再次连接
    const { client } = this;
    console.warn('%cMQTT-SERVICE尝试重连', 'color:red');
    return !client.connected && client.reconnect();
  }

  get close() {
    console.warn('%cMQTT-SERVICE即将被关闭', 'color:red');
    return this.client.end();
  }
}

export default {
  model: MQTTService,
  get instance() {
    if (!instance) instance = new MQTTService();
    return instance;
  },
  get config() {
    return store.getters.mqttConfig;
  },
};
