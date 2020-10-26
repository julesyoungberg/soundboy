import dynamic from 'next/dynamic';

const AudioPlayer =
    typeof window !== 'undefined' ? dynamic(() => import('./audio-player-base'), { ssr: false }) : () => null;

export default AudioPlayer;
