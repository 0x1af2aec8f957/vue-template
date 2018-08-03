/* type PostcssConfig = {
    parser?: false | string;
    plugins: any;
} | ((config: object) => PostcssConfig)

const config: PostcssConfig = {
    "plugins": {
        "postcss-import": {},
        "postcss-url": {},
        // to edit target browsers: use "browserslist" field in package.json
        "autoprefixer": {}
    }
}

module.exports = config */

module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-url': {},
        // to edit target browsers: use "browserslist" field in package.json
        autoprefixer: {}
    }
};
