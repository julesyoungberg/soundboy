import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import WaveSurfer from 'wavesurfer.js';
import { FaPlay, FaPause } from 'react-icons/fa';
import { Text } from 'rebass';
import useTheme from '../hooks/useTheme';
import type { Theme } from '../theme';

const PlayButton = styled.button`
    background: none;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 60px;
    border: none;
    outline: none;
    cursor: pointer;
    padding-bottom: 3px;
    color: ${(props: Theme) => props.theme.colors.white};
`;

const WaveContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 70px;
    width: 100%;
`;

const Wave = styled.div`
    flex-grow: 1;
    * {
        overflow-x: hidden !important;
    }
`;

const AudioPlayer = ({ src, name }: { src: string; name?: string }) => {
    if (typeof window === 'undefined') return null;
    const spectrum = useRef<HTMLDivElement>();
    const wave = useRef<any>();
    const [playing, setPlaying] = useState<boolean>(false);
    const theme = useTheme();
    useEffect(() => {
        const audio = WaveSurfer.create({
            barWidth: 3,
            cursorWidth: 1,
            container: spectrum.current,
            backend: 'WebAudio',
            height: 70,
            progressColor: theme.colors.accent,
            responsive: true,
            waveColor: theme.colors.white,
            cursorColor: 'transparent',
        });
        audio.load(src);
        wave.current = audio;
        audio.on('play', () => setPlaying(true));
        audio.on('pause', () => setPlaying(false));
        return () => {
            audio.stop();
        };
    }, [spectrum]);
    const togglePause = (): void => {
        wave.current.playPause();
    };
    return (
        <WaveContainer>
            <PlayButton onClick={togglePause}>{playing ? <FaPause /> : <FaPlay />}</PlayButton>
            <Wave ref={spectrum} />
            {!!name && (
                <Text mx={1} my={2} color='white' fontStyle='italic' fontSize={[1, 2]}>
                    {name}
                </Text>
            )}
        </WaveContainer>
    );
};

export default AudioPlayer;
