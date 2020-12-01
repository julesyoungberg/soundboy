import TSNE from 'tsne-js';

const ctx: Worker = self as any;

ctx.onmessage = function (event) {
    const features = event.data.features;
    const model = new TSNE({
        dim: 3,
        perplexity: 5.0,
        earlyExaggeration: 4.0,
        learningRate: 100.0,
        nIter: 200,
        metric: 'euclidean',
    });
    model.init({ data: features, type: 'dense' });
    const [err] = model.run();
    const output = model.getOutputScaled();
    postMessage({ err, output });
};
