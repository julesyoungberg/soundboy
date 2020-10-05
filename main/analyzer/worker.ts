// import meyda from 'meyda';
// import * as tf from '@tensorflow/tfjs-node';
import { expose } from 'threads/worker';

function analyze(filename: string): Record<string, any> {
    console.log('Analyze Worker - filename: ', filename);
    const result = { filename };
    // for each soundfile in folder
    // load, classify, extract perceptual features
    return result;
}

const analyzer = { analyze };

export type Analyzer = typeof analyzer;

expose(analyzer);
