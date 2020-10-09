const withWorkers = require('@zeit/next-workers');

module.exports = withWorkers({
    workerLoaderOptions: {
        inline: true,
        filename: 'static/[hash].worker.js',
        publicPath: '/_next/',
    },

    webpack(config) {
        config.target = 'electron-renderer';
        config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;
        return config;
    },
});
