// Typescript version of audio-decode
import getType from 'audio-type';
import WavDecoder from 'wav-decoder';
import createBuffer from 'audio-buffer-from';
import toArrayBuffer from 'to-array-buffer';
import toBuffer from 'typedarray-to-buffer';
import isBuffer from 'is-buffer';
// import AV from 'av/node';
// require('mp3');

export default async function decode(buf: ArrayBufferLike) {
    let buffer = buf;

    if (!isBuffer(buffer)) {
        if (ArrayBuffer.isView(buffer)) {
            buffer = toBuffer(buffer);
        } else {
            buffer = Buffer.from(toArrayBuffer(buffer));
        }
    }

    let type = getType(buffer);
    if (!type) {
        throw new Error('Cannot detect audio format of buffer');
    }

    // direct wav decoder
    if (type === 'wav') {
        const audioData = await WavDecoder.decode(buffer);
        const audioBuffer = createBuffer(audioData.channelData, {
            channels: audioData.numberOfChannels,
            sampleRate: audioData.sampleRate,
        });
        return audioBuffer;
    }

    // handle other codecs by AV
    // return new Promise((resolve, reject) => {
    //     const asset = AV.Asset.fromBuffer(buffer);
    //     asset.on('error', (err: Error) => reject(err));
    //     asset.decodeToBuffer((buffer) => {
    //         const data = createBuffer(buffer, {
    //             channels: asset.format.channelsPerFrame,
    //             sampleRate: asset.format.sampleRate,
    //         });
    //         resolve(data);
    //     });
    // });
    throw new Error('unsuported format');
}
