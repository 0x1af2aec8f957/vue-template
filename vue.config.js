const CompressionPlugin = require('compression-webpack-plugin');
const pxToRem = require('postcss-pxtorem');

const rootPath = '/';

const isProduction = process.env.NODE_ENV === 'production';

const {
  npm_package_realmName: realmName,
  npm_package_name: name,
  npm_package_homepage: homepage,
  isOss,
} = process.env;

function generatePublicPath() { // 生成插件路径前缀
  switch (true) {
    case isOss === 'true':
      return `${realmName}/${name}`; // 打包后用于CDN/OSS
    case isProduction:
      return homepage || `/${name}`; // 打包后可直接部署
    default:
      return rootPath; // 打包后为根应用，适用于开发和主域应用
  }
}

module.exports = { // https://cli.vuejs.org/zh/config/#%E5%85%A8%E5%B1%80-cli-%E9%85%8D%E7%BD%AE
  // options...
  publicPath: generatePublicPath(),
  outputDir: `${name}` || 'checkout.dist',
  productionSourceMap: !isProduction,
  css: {
    sourceMap: !isProduction,
    loaderOptions: {
      css: {
        // 这里的选项会传递给 css-loader
      },
      postcss: {
        // 这里的选项会传递给 postcss-loader
        plugins: [pxToRem({
          rootValue: 75,
          propList: ['*'],
          // 注意：如果有使用第三方UI如VUX，则需要配置下忽略选择器不转换。
          // 规则是class中包含的字符串，如vux中所有的class前缀都是weui-。也可以是正则。
          // selectorBlackList: ['weui-'],
        })],
      },
      // 给 sass-loader 传递选项
      scss: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        data: '@import "@/assets/styleSheet/variables.scss";',
      },
      /* sass: {
        data: '@import "@/assets/styleSheet/variables.sass"', // empty file
      }, */
    },
  },
  chainWebpack(config) {
    config.module
      .rule('yml')
      .test(/\.ya?ml$/)
      .use('json')
      .loader('json-loader')
      .end()
      .use('yaml')
      .loader('yaml-loader')
      .end();

    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
      .end()
      .use('yaml')
      .loader('yaml-loader')
      .end();
  },
  // eslint-disable-next-line no-unused-vars
  configureWebpack(config) {
    if (process.env.NODE_ENV === 'production') { // GZIP压缩
      return {
        plugins: [new CompressionPlugin({
          test: /\.(js|css)(\?.*)?$/i, // 需要压缩的文件正则
          threshold: 10240, // 文件大小大于这个值时启用压缩
          deleteOriginalAssets: false, // 压缩后保留原文件
        })],
      };
    }

    return undefined;
  },
  devServer: {
    port: '8084',
    proxy: {
      '/api': {
        // target: 'http://192.168.3.1:5001', // 本地
        target: 'https://www.notescript.app', // 测试
        changeOrigin: true,
        pathRewrite: {
          '^/': '', // rewrite...,
        },
      },
    },
  },
  transpileDependencies: [/* 'proxy-polyfill' */],
};
