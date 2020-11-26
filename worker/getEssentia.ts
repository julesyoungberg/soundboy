// eslint-disable-next-line
import Essentia from 'essentia.js/dist/core_api';

let essentia: Essentia | undefined;

export default async function getEssentia(): Promise<Essentia> {
    if (essentia) {
        return essentia;
    }

    const essentiaWASM = await (window as any).EssentiaWASM();
    essentia = new (window as any).Essentia(essentiaWASM);
    return essentia;
}
