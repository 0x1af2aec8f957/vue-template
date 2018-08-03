// tradingview
import { widget as Widget } from 'tradingview';
import http from 'axios';
import {
  DARK_STUDIES_OVERRIDES, DARK_OVER_RIDES, DISABLE_FEATURES, ENABLED_FEATURES,
} from './constant';
import api from '../api/apiModule_1';
import socket from '../plugins/mqttService';
import { route } from '../setup/router-setup';

const { CancelToken } = http;
let httpSource;
let transactionKlineId = null;

function fetchQuotationHistory(range, endTime = new Date().getTime()) {
  const { tradePairs } = route.params;
  const startTime = endTime - (range * 120);
  return tradePairs ? api.quotationHistory({
    symbol: tradePairs,
    startTime,
    endTime,
    range,
  }, httpSource?.token) : Promise.reject(new Error('symbol获取错误'));
}

class DataFeedContainer { // datafeed
  constructor(range) {
    this.topicRange = range;
  }

  configuration = {};

  lastTime = new Date().getTime(); // 历史交易最后的时间

  priceMax = null;

  kChartSubscriberList = [];

  realtimeCallback;

  resetCacheNeededCallback;

  get priceScale() { // 价格精度
    const { priceMax: max } = this;
    return typeof max === 'number' ? 10 ** String(max).split('.')[1]?.length : 100000;
  }

  async fetchChartData() {
    transactionKlineId = `noteScript_transaction_kline_${tradePairs}_${this.topicRange}`;
      socket.instance.subscribe(transactionKlineId)((order) => {
        this.realtimeCallback({
          close: Number(order.close),
          open: Number(order.open),
          high: Number(order.high),
          low: Number(order.low),
          volume: Number(order.amount),
          time: moment.unix(order.id).valueOf(),
        });
      });
  }

  onReady(callback) {
    const { configuration: configurationData } = this;
    if (configurationData) process.nextTick(() => callback(configurationData));
    // else this.on('configuration_ready', callback(this.configurationData));
  }

  /* searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) { // 提供一个匹配用户搜索的商品列表
  } */

  async resolveSymbol(
    symbolName,
    onSymbolResolvedCallback,
    // onResolveErrorCallback,
  ) { // 通过商品名称解析商品信息
    const { topicRange: ticker, priceScale: pricescale } = this;
    const { tradePairs } = route.query;
    const options = { // https://b.aitrade.ga/books/tradingview/book/Symbology.html#%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E7%BB%93%E6%9E%84
      name: tradePairs, // 商品名称
      ticker,
      timezone: 'Asia/Shanghai', // 交易时区
      pricescale: this.priceScale,
      minmov: 1,
      minmov2: 0,
      description: '', // 商品说明
      session: '24x7', // 交易时段
      type: 'stock', // 仪表类型
      has_intraday: true, // 布尔值显示商品是否具有日内（分钟）历史数据
      has_weekly_and_monthly: true, // 是否有周线和月线
      has_no_volume: false, // 是否将成交量独立出来
      has_daily: true, // 布尔值显示商品是否具有以日为单位的历史数据
      has_empty_bars: true, // 布尔值显示在交易过程中，当datafeed没有数据返回时,library是否会生成空的K柱
      has_seconds: true, // 布尔值显示商品是否具有以秒为单位的历史数据
      intraday_multipliers: ['1'], // 包含日内周期(分钟单位)的数组，datafeed将会自行构建它
      regular_session: '24x7',
      fullscreen: false,
      supported_resolutions: [
        '1',
        '5',
        '15',
        '30',
        '60',
        '240',
        '360',
        '720',
        '1440',
        '10080',
      ],
    };
    return process.nextTick(() => onSymbolResolvedCallback(options));
  }

  getBars(
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest,
  ) { // 通过日期范围获取历史K线数据。图表库希望通过onHistoryCallback仅一次调用，接收所有的请求历史。而不是被多次调用。
    if (!firstDataRequest) {
      const { topicRange } = this;

      return fetchQuotationHistory(topicRange, this.lastTime)
        .then(r => r.quotationHistory.map(order => ({
          close: Number(order.last),
          open: Number(order.first),
          high: Number(order.max),
          low: Number(order.min),
          volume: Number(order.quantity),
          time: order.time,
        })))
        .then((r) => {
          if (r.length > 1) {
            [
              this.lastTime,
              this.priceMax,
            ] = [r[0].time, r[0].high];
            onHistoryCallback(r, { noData: false });
          } else {
            onHistoryCallback([], { noData: true });
          }
        })
        .catch(() => {
          onHistoryCallback([], { noData: true });
        });
    }
    return onHistoryCallback([], { noData: false });
    // onHistoryCallback(bars, { noData: true , nextTime: data.nb || data.nextTime });
  }

  subscribeBars(
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback, // 在bars数据发生变化时执行
  ) { // 订阅K线数据。图表库将调用onRealtimeCallback方法以更新实时数据
    if (this.kChartSubscriberList.some(
      kChartSubscriber => kChartSubscriber.subscriberUID === subscriberUID,
    )) return;
    this.kChartSubscriberList.push({ // 记录订阅uid
      symbol: symbolInfo,
      resolution,
      subscriberUID,
      // callback: onRealtimeCallback,
    });
    [ // 依赖realtimeCallback回调方法进行同步图表数据
      this.realtimeCallback,
      this.resetCacheNeededCallback,
    ] = [
      onRealtimeCallback,
      onResetCacheNeededCallback,
    ];
  }

  unsubscribeBars(subscriberUID) { // 取消订阅K线数据
    const idx = this.kChartSubscriberList.findIndex(
      kChartSubscriber => kChartSubscriber.subscriberUID === subscriberUID,
    );
    if (idx < 0) return;
    this.kChartSubscriberList.splice(idx, 1); // 移除订阅uid
  }

  /* calculateHistoryDepth(
  resolution,
  resolutionBack,
  intervalBack
  ) { // 图表库在它要请求一些历史数据的时候会调用这个函数，让你能够覆盖所需的历史深度
  } */

  /* getMarks(
  symbolInfo,
  startDate,
  endDate,
  onDataCallback,
  resolution
  ) { // 图表库调用这个函数来获得可见的K线范围的标记。 图表预期每调用一次getMarks就会调用一次onDataCallback

  } */

  /* getTimescaleMarks(
  symbolInfo,
  startDate,
  endDate,
  onDataCallback,
  resolution
  ) { // 图表库调用此函数获取可见K线范围的时间刻度标记。图表预期您每个调用getTimescaleMarks会调用一次onDataCallback。

  } */

  // getServerTime(callback){}
}

export default class TvWidget {
  constructor({
    // eslint-disable-next-line camelcase
    range, id: container_id, height = 455, theme = 'Dark', width = '100%', timezone = 'Asia/Shanghai', locale = 'zh',
  }) {
    this.datafeed = new DataFeedContainer(range);
    const { tradePairs } = route.params;
    const options = {
      datafeed: this.datafeed,
      symbol: tradePairs,
      interval: '60',
      overrides: DARK_OVER_RIDES,
      disabled_features: DISABLE_FEATURES,
      enabled_features: ENABLED_FEATURES,
      studies_overrides: DARK_STUDIES_OVERRIDES,
      container_id,
      height,
      width,
      theme,
      library_path: '/tradeview/charting_library/',
      custom_css_url: './black.css',
      timezone,
      locale,
      debug: process.env.NODE_ENV !== 'production', // false,
      padding: 0,
    };

    this.chartInstance = new Widget(options);
    this.chartInstance.onChartReady(() => {
      const activeChart = this.chartInstance.activeChart
        ? this.chartInstance.activeChart()
        : this.chartInstance.chart();

      ['5', '15', '30', '60'].forEach((_range) => {
        activeChart.createStudy('Moving Average', false, false, [_range], null, {
          // 'Plot.color': ['#10B886', '#FA5152', '#CD8980', '#61D1C0'][index],
        });
      });

      activeChart.onIntervalChanged().subscribe(null, (/* interval, obj */) => {
        this.chartInstance.changingInterval = false;
      });

      [
        this.chartInstance.MAStudies,
        this.chartInstance.selectedIntervalButton,
        this.range,
      ] = [
        [],
        null,
        range,
      ];
    });
  }

  get range() { // eslint-disable-next-line no-underscore-dangle
    return this._range;
  }

  set range(value) {
    if (value === this.range) return; // 这里可以设置相同的值来达到不同商品的初始化

    if (httpSource) httpSource.cancel();
    if (transactionKlineId) socket.instance.unsubscribe(transactionKlineId);
    httpSource = CancelToken.source(); // 每次设置range，都将对后续请求分配一个token(共用)

    // eslint-disable-next-line no-underscore-dangle
    [this._range, this.datafeed.topicRange] = new Array(2).fill(value);

    fetchQuotationHistory(value)
      .then(({ quotationHistory }) => quotationHistory.map(order => ({
        close: Number(order.last),
        open: Number(order.first),
        high: Number(order.max),
        low: Number(order.min),
        volume: Number(order.quantity),
        time: order.time,
      })))
      .then((quotationHistory) => {
        [
          this.datafeed.lastTime,
          this.datafeed.priceMax,
        ] = [quotationHistory[0]?.time, quotationHistory[0]?.high];

        const activeChart = this.chartInstance.activeChart
          ? this.chartInstance.activeChart()
          : this.chartInstance.chart();
        const { tradePairs } = route.params;

        this.datafeed.resetCacheNeededCallback(); // 保持在resetData之前
        activeChart.resetData();

        const dataLength = quotationHistory.length;

        if (!dataLength) return;

        quotationHistory.forEach(order => this.datafeed.realtimeCallback(order));
        this.datafeed.fetchChartData();

        if (dataLength > 20) {
          process.nextTick(() => {
            activeChart.setVisibleRange({
              from: dataLength <= 30 ? quotationHistory[0].time : quotationHistory.slice(-30)[0].time / 1000,
              to: quotationHistory.slice(-1)[0].time / 1000,
            });
          });
        }

        this.chartInstance.setSymbol(tradePairs, String(value / 60000), () => {
          // console.log("intval -> ", item.intval);
        });

        this.chartInstance.changingInterval = true;
      });
  }

  get chartType() {
    // eslint-disable-next-line no-underscore-dangle
    return this._chartType;
  }

  set chartType(type) {
    // eslint-disable-next-line no-underscore-dangle
    this._chartType = type;
    const { chartInstance } = this;
    // 美国线 STYLE_BARS = 0;
    // K线图 STYLE_CANDLES = 1;
    // 线形图 STYLE_LINE = 2;
    // 面积图 STYLE_AREA = 3;
    // 平均K线图 STYLE_HEIKEN_ASHI = 8;
    // 空心K线图 STYLE_HOLLOW_CANDLES = 9;

    // 砖形图 STYLE_RENKO* = 4;
    // 卡吉图 STYLE_KAGI* = 5;
    // 点数图 STYLE_PNF* = 6;
    // 新价图 STYLE_PB* = 7;

    // eslint-disable-next-line no-underscore-dangle
    if (!chartInstance._ready) return;

    const activeChart = chartInstance.activeChart
      ? chartInstance.activeChart()
      : chartInstance.chart();

    activeChart.setChartType(type);
  }

  get resolution() {
    // eslint-disable-next-line no-underscore-dangle
    return this._resolution;
  }

  set resolution(value) {
    /* eslint-disable no-underscore-dangle */
    this._resolution = value;
    const { chartInstance } = this;
    if (!chartInstance._ready) return;

    const activeChart = chartInstance.activeChart
      ? chartInstance.activeChart()
      : chartInstance.chart();

    activeChart.setResolution(value);
  }

  openSettingDialog() { // 显示设置
    if (!this.chartInstance) return;

    const activeChart = this.chartInstance.activeChart
      ? this.chartInstance.activeChart()
      : this.chartInstance.chart();

    activeChart.executeActionById('chartProperties');
  }

  openInsertIndicator() { // 显示指标
    if (!this.chartInstance) return;
    const activeChart = this.chartInstance.activeChart
      ? this.chartInstance.activeChart()
      : this.chartInstance.chart();

    activeChart.executeActionById('insertIndicator');
  }

  get close() {
    return this.chartInstance.remove();
  }
}
