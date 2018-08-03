/* eslint no-param-reassign: ["error", {
      "props": true,
      "ignorePropertyModificationsFor": ["state"]
    }] */

export default {// 同步函数，遵循Vue同步规则
  updateMqttConfig(state, config) {
    state.mqttConf = config;
  },
  updateCountryList(state, payload) {
    state.countryList = payload;
  },
};
