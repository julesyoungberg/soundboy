import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Text } from 'rebass';
import { Slider } from '@rebass/forms';
import { Flex } from 'rebass';
import throttle from 'lodash.throttle';
import Stack from '../stack';

const formatTime = (totalSeconds) => {
    const exactMinutes = totalSeconds / 60;
    const minutes = Math.floor(exactMinutes);
    const seconds = totalSeconds - minutes * 60;
    return `${minutes}:${seconds.toFixed(2)}`;
};

const AudioSlider = ({ audio }: { audio: WaveSurfer }) => {
    const [duration, setDuration] = useState<number>(0);
    const [at, setAt] = useState<number>(0);
    const input = useRef<HTMLInputElement>();
    const requestRef = useRef<number>();
    const previousTimeRef = useRef<number>();
    const onChange = useCallback(
        throttle((e) => {
            const at = Number(input?.current?.value || 0);
            audio.seekTo(at);
        }, 150),
        [audio]
    );
    const animate = (time) => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current;
            let dur = audio.getDuration();
            let at = audio.getCurrentTime();
            if (at > dur) at = dur;
            setDuration(dur);
            setAt(at);
            input.current.value = (at / dur).toString();
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };
    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [audio]);
    return (
        <Stack>
            <Slider ref={input} min='0' max='1' step='0.01' onChange={onChange} />
            <Text mx={1} my={2} color='black' fontStyle='italic' fontSize={[1, 2]}>
                {formatTime(at)} / {formatTime(duration)}
            </Text>
        </Stack>
    );
};

export default AudioSlider;
