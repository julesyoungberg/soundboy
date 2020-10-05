// import load from 'audio-loader';
// import Meyda from 'meyda';
// import * as tf from '@tensorflow/tfjs-node';
import { expose } from 'threads/worker';

/**
 * Main worker function for analyzing a sound file
 * @param filename 
 * @returns sound analysis data
 */
async function analyze(filename: string): Promise<Sound> {
    console.log('Analyze Worker - filename: ', filename);
    const result: Sound = { filename };
    // const buffer: AudioBuffer = await load(filename);
    // const opt: Meyda.MeydaAnalyzerOptions = {
    //     "audioContext": audioContext,
    //     "source": source,
    //     "bufferSize": 512,
    //     "featureExtractors": ["rms"],
    //     "inputs": 2,
    //     "numberOfMFCCCoefficients": 20
    //     "callback": features => {
    //         levelRangeElement.value = features.rms;
    //     }
    // };
    // const meyda = Meyda.createMeydaAnalyzer(opt);
    // load, classify, extract perceptual features
    return result;
}

const analyzer = { analyze };

export type Analyzer = typeof analyzer;

expose(analyzer);
