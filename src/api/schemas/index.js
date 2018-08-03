const schemaModule = require.context('./', false, /^(?!index).+\.js$/);
const schemas = schemaModule.keys()
  .reduce((acc, key) => {
    const attr = key.replace(/(\.\/|\.js)/g, '');
    const values = schemaModule(key).default;
    if (values) {
      Object.setPrototypeOf(values, {
        exclude(keys) { // 排除
          const newSchemas = { ...schemaModule(key).default };
          switch (keys.constructor) {
            case Array:
              return Object.keys(newSchemas)
                .filter(schemaKey => !keys.includes(schemaKey))
                .reduce((accumulator, currentKey) => ({
                  ...accumulator,
                  [currentKey]: newSchemas[currentKey],
                }), {});
            case String:
              delete newSchemas[keys];
              return newSchemas;
            default:
              return newSchemas;
          }
        },
        include(object) { // 包含进来
          const newSchemas = { ...schemaModule(key).default };
          return Object.assign({}, newSchemas, object);
        },
      });

      return {
        ...acc,
        [attr]: values,
      };
    }

    return acc;
  }, {});


export default schemas;
