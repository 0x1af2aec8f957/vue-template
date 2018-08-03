/// doc: https://expressjs.com/en/4x/api.html
// eslint-disable-next-line import/no-extraneous-dependencies
import express from 'express';

const fs = require('fs');
const path = require('path');

function fetchFile(_path: string = __dirname, reg: RegExp = /[\S\s]/): string[] { // XXX: 模拟Webpack.require.context递归查找模块文件
    // @ts-ignore
    return fs.readdirSync(_path, <fs.BaseEncodingOptions>{ withFileTypes: true }).reduce((manifest: string[], file: fs.Dirent) => {
        const { name }: {name: string} = file;
        if (__filename === path.join(_path, name)) return manifest; // 排除本文件

        if (file.isDirectory()) { // 目录递归
            return manifest.concat(fetchFile(path.resolve(_path, file.name), reg));
        }

        return reg.test(name) ? manifest.concat(path.resolve(_path, name)) : manifest; // 匹配符合规则的文件
    }, []);
}

// mock module export
module.exports = function mockModule(app: express.Application): void {
    // mock module import...
    const modules: string[] = fetchFile(__dirname, /\.(js|ts)$/);

    // mock module install
    modules.forEach((module: string) => {
        // eslint-disable-next-line import/no-dynamic-require
        const mockInstance: (app: express.Application) => void = require(module);

        mockInstance.call(Object.create(null), app/* , server, compiler */);
    });
};
