#### Vue-template

[时间组件国际化·标准](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table)  
[版本组件·标准](https://semver.org/spec/v2.0.0-rc.1.html)

```bash
/
├── README.md
├── webpack # webpack相关配置及服务目录
├── node_modules # package包代码存放目录
├── package.json # 项目包描述文件
├── postcss.config.js # postcss配置文件
├── public # 原始静态资源目录(涵盖项目内部的模板文件)
├── src # 主要的工作目录
├── .eslintrc.json # eslintrc配置文件
├── .stylelintrc.json # stylelintrc配置文件
├── .env # 环境变量配置文件
├── .npmrc # npm私有仓库包
├── .yarnrc # yarn私有仓库包
├── .env.production # production模式环境变量配置文件
├── .env.development # development模式环境变量配置文件
└── tsconfig.json # ts配置文件

4 directories, 9 files
```

##### 你需要提前了解的一些事情？

> 模板基于Vue3.x搭建

[Vue单文件组件模板编译·vue-template-compiler](https://vue-loader.vuejs.org/guide/#manual-setup)已发生重大改变，该模板已移除该配置新添加替换方案[compiler-sfc](https://github.com/vuejs/vue-next/tree/master/packages/compiler-sfc#readme)，有关讨论信息可以参考：

1. [forum.vuejs.org](https://forum.vuejs.org/t/after-upgrading-to-vue-3-cannot-find-module-vue-compiler-sfc-package-json/103424/3)
2. [vue-next-webpack-preview](https://github.com/vuejs/vue-next-webpack-preview/blob/master/package.json)

###### 相关链接

1. [Better Type Inference](https://composition-api.vuejs.org/#better-type-inference)
2. [选择启用:schema-params-middleware-joi]('https://github.com/sideway/joi')

###### 相关说明或解释

1. 这是一个现代化开发的模板库，但更靠近未来开发，模板中全部使用typeScript作为书写语法，但你仍然可以使用js进行开发，使用ts语法的部分并非仅包含应用主体部分，涵盖到ts-node、webpack等基础配置及环境依赖项。
2. 模板中允许使用.js文件及代码进行开发，支持同时编译。使用ts书写的代码编译时间将慢于js代码，这是因为tsc编译时间很长的缘故。但不会影响产物包的代码。
3. 模板结构参照`flutter-cli` `vue-cli` `react-cli`设计的目录规范，在主工作目录下[src]不允许超过三层嵌套，避免使用大量的时间来追溯代码目录结构。

##### 配置文件文档参考地址

1. [ts-tsconfig](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
2. [ts-compilerOptions](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

##### 模板中使用到的技术栈

+ typescript
    1. [ts-node](https://github.com/TypeStrong/ts-node)
    2. [ts-lang](https://www.typescriptlang.org/docs/handbook/basic-types.html)
    3. [types/webpack](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/webpack?spm=a2c6h.14275010.0.0.72f64171bUvq0k)
    3. [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)
    
+ webpack
    1. [webpack-chain](https://github.com/neutrinojs/webpack-chain)
    2. [webpack](https://webpack.js.org/configuration/)
+ parcel
    1. [parceljs](https://parceljs.org/docs)
+ vue
    1. [vue](https://v3.vuejs.org)
    2. [vuex](https://next.vuex.vuejs.org) -> [pinia](https://pinia.esm.dev)
    3. [vue-router](https://next.router.vuejs.org)
    3. [vue-i18n](https://vue-i18n-next.intlify.dev)
+ http
    1. [axios](https://github.com/axios/axios#axios-api)
    2. [选择启用：schema-params-middleware-joi](https://github.com/sideway/joi/blob/master/API.md)
+ environment
    1. [https://github.com/motdotla/dotenv#config](https://github.com/motdotla/dotenv#config)
+ cookie
    1. [js-cookie](https://github.com/js-cookie/js-cookie#basic-usage)
+ date
    1. [已在webpack打包中优化体积:moment](https://momentjs.com/docs/#/parsing)
+ eslint
    1. [eslint-vue](https://eslint.vuejs.org)
    2. [airbnb-base](https://github.com/airbnb/javascript)

##### 已知的问题

1. [stylelint-webpack-plugin·V2.2.0](https://github.com/webpack-contrib/stylelint-webpack-plugin/issues/234#issue-922440555) Build将需要更长时间（可能长达数十分钟，请勿轻易升级）的等待。
2. [postcss-html·V1.2.0](https://github.com/stylelint/vscode-stylelint/issues/239#issuecomment-930422581) 无法找到`postcss-html/extract`模块，请勿轻易升级。
3. 由于`parcel`自身使用`JSON5`处理配置文件，所以在模板在配置文件中使用了注释，但是`webpack`自身使用的是`nodejs`解析的，当你使用`webpack`运行时，请将配置文件中的注释消除，避免抛出不必要的异常错误。

##### 帮助
[Buy me a coffee](https://www.buymeacoffee.com/0x1af2aec8f957)
