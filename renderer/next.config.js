const withWorkers = require('@zeit/next-workers');

module.exports = withWorkers({
    workerLoaderOptions: {
        inline: true,
        filename: 'static/[hash].worker.js',
        publicPath: '/_next/',
    },

    webpack(config) {
        config.target = 'electron-renderer';
        // config.output.globalObject = `(() => {
        //     if (typeof self !== 'undefined') {
        //         return self;
        //     } else if (typeof window !== 'undefined') {
        //         return window;
        //     } else if (typeof global !== 'undefined') {
        //         return global;
        //     } else {
        //         return Function('return this')();
        //     }
        // })()`;
        return config;
    },
});
