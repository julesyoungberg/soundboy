import React, { useEffect, useRef } from 'react';
import { Box, Flex } from 'rebass';
import { Text } from 'rebass';
import AudioPlayer from './audio-player';
import Card from '../card';
import useAppState from '../../hooks/useAppState';
import PauseButton from './pause-button';
import useTheme from '../../hooks/useTheme';
import AudioSlider from './audio-slider';
import getFileName from '../../../util/getFileName';

const MainAudioPlayer = () => {
    const theme = useTheme();
    const input = useRef();
    const { dispatch, state } = useAppState();
    const { nowPlaying } = state.sounds;
    const playing = !!nowPlaying?.playing;
    const audio = nowPlaying?.audio;
    const pause = () => audio?.playPause();
    useEffect(() => {
        if (typeof document === 'undefined') return;
        const onKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                pause();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [audio]);
    if (!nowPlaying || !nowPlaying.sound) return null;
    const filename = getFileName(nowPlaying.sound.filename);
    return (
        <Box sx={{ flex: '1', minWidth: '200px', marginTop: 3 }}>
            <Card>
                <Text mx={1} my={2} color='black' fontWeight='bold' fontSize={[1, 2]}>
                    {filename}
                </Text>
                <Flex alignItems='center'>
                    <PauseButton width={50} height={50} color={theme.colors.black} playing={playing} onClick={pause} />
                    {!!nowPlaying?.audio && <AudioSlider audio={nowPlaying.audio} />}
                </Flex>
            </Card>
        </Box>
    );
};

export default MainAudioPlayer;
