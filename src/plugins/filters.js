// time stamp
import { moment } from '../utils/common';

const filters = {
  timeStampToDate(timeStamp, reg = 'YYYY.MM.DD HH:mm:ss') { // 时间戳转时间
    if (!timeStamp) return '...';
    return moment(timeStamp).format(reg);
  },
  timeDuration(start, end, key) { // 时间周期，支持单独获取一个key的时间周期
    const momentDiff = moment(start).diff(moment(end), key, true);
    const timeDuration = moment.duration(momentDiff);
    return key ? momentDiff : {
      years: timeDuration.get('years'),
      months: timeDuration.get('months'),
      weeks: timeDuration.get('weeks'),
      days: timeDuration.get('days'),
      hours: timeDuration.get('hours'),
      minutes: timeDuration.get('minutes'),
      seconds: timeDuration.get('seconds'),
      milliseconds: timeDuration.get('milliseconds'),
    };
  },
  attrSort(array, attr, rev = 1) { // 数组排序，支持对象key键值排序
  /* eslint no-nested-ternary: 0 */
    return array.sort((a, b) => {
      const [old, cur] = [
        a.constructor === Object ? a[attr] : a,
        b.constructor === Object ? b[attr] : b,
      ];
      return (old - cur) * rev;
    });
  },
  toFixed(amount = 0, fix = 5) { // 保留小数
    // return Number(String(amount).match(new RegExp(`^\\d+(?:\\.\\d{0,${fix}})?`)) || 0);
    return Number(amount).toFixed(fix + 1).slice(0, -1);
  },
  strIntercept(str, length = 3) { // 过滤中间信息，不予展示
    const newStr = String(str);
    const prefix = newStr.match(new RegExp(`^[\\s\\S]{${length}}`));
    const suffix = newStr.match(new RegExp(`[\\s\\S]{${length}}$`));
    return `${prefix}****${suffix}`;
  },
  flowsGroup(flows, attr, key = 'day') { // 数据分组处理
    return this.attrSort(flows, attr, -1).reduce((acc, cur) => {
      const lastFlows = acc.slice(-1).flat();
      const lastFlow = lastFlows.slice(-1)[0] || {};
      /* [isoWeek[1-7],week[7-6]] */
      const condition = moment(lastFlow[attr]).isSame(cur[attr], key); // 按照时间进行分组
      if (condition) {
        acc.splice(-1, 1, lastFlows.concat(cur));
        return acc;
      }
      return [...acc, [cur]];
    }, []);
  },
};

const install = Vue => Object.entries(filters).forEach(([key, func]) => Vue.filter(key, func));

// !!window && window.Vue && install(window.Vue) // auto install

export default {
  filters,
  install,
};
