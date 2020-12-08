import load from 'audio-loader';

/**
 * converts a stereo audio buffer to mono or returns the mono buffer
 * @param buffer
 */
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

/**
 * Downsamples an audio buffer to the target sample rate using an offline context
 * @param sourceBuffer
 */
export function downsampleBuffer(sourceBuffer: AudioBuffer, targetRate: number): Promise<Float32Array> {
    const ctx = new OfflineAudioContext(1, sourceBuffer.duration * targetRate, targetRate);

    // create mono input buffer
    const buffer = ctx.createBuffer(1, sourceBuffer.length, sourceBuffer.sampleRate);
    buffer.copyToChannel(toMono(sourceBuffer), 0);

    // connect the buffer to the context
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    // resolve when the source buffer has been rendered to a downsampled buffer
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

/**
 * loads a soundfile and returns the downsampled buffer
 * @param filename
 * @param downsample
 */
export default async function loadSoundFile(filename: string, sampleRate?: number): Promise<Float32Array> {
    let buffer: AudioBuffer | undefined;
    try {
        buffer = await load(`audio://${filename}`);
    } catch (e) {
        throw new Error(`Error loading '${filename}': ${e}`);
    }

    if (!sampleRate) {
        return toMono(buffer);
    }

    let samples: Float32Array | undefined;
    try {
        samples = await downsampleBuffer(buffer, sampleRate);
    } catch (e) {
        throw new Error(`Error downsampling '${filename}' to mono: ${e}`);
    }

    return samples;
}
