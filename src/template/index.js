// README:自定义组件目录[VUE]
import BackTop from './BackTop'
import Carousel from './Carousel'
import Checkbox from './Checkbox'
import Collapse from './Collapse'
import Color from './Color'
import Drag from './Drag'
import Countdown from './Countdown'
import HelloWorld from './HelloWorld'
import Input from './Input'
import Page from './Page'
import Poptip from './Poptip'
import Progress from './Progress'
import Radio from './Radio'
import Rate from './Rate'
import Select from './Select'
import Slider from './Slider'
import Spinner from './Spinner'
import Switch from './Switch'
import Timeline from './Timeline'
import Timer from './Timer'
import Video from './Video'

import Notify from './Notify'
import {
  alert
} from './Alert'

Notify.config('.notify-message', 2000)
/* ELEMENT */

const UX = {
    BackTop,
    Carousel,
    Checkbox,
    Collapse,
    Color,
    Drag,
    Countdown,
    HelloWorld,
    Input,
    Page,
    Poptip,
    Progress,
    Radio,
    Rate,
    Select,
    Slider,
    Spinner,
    Switch,
    Timeline,
    Timer,
    Video,
  },
  install = Vue => { // vue plugin method
    for (let [key, value] of Object.entries(UX)) Vue.component(key, value)
    return Object.assign(Vue.prototype, {
      $notify: Notify.notify,
      $alert: alert
    })
  }

!!window && window.Vue && install(window.Vue) // auto install

export default {...UX, install} // eslint-disable-line no-undef
