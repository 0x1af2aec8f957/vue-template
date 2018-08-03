import * as Config from 'webpack-chain';

/// 自定义或颗粒化修正webpack.config
module.exports = (config: Config): void => {
    // config继承自webpack.base.ts实例
    console.log('webpack.config.js-------');
    // console.log(config.toString());
};
