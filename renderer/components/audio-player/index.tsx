import dynamic from 'next/dynamic';

export const AudioPlayer =
    typeof window !== 'undefined' ? dynamic(() => import('./audio-player'), { ssr: false }) : () => null;

export const MainAudioPlayer =
    typeof window !== 'undefined' ? dynamic(() => import('./main-audio-player'), { ssr: false }) : () => null;
