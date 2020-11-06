import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Slider } from '@rebass/forms';
import { Text } from 'rebass';
import throttle from 'lodash.throttle';
import Stack from '../stack';

const formatTime = (totalSeconds) => {
    const exactMinutes = totalSeconds / 60;
    const minutes = Math.floor(exactMinutes);
    const seconds = totalSeconds - minutes * 60;
    const secondsDecimals = seconds.toFixed(2);
    const secondsPadded = seconds >= 10 ? secondsDecimals : `0${secondsDecimals}`;
    return `${minutes}:${secondsPadded}`;
};

const AudioSlider = ({ audio }: { audio: WaveSurfer }) => {
    const [duration, setDuration] = useState<number>(0);
    const [at, setAt] = useState<number>(0);
    const [mouseDown, setMouseDown] = useState<boolean>(false);
    const input = useRef<HTMLInputElement>();
    const requestRef = useRef<number>();
    const previousTimeRef = useRef<number>();
    const onChange = useCallback(
        throttle(() => {
            const at = Number(input?.current?.value || 0);
            audio.seekTo(at);
        }, 250),
        [audio]
    );
    const onMouseUp = () => {
        setMouseDown(false);
        onChange();
    };
    const onMouseDown = () => {
        setMouseDown(true);
    };
    const animate = (time) => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current;
            let dur = audio.getDuration();
            let at = audio.getCurrentTime();
            if (at > dur) at = dur;
            if (mouseDown) at = Number(input?.current?.value || 0) * dur;
            setDuration(dur);
            setAt(at);
            if (!mouseDown) input.current.value = (at / dur).toString();
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };
    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [audio, mouseDown]);
    return (
        <Stack>
            <Slider ref={input} min='0' max='1' step='0.0001' onMouseDown={onMouseDown} onMouseUp={onMouseUp} />
            <Text mx={1} my={2} color='black' fontStyle='italic' fontSize={[1, 2]}>
                {formatTime(at)} / {formatTime(duration)}
            </Text>
        </Stack>
    );
};

export default AudioSlider;
