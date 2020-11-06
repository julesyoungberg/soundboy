import load from 'audio-loader';

const SAMPLE_RATE = 22050;

export function toMono(buffer: AudioBuffer) {
    if (buffer.numberOfChannels === 1) {
        return buffer.getChannelData(0);
    }

    if (buffer.numberOfChannels === 2) {
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        return left.map((v, i) => (v + right[i]) / 2);
    }

    throw new Error('unexpected number of channels');
}

export function downsampleBuffer(sourceBuffer: AudioBuffer): Promise<Float32Array> {
    const ctx = new OfflineAudioContext(1, sourceBuffer.duration * 1 * SAMPLE_RATE, SAMPLE_RATE);
    const buffer = ctx.createBuffer(1, sourceBuffer.length, sourceBuffer.sampleRate);

    buffer.copyFromChannel(toMono(sourceBuffer), 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    return new Promise((resolve) => {
        ctx.oncomplete = (e) => {
            const rendered = e.renderedBuffer;
            const samples = rendered.getChannelData(0);
            resolve(samples);
        };

        ctx.startRendering();
        source.start(0);
    });
}

export default async function loadSoundFile(filename: string, downsample?: boolean): Promise<Float32Array> {
    let buffer: AudioBuffer | undefined;
    try {
        buffer = await load(filename);
    } catch (e) {
        throw new Error(`Error loading '${filename}': ${e}`);
    }

    if (!downsample) {
        return toMono(buffer);
    }

    let samples: Float32Array | undefined;
    try {
        samples = await downsampleBuffer(buffer);
    } catch (e) {
        throw new Error(`Error downsampling '${filename}' to mono: ${e}`);
    }

    return samples;
}
