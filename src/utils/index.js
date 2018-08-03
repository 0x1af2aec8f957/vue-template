import crypto from 'crypto';
// util.js
/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find(list, f) {
  return list.filter(f)[0];
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy(obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, c => c.original === obj);
  if (hit) {
    return hit.copy;
  }

  const copy = Array.isArray(obj) ? [] : {};
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy,
  });

  Object.keys(obj).forEach((key) => {
    copy[key] = deepCopy(obj[key], cache);
  });

  return copy;
}

/**
 * forEach for object
 */
export function forEachValue(obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key));
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

export function isPromise(val) {
  return val && typeof val.then === 'function';
}

export function assert(condition, msg) {
  if (!condition) throw new Error(`[vuex] ${msg}`);
}

export function randomString(len = 32) { // 随机字符串32
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = $chars.length;
  /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*** */
  let pwd = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < len; i++) pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  return pwd;
}

export function urlEncode(clearString) { // url编码
  const regex = /(^[a-zA-Z0-9-_.]*)/;
  const newClearString = String(clearString);
  let output = '';
  let x = 0;
  while (x < newClearString.length) {
    const match = regex.exec(newClearString.substr(x));
    if (match !== null && match.length > 1 && !!match[1].length) {
      output += match[1]; x += match[1].length;
    } else {
      if (!newClearString.substr(x, 1).length) output += '+'; // ie不支持把字符串当作数组来访问
      else {
        const charCode = newClearString.charCodeAt(x);
        const hexVal = charCode.toString(16);
        output += `%${hexVal.length < 2 ? '0' : ''}${hexVal.toUpperCase()}`;
      }
      x += 1;
    }
  }
  return output;
}

export function typeOf(obj) { // 精准判断数据类型
  return {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
    '[object Document]': 'document',
    '[object HTMLDivElement]': 'div',
    '[object HTMLBodyElement]': 'body',
    '[object HTMLDocument]': 'document',
    '[object HTMLHtmlElement]': 'html',
    '[object Blob]': 'blob',
    '[object FormData]': 'formData',
  }[Object.prototype.toString.call(obj)];
}

export function toCapital(n) { // 将数字转为大写
  const cnum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  let s = '';
  Object.values(String(n)).forEach((item) => {
    // eslint-disable-next-line radix
    s += cnum[parseInt(n.charAt(item), 10)];
  });
  if (s.length === 2) { /* 两位数的时候 */
    if (s.charAt(1) === cnum[0]) { // 如果个位数是0的时候，令改成十
      s = s.charAt(0) + cnum[10];
      // 如果是一十改成十
      if (s === (cnum[1] + cnum[10])) {
        // eslint-disable-next-line prefer-destructuring
        s = cnum[10];
      }
    } else if (s.charAt(0) === cnum[1]) s = cnum[10] + s.charAt(1);
  } // 如果十位数是一的话改成十
  return s;
}
