/* eslint-disable */
/* initGeetest 1.0.0
 * 用于加载id对应的验证码库，并支持宕机模式
 * 暴露 initGeetest 进行验证码的初始化
 * 一般不需要用户进行修改
 */


if (typeof window === 'undefined') {
  throw new Error('Geetest requires browser environment');
}
const { document } = window;
const { Math } = window;
const head = document.getElementsByTagName('head')[0];

class Config {
  constructor(config) {
    Object.entries(config).forEach(([key, value]) => {
      this[key] = value;
    });
  }

    api_server = 'api.geetest.com'

    protocol = 'http://'

    type_path = '/gettype.php'

    fallback_config = {
      slide: {
        static_servers: ['static.geetest.com', 'dn-staticdown.qbox.me'],
        type: 'slide',
        slide: '/static/js/geetest.0.0.0.js',
      },
      fullpage: {
        static_servers: ['static.geetest.com', 'dn-staticdown.qbox.me'],
        type: 'fullpage',
        fullpage: '/static/js/fullpage.0.0.0.js',
      },
    }

    _get_fallback_config() {
      if (typeof this.type === 'string') {
        return this.fallback_config[this.type];
      } if (this.new_captcha) {
        return this.fallback_config.fullpage;
      }
      return self.fallback_config.slide;
    }

    _extend(obj) {
      Object.entries(obj).forEach(([key, value]) => {
        this[key] = value;
      });
    }
}

const callbacks = {};
const status = {};

function loadScript(url, cb) {
  const script = document.createElement('script');
  let loaded = false;

  script.charset = 'UTF-8';
  script.async = true;
  script.onerror = () => cb(true);

  script.onload = script.onreadystatechange = function () {
    if (!loaded && (!script.readyState || script.readyState === 'loaded' || script.readyState === 'complete')
    ) {
      loaded = true;
      process.nextTick(() => cb(false));
    }
  };
  script.src = url;
  head.appendChild(script);
}

function normalizeDomain(domain) {
  return domain.replace(/^https?:\/\/|\/$/g, '');
}

function normalizePath(path) {
  const newPath = path.replace(/\/+/g, '/');
  if (newPath.indexOf('/') !== 0) {
    return `/${path}`;
  }
  return path;
}

function normalizeQuery(query) {
  if (!query) {
    return '';
  }

  let q = '?';

  Object.entries(query).forEach(([key, value]) => {
    if (['string', 'number', 'boolean'].includes(typeof value)) {
      q = `${q + encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
    }
  });

  if (q === '?') {
    q = '';
  }

  return q.replace(/&$/, '');
}

function makeURL(protocol, domain, path, query) {
  const newDomain = normalizeDomain(domain);
  const url = normalizePath(path) + normalizeQuery(query);
  if (newDomain) {
    return protocol + newDomain + url;
  }

  return url;
}

function load(protocol, domains, path, query, cb) {
  function tryRequest(at) {
    const url = makeURL(protocol, domains[at], path, query);
    loadScript(url, (err) => {
      if (err) {
        if (at >= domains.length - 1) {
          cb(true);
        } else {
          tryRequest(at + 1);
        }
      } else {
        cb(false);
      }
    });
  }
  tryRequest(0);
}

function jsonp(domains, path, config, callback) {
  if (typeof config.getLib === 'object') {
    config._extend(config.getLib);
    callback(config);
    return;
  }
  if (config.offline) {
    callback(config._get_fallback_config());
    return;
  }
  const cb = `geetest_${parseInt(Math.random() * 10000) + new Date().valueOf()}`;
  window[cb] = function (data) {
    if (data.status === 'success') {
      callback(data.data);
    } else if (!data.status) {
      callback(data);
    } else {
      callback(config._get_fallback_config());
    }
    window[cb] = undefined;
    try {
      delete window[cb];
    } catch (e) {}
  };
  load(
    config.protocol,
    domains,
    path,
    {
      gt: config.gt,
      callback: cb,
    },
    (err) => {
      if (err) {
        callback(config._get_fallback_config());
      }
    },
  );
}

function throwError(errorType, config) {
  const errors = {
    networkError: '网络错误',
  };
  if (typeof config.onError === 'function') {
    config.onError(errors[errorType]);
  } else {
    throw new Error(errors[errorType]);
  }
}

if (!!window.Geetest) {
  status.slide = 'loaded';
}

function initGeetest(userConfig, callback) {
  const config = new Config(userConfig);
  if (userConfig.https) {
    config.protocol = 'https://';
  } else if (!userConfig.protocol) {
    config.protocol = `${window.location.protocol}//`;
  }
  jsonp(
    [config.api_server || config.apiserver],
    config.type_path,
    config,
    (newConfig) => {
      const { type } = newConfig;
      function init() {
        config._extend(newConfig);
        callback(new window.Geetest(config));
      }
      callbacks[type] = callbacks[type] || [];
      const s = status[type] || 'init';
      if (s === 'init') {
        status[type] = 'loading';
        callbacks[type].push(init);
        load(
          config.protocol,
          newConfig.static_servers || newConfig.domains,
          newConfig[type] || newConfig.path,
          null,
          (err) => {
            if (err) {
              status[type] = 'fail';
              throwError('networkError', config);
            } else {
              status[type] = 'loaded';
              const cbs = callbacks[type];
              for (let i = 0, len = cbs.length; i < len; i += 1) {
                const cb = cbs[i];
                if (cb.constructor === Function) {
                  cb();
                }
              }
              callbacks[type] = [];
            }
          },
        );
      } else if (s === 'loaded') {
        init();
      } else if (s === 'fail') {
        throwError('networkError', config);
      } else if (s === 'loading') {
        callbacks[type].push(init);
      }
    },
  );
}

export default initGeetest;
