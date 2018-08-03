export const PagingDefaultConf = {
  pageIndex: 1,
  pageSize: 15,
};

export const Regex = {
  // PHONE: /^1[3-9]{1}\d{9}$/,
  PHONE: /^\d{5,20}$/, // 国际
  EMAIL: /^[\S]+@[\w|\d]+\.[\w|\d]+$/,
  ACCOUNT: /(^\d{5,20}$)|(^[\S]+@[\w|\d]+\.[\w|\d]+$)/,
  QR_CODE_FIX: /^commission:\/\//,
  PASSWORD: /^[A-Za-z0-9]{8,20}$/,
  CODE: /^\d{6}$/,
  SECURITY_PWD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
  ID_CARD: /^[\uFF08-\uFF09()A-Za-z0-9]{1,18}$/,
  IS_DECIMAL: /^\d+\.\d+$/, // 是否是小数
};

export const TITLE = window.document.title;

// tradingView config start ------
export const DARK_STUDIES_OVERRIDES = {
  'volume.precision': 2,
  'Williams %R.hlines background.visible': false,
  'stochastic.hlines background.visible': false,
  'Relative Strength Index.hlines background.visible': false,
  'volume.volume.color.1': '#00ce7d', // 绿
  'volume.volume.color.0': '#e55541', // 红
  'stochastic.%D.color': '#FF5B7D',
  'stochastic.%K.color': '#4D81F3',
  'Relative Strength Index.Plot.color': '#E04DF3',
  'Williams %R.Plot.color': '#5E4DF3',
  'Moving Average.Plot.color': '#4D81F3',
  'Bollinger Bands.Median.color': '#FF5B7D',
  'Bollinger Bands.Upper.color': '#4D81F3',
  'Bollinger Bands.Lower.color': '#4D81F3',
  'MACD.Histogram.color': '#FF5B7D',
  'MACD.MACD.color': '#4D81F3',
  'MACD.Signal.color': '#FF5B7D',
};
export const DARK_OVER_RIDES = {
  'paneProperties.topMargin': 10,
  'paneProperties.bottomMargin': 10,
  'paneProperties.legendProperties.showLegend': false,
  'mainSeriesProperties.showPriceLine': false,
  'scalesProperties.lineColor': '#666666',
  'scalesProperties.textColor': '#e6e6e6',
  'paneProperties.background': '#151a3a',
  'paneProperties.crossHairProperties.color': '#666666',
  'mainSeriesProperties.barStyle.upColor': '#00CE7D', // 蜡烛图颜色-绿
  'mainSeriesProperties.barStyle.downColor': '#E55541', // 蜡烛图颜色-红
  'mainSeriesProperties.candleStyle.wickUpColor': '#00CE7D',
  'mainSeriesProperties.candleStyle.wickDownColor': '#E55541',
  'paneProperties.vertGridProperties.color': 'rgba(107,111,158, 0.3)',
  'paneProperties.horzGridProperties.color': 'rgba(107,111,158, 0.3)',
};
export const DISABLE_FEATURES = [
  'left_toolbar',
  'padding',
  'header_settings',
  'header_indicators',
  'header_symbol_search',
  'compare_symbol',
  'display_market_status',
  'go_to_date',
  'header_saveload',
  'header_chart_type',
  'header_compare',
  'header_interval_dialog_button',
  'header_resolutions',
  'header_screenshot',
  'header_symbol_search',
  'header_undo_redo',
  'legend_context_menu',
  'show_hide_button_in_legend',
  'show_interval_dialog_on_key_press',
  'snapshot_trading_drawings',
  'symbol_info',
  'timeframes_toolbar',
  'use_localstorage_for_settings',
  'volume_force_overlay',
  'adptive_logo',
];
export const ENABLED_FEATURES = [
  'dont_show_boolean_study_arguments',
  'hide_last_na_study_output',
  'move_logo_to_main_pane',
  'same_data_requery',
  'side_toolbar_in_fullscreen_mode',
];

// tradingView config end ------
