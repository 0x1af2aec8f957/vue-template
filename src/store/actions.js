import api from '../api/apiModule_1';

export default {
  async updateUserInfo(context) {
    const userInfo = await api.fetchStateLevel();
    context.commit('updateUserInfo', userInfo);
  },
  async updateRatesConf(context) {
    const rateConf = await api.fetchRatesConf();
    context.commit('updateRatesConf', rateConf.list);
  },
};
