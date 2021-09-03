/// doc: https://github.com/neutrinojs/webpack-chain
/// NOTE: 由于node历史因素，配置文件模块加载使用CommonJS规范，很大程度上避免了大量的修改node及ts-node相关的配置项
import type * as HtmlWebpackType from 'html-webpack-plugin/typings';
// import type { DotenvParseOptions } from 'dotenv/types';
import * as path from 'path';
import * as process from 'process';
import * as fs from 'fs';
import * as url from 'url';
import * as Dotenv from 'dotenv';
import { DefinePlugin, BannerPlugin, ProvidePlugin, HotModuleReplacementPlugin } from 'webpack';
import Config, { LoaderOptions } from 'webpack-chain';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackBar from 'webpackbar';
import { VueLoaderPlugin } from 'vue-loader';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import MomentLocalesPlugin from 'moment-locales-webpack-plugin';
import * as Handlebars from 'handlebars';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin'; // NOTE: 不需要和ForkTsCheckerWebpackPlugin重复使用
import StyleLintPlugin from 'stylelint-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const packageInfo = require('../package.json');
const httpProxy = require('./webpack.proxy');
const serverBefore = require('./service');
const webpackMerge = require('./webpack.custom');

const workDir: string = process.cwd();
const config = new Config();
const ENV = process.env?.NODE_ENV as 'production' | 'development' | 'none';
const isProduction: boolean = ENV === 'production';
const isDevelopment: boolean = ENV === 'development';
const {
    version,
    realmName = '/',
    name: projectName
}:{
    version: string,
    realmName: string,
    name: string
} = packageInfo;

const publicPath: string = url.resolve(realmName, isDevelopment ? './' : `${projectName}/`); // publicPath & url

const envVariable = { // 工作区注入的环境变量
    BASE_URL: publicPath,
    VERSION: version,
    ...Dotenv.parse(<string | Buffer>fs.readFileSync(path.join(workDir, '.env'))),
    ...isDevelopment && Dotenv.parse(<string | Buffer>fs.readFileSync(path.join(workDir, '.env.production'))),
    ...isProduction && Dotenv.parse(<string | Buffer>fs.readFileSync(path.join(workDir, '.env.development')))
};

/// <reference path="html-webpack-plugin/typings.d.ts" />
const htmlWebpackOptions: HtmlWebpackType.ProcessedOptions = { // doc: https://github.com/jantimon/html-webpack-plugin#options
    publicPath: 'auto',
    title: 'vue-template',
    filename: 'index.html',
    template: path.join(workDir, 'public', 'index.html'),
    templateContent: false,
    templateParameters: false,
    inject: true,
    scriptLoading: 'defer',
    favicon: false,
    meta: false,
    // base: url.resolve(realmName, isDevelopment ? '/' : projectName),
    cache: false,
    minify: isProduction,
    hash: false, // 去掉上次浏览器的缓存（使浏览器每次获取到的是最新的html）
    showErrors: true,
    chunks: 'all',
    chunksSortMode: 'auto',
    excludeChunks: [],
    xhtml: true,
    compile: true,
    inlineSource: '.(js|css)'
    // environment: process.env
};

config
    .mode(ENV)
    .name(packageInfo.name)
    .stats({
        assets: false,
        modules: false,
        runtimeModules: false,
        cachedModules: false,
        assetsSort: '!size'
    })
    .devtool(isDevelopment ? 'eval-source-map' : false) // sourceMap映射性 /// doc: https://webpack.js.org/configuration/devtool/#devtool
    .entry('main') // 入口
    .add(path.resolve(workDir, 'src', 'main.ts'))
    .end()
    .output // 出口
    .path(path.resolve(workDir, projectName))
    .filename(isDevelopment ? 'js/[name].js' : 'js/[name].[hash:8].js')
    .publicPath(publicPath) // '单域名多项目'支持需要引入process.env.BASE_URL便于后续使用，单域名多项目不需要处理
    .end();

/* config.node
    .set('Buffer', false)
    .set('process', false); */

/* const styleLoaderOptions: object = { // vue-style-loader
            // 开启 CSS Modules
            modules: true,
            // 自定义生成的类名
            localIdentName: '[local]_[hash:base64:8]'
        };

config.module // css-loader
    .rule('css')
        .test(/\.css$/)
            .use('style')
                .loader(isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader')
                .options(styleLoaderOptions)
                .end()
            .use('css')
                .loader('css-loader')
                .options({
                    sourceMap: !isProduction,
                    importLoaders: isProduction ? 1 : 0
                })
                .end()
            .use('postcss')
                .loader('postcss-loader')
                .end()
            .end();

config.module // less-loader
    .rule('less')
        .test(/\.less$/)
            .use('style')
                .loader(isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader')
                .options(styleLoaderOptions)
                .end()
            .use('css')
                .loader('css-loader')
                .end()
            .use('postcss')
                .loader('postcss-loader')
                .end()
            .use('less')
                .loader('less-loader')
                .options({sourceMap: !isProduction})
                .end()
            .use('style-resources')
                .loader('style-resources-loader')
                .options({
                    injector: 'prepend',
                    // patterns: path.resolve(workDir, '@/assets/less/variables.less')
                })
                .end()
            .end();

// @ts-ignore
config.module // sass-loader
    .rule('sass')
        .test(/\.s[ac]ss$/i)
            .use('style')
                .loader(isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader')
                .options(styleLoaderOptions)
                .end()
            .use('css')
                .loader('css-loader')
                .end()
            .use('postcss')
                .loader('postcss-loader')
                .end()
            .use('sass')
                .loader('sass-loader')
                .options({
                    // additionalData: require('@/assets/sass/var.scss'), // 全局变量可加载
                    implementation: require('sass'),
                    // indentedSyntax: true, // sass缩进语法的支持，sass-loader version >= 8  // FIXME 由于版本文档无法支撑问题，无法知晓当前配置项是否生效
                    sassOptions: {
                        fiber: false, // 避免开销，解决同步编译的速度是异步编译速度的两倍[doc: https://webpack.js.org/loaders/sass-loader]
                    },
                })
                .end()
            .end();

config.module // stylus-loader
    .rule('stylus')
        .test(/\.styl(us)?$/)
            .use('style')
                .loader(isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader')
                .options(styleLoaderOptions)
                .end()
            .use('css')
                .loader('css-loader')
                .end()
            .use('postcss')
                .loader('postcss-loader')
                .end()
            .use('stylus')
                .loader('stylus-loader')
                .end()
            .end(); */
function createCSSRule(lang: string, test: RegExp, loader?: string, options?: Config.LoaderOptions): void { // 创建加载规则
    type _Rule = Config.Rule<Config.Rule>;
    const baseRule: Config.Rule<Config.Module> = config.module.rule(lang).test(test);

    function applyLoaders(rule: _Rule, isLocal: boolean) {
        rule.use('style').loader(MiniCssExtractPlugin.loader).end();
        // if (isProduction) rule.use('style').loader(MiniCssExtractPlugin.loader);
        // else if(isDevelopment)  rule.use('style').loader('vue-style-loader');

        rule.use('css')
            .loader('css-loader')
            .options({
                importLoaders: (
                    1 // stylePostLoader injected by vue-loader
                    + 1 // postcss-loader
                    + (isProduction ? 1 : 0)
                ),
                modules: {
                    // compileType: 'module', // css-loader >= 6.0.0, 使用mode设置即可
                    mode: isLocal ? 'local' : 'global',
                    localIdentName: '[local]_[hash:base64:8]'
                },
                sourceMap: isDevelopment
            })
            .end();

        rule.use('postcss').loader('postcss-loader').options({
            postcssOptions: {
                plugins: [
                    require('autoprefixer'),
                    require('postcss-import')()
                ]
            },
            sourceMap: isDevelopment
        })
            .end();

        if (typeof loader !== 'undefined') {
            rule.use(loader.replace(/(-loader)$/, '')).loader(loader).options(options as Config.LoaderOptions).end();
        }
    }

    // rules for <style lang="module">
    const vueModulesRule: _Rule = baseRule.oneOf('vue-modules').resourceQuery(/module/);
    applyLoaders(vueModulesRule, true);

    // rules for <style>
    const vueNormalRule: _Rule = baseRule.oneOf('vue').resourceQuery(/\?vue/);
    applyLoaders(vueNormalRule, false);

    // rules for *.module.* files
    const extModulesRule: _Rule = baseRule.oneOf('normal-modules').test(/\.module\.\w+$/);
    applyLoaders(extModulesRule, true);

    // rules for normal CSS imports
    const normalRule: _Rule = baseRule.oneOf('normal');
    applyLoaders(normalRule, false);
}

createCSSRule('css', /\.css$/); // css-loader
createCSSRule('postcss', /\.p(ost)?css$/); // postcss-loader
createCSSRule('scss', /\.s[ac]ss$/, 'sass-loader', { // sass-loader
    // additionalData: '@import "@/src/assets/sass/var.scss";', // 全局变量可加载
    implementation: require('sass'),
    // indentedSyntax: true, // sass缩进语法的支持，sass-loader version >= 8  // FIXME 由于版本文档无法支撑问题，无法知晓当前配置项是否生效
    sassOptions: {
        fiber: false // 避免开销，解决同步编译的速度是异步编译速度的两倍[doc: https://webpack.js.org/loaders/sass-loader]
    }
});
createCSSRule('less', /\.less$/, 'less-loader', { sourceMap: isDevelopment }); // less-loader
createCSSRule('stylus', /\.styl(us)?$/, 'stylus-loader', { // stylus-loader
    preferPathResolver: 'webpack'
});

config.module // vue-loader
    .rule('vue')
    .test(/\.vue$/)
    .use('cache-loader') // TODO webpack5已自带，但webpack-chain尚未支持
    .loader(require.resolve('cache-loader'))
    // .options(vueLoaderCacheConfig)
    .end()
    .use('thread')
    .loader('thread-loader')
    .end()
    .use('vue')
    .loader('vue-loader')
    /* .tap(options => merge(options, {
                        ...options,
                        loaders: {
                            // css: config.module.rules.get('css').end(),
                            // less: less
                        },
                        preserveWhitespace: false // 不要留空白
                    })) */
    .options({
        /* loaders: {
            sass: config.module
                .rule('scss')
                .oneOf('normal')
                .use('sass').entries(),
            less: config.module
                .rule('less')
                .oneOf('normal')
                .use('less').entries()
        }, */
        preserveWhitespace: false // 不要留空白
    })
    .end()
    .end();

config.module // js-loader
    .rule('js')
    .test(/\.js$/)
    /* .exclude
    .add((file: string): boolean => [ // 匹配过滤的路径
        /node_modules/,
        /node_modules\/vue((-router)|(-i18n)|x)?/ // Vue3.x版本发布的源码包含有最新的语法
    ].some((reg: RegExp): boolean => !reg.test(file)))
    .end() */
    .use('thread')
    .loader('thread-loader')
    .end()
    .use('cache') // TODO webpack5已自带，但webpack-chain尚未支持
    .loader('cache-loader')
    .end()
    .use('babel')
    .loader('babel-loader')
    .options({
        cacheDirectory: !isProduction
        // presets: [['@babel/preset-env', { modules: false }]]
    })
    .end()
    .end();

config.module // ts-loader
    .rule('ts')
    .test(/\.tsx?$/)
    .exclude
    .add(/node_modules/)
    .end()
    .use('thread')
    .loader('thread-loader')
    .end()
    .use('typeScript')
    .loader('ts-loader')
    .options({
        transpileOnly: true, // 为true会解决ts文件热更新异常的问题,但会丢失类型检查
        appendTsSuffixTo: ['\\.vue$'],
        compilerOptions: {
            sourceMap: isDevelopment
        },
        happyPackMode: true // 解决hooks is undefined
    })
    .end()
    .end();

config.module // worker-loader
    .rule('worker')
    .test(/\.worker\.(j|t)s$/)
    .use('thread')
    .loader('thread-loader')
    .end()
    .use('worker')
    .loader('worker-loader')
    .end()
    .end();

config.module // svg-loader
    .rule('svg')
    .test(/\.svg$/)
    /* .include
    .add(path.resolve(workDir, 'src'))
    .end() */
    .use('vue-loader')
    .loader('vue-loader')
    .end()
    .use('vue-svg-loader')
    .loader('vue-svg-loader')
    .end()
    .end();

config.module // html-loader
    .rule('html')
    .test(/\.html$/)
    .use('html')
    .loader('html-loader')
    .options({
        minimize: true,
        // attributes: false,
        preprocessor(content: string, loaderContext: { emitError: (arg0: any) => any }) : string { // 预处理
            /// doc: https://webpack.js.org/loaders/html-loader/#preprocessor
            try {
                return Handlebars.compile(content)(envVariable);
            } catch (error) {
                loaderContext.emitError(error);
                return content;
            }
        }
    })
    .end()
    .end();

config.module // image-loader
    .rule('image')
    .test(/\.(png|jpe?g|gif|bmp)$/)
    /* .include
    .add(path.resolve(workDir, 'src'))
    .end() */
    .use('image') // TODO 等待webpack-chain适应webpack5完成，当前无法使用type配置应用到webpack的assets内置模块
    .loader('url-loader')
    .options({
        limit: 1024, // 小于1k将图片转换成base64
        name: '[name].[hash:8].[ext]',
        outputPath: !isProduction ? './' : './images',
        esModule: false
    })
    .end()
    .end();

config.module // video-loader
    .rule('video')
    .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
    /* .include
    .add(path.resolve(workDir, 'src'))
    .end() */
    .use('video')
    .loader('url-loader')
    .options({
        limit: 1024, // 小于1k将图片转换成base64
        name: '[name].[hash:8].[ext]',
        outputPath: !isProduction ? './' : './videos',
        esModule: false
    })
    .end()
    .end();

config.module // font-loader
    .rule('font')
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
    /* .include
    .add(path.resolve(workDir, 'src'))
    .end() */
    .use('font')
    .loader('url-loader')
    .options({
        limit: 1024, // 小于1k将图片转换成base64
        name: '[name].[hash:8].[ext]',
        outputPath: !isProduction ? './' : './fonts',
        esModule: false
    })
    .end()
    .end();

config.module // i18n-loader
    .rule('i18n')
    .resourceQuery(/blockType=i18n/)
    .type('javascript/auto')
    .use('i18n')
    .loader('@intlify/vue-i18n-loader')
    .end()
    .use('yaml')
    .loader('yaml-loader')
    .end()
    .end();

config.module // yaml-loader
    .rule('yml')
    .test(/\.ya?ml$/)
    .use('json')
    .loader('json-loader')
    .end()
    .use('yaml')
    .loader('yaml-loader')
    .end()
    .end();

config.resolve.extensions // webpack加载模块文件忽略扩展名 /// NOTE: 请注意先后顺序，查找文件顺序按此执行
    .add('.ts')
    .add('.js')
    .add('.vue')
    .add('.json')
    .add('.css')
    .add('.scss')
    .add('.less')
    .add('.styl')
    .end();
// .clear();

config.resolve.modules // webpack处理模块代码查找的目录
    .add('node_modules')
    .add(path.resolve(workDir, 'node_modules'))
    .end();
// .clear();

config.resolve.alias // 创建别名 /// NOTE: 不推荐启用该项，不应该破坏IDE默认查找文件规则
    .set('@', path.resolve(workDir, 'src'))
    // .set('vue$', path.resolve(workDir, 'node_modules', 'vue', 'dist', 'vue.runtime.esm-bundler.js')) //XXX: 兼容使用vue-cli-serve[ui]安装插件
    .end();
// .clear();

/* config.externals({ // 模块解析捆绑项 /// doc: https://webpack.js.org/configuration/externals/
    Vue: {
        commonjs: 'vue',
        root: 'vue'
    },
    Vuex: {
        commonjs: 'vuex',
        root: 'vuex'
    },
    VueRouter: {
        commonjs: 'vue-router',
        root: 'vue-router',
    }
}); */

/* /// 环境变量解析，doc: https://github.com/motdotla/dotenv#readme
Dotenv.config(<DotenvConfigOptions>{ path: path.join(workDir, '.env')}); // 所有环境均生效
if (isProduction) Dotenv.config(<DotenvConfigOptions>{ path: path.join(workDir, '.env.production')}); // 生产环境生效
if (isDevelopment) Dotenv.config(<DotenvConfigOptions>{ path: path.join(workDir, '.env.development')}); // 开发环境生效
 */

config // 插件项
    .plugin('webpack-bar')
    .use(WebpackBar, [{
        name: projectName,
        color: '#0091ff',
        profile: isProduction,
    }])
    .end()
    .plugin('eslint')
    .use(ESLintPlugin, [{ // NOTE: 不需要和ForkTsCheckerWebpackPlugin重复使用
        extensions: ['js', 'vue', 'ts', 'jsx'], // 检测的文件扩展名称
        fix: true // 自动修复错误
        // lintDirtyModulesOnly: true,
        // exclude: 'node_modules'
    }])
    .end()
    .plugin('stylelint')
    .use(StyleLintPlugin, [{
        threads: true, // 线程池自动
        files: '**/*.(vue|htm|html|css|style|styl|less|(s(c|a)ss))', // 检测的文件扩展名称
        fix: true, // 自动修复错误
        customSyntax: 'stylelint-plugin-stylus/custom-syntax' // 自定义支持stylus语法解析
        // lintDirtyModulesOnly: true,
        // exclude: 'node_modules'
    }])
    .end()
    .plugin('clean-webpack-plugin') // https://github.com/johnagan/clean-webpack-plugin
    .use(CleanWebpackPlugin) // TODO webpack5已自带clear功能，无需使用该插件但需要webpack-chain支持
    .end()
    /* .plugin('bannerPlugin')
        .use(webpack.BannerPlugin, [`@m-cli ${TimeFn()}`])
        .end() */
    /* .plugin('hardSource-webpackPlugin')
    .use(HardSourceWebpackPlugin)
    .end() */
    .plugin('vueLoader-plugin')
    .use(VueLoaderPlugin)
    .end()
    .plugin('copyWebpack-plugin')// doc: https://webpack.js.org/plugins/copy-webpack-plugin/
    .use(CopyWebpackPlugin, [
        {
            patterns: [
                { from: path.resolve(workDir, 'public'),
                    to: 'public',
                    globOptions: {
                        dot: true,
                        gitignore: false, // FIXME: https://github.com/sindresorhus/globby/issues/145#issuecomment-666570212
                        ignore: ['**/*.md', '**/index.html', 'favicon.ico']
                    } }
                // { from: path.resolve(workDir, `node_modules/vue/dist/vue${isProduction ? '.min' : ''}.js`), to: 'public' },
                // { from: path.resolve(workDir, `node_modules/vuex/dist/vuex${isProduction ? '.min' : ''}.js`), to: 'public' },
                // { from: path.resolve(workDir, `node_modules/vue-router/dist/vue-router${isProduction ? '.min' : ''}.js`), to: 'public' },
            ],
            options: {
                concurrency: 100
            }
        }
    ])
    .end()
    .plugin('htmlWebpack-plugin') // doc: https://github.com/jantimon/html-webpack-plugin
    .use(HtmlWebpackPlugin, [htmlWebpackOptions])
    .end()
    .plugin('provide-plugin')
    .use(ProvidePlugin, [{ _: 'lodash' }])
    .end()
    .plugin('mini-css-extract-plugin')
    .use(MiniCssExtractPlugin, [{
        filename: isDevelopment ? '[name].css' : 'css/[name].[contenthash].css',
        chunkFilename: isDevelopment ? '[id].css' : 'css/[id].[contenthash].css'
    }])
    .end()
    /* .plugin('styleLint-plugin') // style-lint: https://stylelint.io/user-guide/configure
        .use(StyleLintPlugin, [{
                files: ['**!/!*.{vue,htm,html,css,sss,less,scss,sass}']
            }])
        .end() */
    .plugin('moment-locales-plugin') // moment-locale: https://github.com/iamakulov/moment-locales-webpack-plugin#usage
    .use(MomentLocalesPlugin, [{ // moment需要抽取的语言要在这里列出，否则会导致国际化不完善的情况
        localesToKeep: ['es-us', 'zh-cn']
    }])
    .end()
    .plugin('define-plugin')
    .use(DefinePlugin, [{
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        'process.env': JSON.stringify(envVariable)
    }])
    .end()
    .plugin('typescript')
    .use(ForkTsCheckerWebpackPlugin, [{ // 单开线程进行类型检查
        async: true, // 同步检查
        typescript: {
            ...config.module.rule('ts').use('typeScript').loader('ts-loader').get('options'),
            extensions: {
                vue: {
                    compiler: '@vue/compiler-sfc',
                    enabled: true
                }
            }
        },
        eslint: {
            enabled: false,
            files: '**/*.{ts,tsx,js,jsx,vue}', // ForkTsCheckerWebpackPlugin需要的检测文件名称
            options: config.plugin('eslint').get('args')[0] // 自动修复错误
            // lintDirtyModulesOnly: true,
            // exclude: 'node_modules'
        }
    }])
    .end()
    .end();

config.devServer // doc: https://github.com/chimurai/http-proxy-middleware#proxycontext-config
    .hot(true)
    .host('0.0.0.0')
    // .port(9000)
    .historyApiFallback(true) // 效果等同于nginx: try_files $uri $uri/ /index.html;
    .open(true)
    .compress(true)
    // .noInfo(false)
    .useLocalIp(true)
    .writeToDisk(false)
    .before(serverBefore)
    .proxy(httpProxy)
    .end();
// .clear();

// config.performance.hints(false) // 忽略文件打包后的体积警告

config.optimization // 构建与打包优化项  /// doc: https://webpack.js.org/configuration/optimization/
    .minimize(isProduction)
    .minimizer('terser-webpack-plugin') // js代码压缩
    .use(TerserPlugin, [{ /// doc: https://github.com/terser/terser#minify-options
        parallel: true, // 并发构建
        terserOptions: { // Terser 压缩配置
            format: { /// doc: https://github.com/terser/terser#format-options
                comments: isDevelopment || /@license/i, // 剥离所有有效的注释（即 /^\**!|@preserve|@license|@cc_on/i ）并保留 /@license/i 注释
              },
        },
        extractComments: true, // 是否剥离注释（删除注释使用false）
    }])
    .end()
    .splitChunks(/* <webpack.Options.SplitChunksOptions> */{ // 代码分割及性能优化
        chunks: 'all',
        minSize: 30000,
        maxSize: 80000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '-',
        name(module: {identifier: Function}, chunks: Array<{name: string}>, cacheGroupKey: string) {
            const moduleFileName: string = module.identifier().split('/').reduceRight((item: string) => item);
            const allChunksNames: string = chunks.map((item) => item.name).join('-');
            return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
        },
        cacheGroups: {
            default: false,
            defaultVendors: {
                test: /[\\/]node_modules[\\/]/,
                name: 'module',
                priority: 10
            }
            /* 'meri-design': {
                test: /[\/]node_modules[\/]meri-design[\/]/,
                // test: /[\/]node_modules[\/]/,
                name: 'meri-design',
                // minChunks: 1,
                priority: 1,
                enforce: true
            } */
        }
    })
    .minimizer('css')
    .use(CssMinimizerPlugin) // 生产模式优化
    .end();

// 正式环境使用gZip打包
config.when(
        <boolean>isProduction,
        (config: Config): void => {
            config.plugin('compression-plugin')// gzip压缩
                .use(CompressionPlugin, [{
                    test: /\.(js|css)(\?.*)?$/i, // 需要压缩的文件正则
                    threshold: 10240, // 文件大小大于这个值时启用压缩
                    deleteOriginalAssets: false // 压缩后保留原文件
                }])
                .end()
                .end();
        }
);

// 开发环境使用HMR更新资产模块
config.when(<boolean>isDevelopment, (config: Config) : void => {
    config.plugin('hot-module-replacement-plugin')
        .use(HotModuleReplacementPlugin)
        .end()
        .end();
});

webpackMerge(config); // XXX: 外部修改config基础配置，待优化

export default config.toConfig();
