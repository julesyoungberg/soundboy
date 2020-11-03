import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/src/plugin/spectrogram';
import { Text } from 'rebass';
import useTheme from '../../hooks/useTheme';
import type { Theme } from '../../theme';
import useAppState from '../../hooks/useAppState';
import getFileName from '../../../util/getFileName';
import PauseButton from './pause-button';
import colormap from 'colormap';

import { Sound } from '../../../@types';

const Wave = styled.div`
    flex-grow: 1;
    * {
        overflow-x: hidden !important;
    }
`;

const withWave = (Component) => {
    return ({ sound, options, ...rest }: { sound: Sound; options?: any; rest?: any; [propName: string]: {} }) => {
        if (typeof window === 'undefined') return null;
        const { onPlay, onPause, onStop, showSpectrum, ...internalOptions } = options;
        const spectrum = useRef<HTMLDivElement>();
        const wave = useRef<WaveSurfer>();
        const [playing, setPlaying] = useState<boolean>(false);
        const spectrumContent = () =>
            showSpectrum
                ? {
                      plugins: [
                          SpectrogramPlugin.create({
                              wavesurfer: WaveSurfer,
                              container: spectrum.current,
                              labels: true,
                              colorMap: colormap({
                                  colormap: 'hot',
                                  nshades: 256,
                                  format: 'float',
                              }),
                          }),
                      ],
                  }
                : {};
        useEffect(() => {
            const audio = WaveSurfer.create({
                barWidth: 3,
                cursorWidth: 1,
                container: spectrum.current,
                backend: 'MediaElement',
                height: 70,
                progressColor: '#fff',
                responsive: true,
                waveColor: '#fff',
                barRadius: 3,
                barGap: 0,
                cursorColor: 'transparent',
                ...internalOptions,
                ...spectrumContent(),
            });
            audio.load(`audio://${sound.filename}`);
            wave.current = audio;
            audio.on('play', () => {
                if (onPlay) onPlay({ audio, sound });
                setPlaying(true);
            });
            audio.on('pause', () => {
                if (onPause) onPause({ audio, sound });
                setPlaying(false);
            });
            return () => {
                audio.stop();
                if (onStop) onStop({ audio, sound });
                audio.destroy();
            };
        }, [spectrum, sound.filename]);
        const togglePause = (): void => {
            wave.current.playPause();
        };
        return (
            <>
                <Component {...rest} sound={sound} togglePause={togglePause} playing={playing} />
                <Wave ref={spectrum} />
            </>
        );
    };
};

export default withWave;
