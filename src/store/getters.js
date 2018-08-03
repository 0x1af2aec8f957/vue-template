import md5 from 'md5';

export default { // 计算属性
  mqttConfig({ mqttConf }) { // 客户端mqtt所需要的配置
    const { protocol } = window.location;
    const isSSL = protocol.includes('https');
    const newProtocol = isSSL ? 'wss:' : 'ws:';
    const port = mqttConf[isSSL ? 'wssPort' : 'wsPort'];
    const host = mqttConf.mqttHost;
    return {
      domain: `${newProtocol}//${host}:${port}/mqtt`,
      config: {
        username: mqttConf.subscriber,
        password: mqttConf.subscriberPwd,
        keepalive: 20,
        // clientId: `web-${md5(document.cookie)}`,
      },
    };
  },
};
