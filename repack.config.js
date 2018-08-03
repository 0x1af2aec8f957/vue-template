module.exports = {
  output: { // 输出
    ext: '.yml',
    dir: 'template_output',
  },
  input: { // 输入
    ext: '.vue',
    dir: 'src',
  },
  isFlat: true, // 是否递归
  // sep = '.', // 片段分隔符
  extract: /<i18n>([\S\s]*)<\/i18n>/, // 需要提取的正则表达式
  // hasManifest, // 生成清单
  // rewrite, // 重写
};
