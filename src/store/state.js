export default {
  msg: 'hello vue.app',
  countryList: [], // 国家列表
  mqttConf: { // 服务端返回的mqtt配置信息
    isShow: false,
    mqttHost: 'mq.noteScript.app',
    subscriber: '',
    subscriberPwd: '',
    tcpPort: 0,
    topicPrefix: '',
    wsPort: '80',
    wssPort: '443',
  },
};
