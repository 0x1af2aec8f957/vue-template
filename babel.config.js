module.exports = {
  presets: [
    ['@vue/app', {
      useBuiltIns: 'entry',
    }],
  ],
  plugins: [
    '@babel/plugin-proposal-function-bind',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'smart' }],
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-partial-application'],
};
