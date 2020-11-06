import React from 'react';
import styled from '@emotion/styled';
import { Text } from 'rebass';
import useTheme from '../../hooks/useTheme';
import useAppState from '../../hooks/useAppState';
import getFileName from '../../../util/getFileName';
import PauseButton from './pause-button';
import withWave from './wave-surfer';

import { Sound } from '../../../@types';

const WaveContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 70px;
    width: 100%;
`;

const WaveForm = withWave(
    ({ waveColor, togglePause, playing }: { waveColor?: string; togglePause: () => void; playing: boolean }) => {
        return <PauseButton color={waveColor} onClick={togglePause} playing={playing} />;
    }
);

const AudioPlayer = ({
    sound,
    waveColor: initialWaveColor,
    progressColor: initialProgressColor,
}: {
    sound: Sound;
    waveColor?: string;
    progressColor?: string;
}) => {
    const { dispatch } = useAppState();
    const theme = useTheme();
    const waveColor = initialWaveColor || theme.colors.white;
    const progressColor = initialProgressColor || theme.colors.accent;
    const { filename: path } = sound;
    const filename = getFileName(path);
    const onPlay = ({ audio, sound }) => {
        dispatch({ type: 'play_sound', payload: { sound, audio } });
    };
    const onStop = ({ audio, sound }) => {
        dispatch({ type: 'clear_sound', payload: { sound, audio } });
    };
    const onPause = ({ audio, sound }) => {
        dispatch({ type: 'stop_sound', payload: { sound, audio } });
    };
    const options = {
        barWidth: 3,
        cursorWidth: 1,
        progressColor,
        waveColor,
        barRadius: 3,
        barGap: 0,
        onPlay,
        onStop,
        onPause,
    };
    return (
        <WaveContainer>
            <WaveForm sound={sound} options={options} waveColor={waveColor} />
            {!!filename && (
                <Text mx={1} my={2} color={waveColor} fontStyle='italic' fontSize={[1, 2]}>
                    {filename}
                </Text>
            )}
        </WaveContainer>
    );
};

export default AudioPlayer;
