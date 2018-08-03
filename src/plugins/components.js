import { library, config } from '@fortawesome/fontawesome-svg-core';
import {
  faEye,
  faEyeSlash,
  faTimesCircle,
  faChevronLeft,
  faStar,
  faSearch,
  faChevronDown,
  faBook,
  faLongArrowAltUp,
  faLongArrowAltDown,
  faSignal,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'; // https://fontawesome.com/how-to-use/on-the-web/using-with/vuejs

config.autoAddCss = true;

library.add(faEye, faEyeSlash, faTimesCircle, faChevronLeft, faStar, faSearch, faChevronDown, faBook, faLongArrowAltUp, faLongArrowAltDown, faSignal);

const templateModule = require.context('../components', false, /^(?!index).+\.vue$/);

export const components = templateModule.keys().reduce((acc, key) => { // custom component
  const component = templateModule(key).default;

  return component ? {
    ...acc,
    [component.name.replace(/^\w/, w => w.toUpperCase())]: component,
  } : acc;
}, {});

const templates = { // global component
  Icon: FontAwesomeIcon,
};

export default {
  install: Vue => Object.entries(templates)
    .forEach(([name, component]) => Vue.component(name, component)),
};
