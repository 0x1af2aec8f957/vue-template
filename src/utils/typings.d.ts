/// doc: https://www.typescriptlang.org/docs/handbook/modules.html#wildcard-module-declarations
// typescript 加载非自带loader的文件格式
type WebpackContent = {
    [key in (string | number)]: any
}

declare module '*.yml' { // NOTE: 非ts-loader
    const content: WebpackContent;
    export default content;
}

declare module '*.json' { // NOTE: 非ts-loader
    const value: WebpackContent;
    export default value;
}

declare module '*.svg' { // NOTE: vue-svg-loader
    import { DefineComponent } from 'vue';

    const component: DefineComponent;
    export default component;
}

/* declare module '*.vue' { // NOTE: 非ts-loader
    // const value: WebpackContent;
    import Vue from 'vue';

    export default Vue;
} */

declare module '*.vue' { // NOTE: ts-loader
    import { defineComponent } from 'vue';

    const component: ReturnType<typeof defineComponent>;
    export default component;
}

declare module 'worker-loader!*' { // worker-loader
    // You need to change `Worker`, if you specified a different value for the `workerType` option
    class WebpackWorker extends Worker {
        constructor();
    }

    // Uncomment this if you set the `esModule` option to `false`
    // export = WebpackWorker;
    export default WebpackWorker;
}
