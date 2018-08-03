import { Joi } from '../../utils/common';

export default {
  id: Joi.number().min(0).max(100).error(new Error('sr,ID不正确'), { self: true }),
};
