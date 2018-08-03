# vue-cli3.0

> A Vue.js template

> Vue <- babel-preset-env

## 扩展的Babel文档地址

[:: -> 双冒号运算符](https://github.com/tc39/proposal-bind-operator)  
[@decorators -> class装饰器语法](https://github.com/wycats/javascript-decorators/blob/master/README.md)  
[do { true } -> do表达式](https://github.com/tc39/proposal-do-expressions)  
[obj?.foo?.bar?.baz -> 链式判断运算符](https://github.com/tc39/proposal-optional-chaining)  
[add(1, ?) -> 函数的部分执行](https://github.com/tc39/proposal-partial-application)  
[1 |> # + 1 -> 管道运算符](https://github.com/js-choi/proposal-smart-pipelines)  

#### 定义说明

- 国际化
- vuex
- 路由拦截
- 鉴权访问
- 错误上报
- 页面meta、title处理
- router、route在Vue外部使用

package.json

1. private: bool #是否作为私有模块发布，私有模块项目仅内网可打包部署访问。
2. realmName: Sting #当适用OSS、CDN打包部署时，该值为相关节点的域名，打包时将自动帮你处理这些资源依赖。
3. homepage: Sting #当作为本地部署时，该值对于多项目部署到同一域名下有效，所有打包资源将相对于index.html的位置。如果该项目独享一个域名请删除该字段。
