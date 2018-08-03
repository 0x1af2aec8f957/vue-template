import api from '../api/apiModule_1';
import copyToClipboard from '../utils/copyToClipboard';

function addEventListener(el, type, method, useCapture = false) {
  if ('addEventListener' in Element.prototype) { // 所有主流浏览器，除了 IE 8 及更早 IE版本
    el.addEventListener(type, method, useCapture);
  } else if ('attachEvent' in Element.prototype) { // IE 8 及更早 IE 版本
    el.attachEvent(`on${type}`, method, useCapture);
  }
}

function removeEventListener(el, type, method, useCapture = false) {
  if ('removeEventListener' in Element.prototype) { // 所有浏览器，除了 IE 8 及更早IE版本
    el.removeEventListener(type, method, useCapture);
  } else if ('detachEvent' in Element.prototype) { // IE 8 及更早IE版本
    el.detachEvent(`on${type}`, method, useCapture);
  }
}

export const scrollMixin = {
  mounted() {
    if (this.$options.scrollEl) {
      return addEventListener(document.getElementById(this.$options.scrollEl), 'scroll', this.scrollToView);
    }
    return new Error('缺少自定义的选项“scrollEl”，这是你监听的滚动容器[DOM-ID]，不应该是window');
  },
  methods: {
    scrollToView(event) {
      event.stopPropagation(); // 阻止下一步执行
      if (!this.handleScroll) return new Error('需要在methods选项中提供“handleScroll”方法，在滚动过程中会自动调用该方法');
      /* eslint no-nested-ternary: 0 */
      const { scrollHeight, scrollTop, clientHeight } = event.target;
      const status = scrollTop === 0 ? 'start' : scrollHeight - scrollTop <= clientHeight ? 'end' : 'ing';
      process.nextTick(this.handleScroll.bind(this, status));
      return false;
    },
  },
  beforeDestroy() {
    if (this.$options.scrollEl) {
      removeEventListener(document.getElementById(this.$options.scrollEl), 'scroll', this.scrollToView);
    }
  },
};

export const visibilityMixin = {
  data() {
    return { visibilityStatus: true };
  },
  mounted() {
    const visibilityEl = this.$options.visibilityEl || document;
    return addEventListener(visibilityEl, 'visibilitychange', this.handleVisibilityChange);
  },
  methods: {
    handleVisibilityChange(event) {
      this.$data.visibilityStatus = event.target.visibilityState === 'visible';
    },
  },
  beforeDestroy() {
    const visibilityEl = this.$options.visibilityEl || document;
    removeEventListener(visibilityEl, 'visibilitychange', this.handleVisibilityChange);
  },
};

export const networkMixin = {
  data() {
    return { networkStatus: true };
  },
  created() {
    window.addEventListener('offline', this.handleNetworkChange, false);
    window.addEventListener('online', this.handleNetworkChange, false);
  },
  methods: {
    handleNetworkChange() {
      this.$data.networkStatus = window.navigator.onLine;
    },
  },
  beforeDestroy() {
    window.removeEventListener('offline', this.handleNetworkChange, false);
    window.removeEventListener('online', this.handleNetworkChange, false);
  },
};

export const uploadFileMixin = {
  data() {
    return { objectURLs: {} };
  },
  methods: {
    handleUpdateFile({ file }) {
      const formData = new FormData();
      formData.append('file', file);
      return api.uploadFile(formData).then((fileId) => {
        this.readAsDataURL(fileId, file);
        return fileId;
      });
    },
    // handleUploadSuccess(response, file, fileList) {},
    handleUploadBefore(file) {
      const fileSize = file.size / 1024 / 1024; // M-兆
      if (fileSize > 5) {
        this.$toast({
          type: 'warning',
          message: '上传文件大小不能超过 5MB',
        });
        return false;
      }
      return true;
    },
    readAsDataURL(fileId, file) {
      const fileReader = new FileReader(); // 创建FileReader对像;
      fileReader.onload = (event) => { this.objectURLs[fileId] = event.target.result; this.$forceUpdate(); };
      fileReader.readAsDataURL(file);
    },
  },
};

export const windowResizeMixin = {
  created() {
    window.addEventListener('resize', this.onResize, false);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize, false);
  },
  methods: {
    onResize(event) {
      event.stopPropagation(); // 阻止下一步执行
      if (!this.handleWReizeChange) return new Error('需要在methods选项中提供“handleScroll”方法，在滚动过程中会自动调用该方法');
      return this.handleWReizeChange({ width: window.innerWidth, height: window.innerHeight });
    },
  },
};

export default { // 全局
  data() {
    return {};
  },
  methods: {
    handleCopyText(text) {
      try {
        copyToClipboard(text);
        this.$toast({ type: 'success', message: '复制成功' });
      } catch (e) {
        this.$toast({ type: 'error', message: '复制失败' });
      }
    },
  },
};
