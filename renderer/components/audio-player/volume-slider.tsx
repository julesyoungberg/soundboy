import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Flex, Box } from 'rebass';
import { Slider } from '@rebass/forms'
import throttle from 'lodash.throttle';
import { ImVolumeHigh, ImVolumeMedium, ImVolumeLow, ImVolumeMute2  } from "react-icons/im";

const VolumeSlider = ({audio}) => {
    const input = useRef<HTMLInputElement>();
    const [volume, setVolume] = useState<number>(1);

    const Icon = () => {
        if (volume > .67) {
            return <ImVolumeHigh size = "25px"/>;
        }
        if (volume > .33) {
            return <ImVolumeMedium size = "25px"/>;
        }
        if (volume > 0) {
            return <ImVolumeLow size = "25px" />;
        }
        return <ImVolumeMute2 size = "25px" />;
    }

    const getValue = () => Number(input?.current?.value || 1);

    const onChange = useCallback(
        throttle(() => {
            console.log(input.current.value);
            const value = getValue();
            audio.setVolume(value/100);
            setVolume(value/100);

        }, 250),
        [audio]
    );
    console.log(input);
    return (
            <Flex>
                <Box marginRight={2}>
                    <Icon></Icon>
                </Box>
                <Slider ref={input} onChange={onChange} style={{flexBasis:"150px"}}></Slider>
            </Flex>
    )
}

export default VolumeSlider;
