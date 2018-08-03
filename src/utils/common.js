// import process from 'process';
import event from './eventEmitter';

export { default as http } from 'axios';
export { default as cookies } from 'cookies-js'; // https://github.com/ScottHamper/Cookies
export { default as md5 } from 'md5';
export { default as moment } from 'moment';
export { default as QRCode } from 'qrcode'; // https://github.com/davidshimjs/qrcodejs#readme
export { default as Joi } from 'joi-browser'; // https://github.com/hapijs/joi
export {
  mapState, mapGetters, mapMutations, mapActions,
} from 'vuex';

export const alert = rest => event.emit('alert', rest);
export const toast = rest => event.emit('toast', rest);
export const confirm = rest => event.emit('confirm', rest);
