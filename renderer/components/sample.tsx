import React from 'react';
import { Box, Text } from 'rebass';
import styled from '@emotion/styled';

import Card from './card';
import { Sound } from '../../@types';
import getFileName from '../../util/getFileName';
import AudioPlayer from './audio-player';

const Sample = ({ sound }: { sound: Sound }) => {
    const { filename: path } = sound;
    const filename = getFileName(path);
    return (
        <Box
            paddingRight={2}
            marginLeft={2}
            my={1}
            bg='medGrey'
            sx={{ borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px', border: '1px solid #7d7e80' }}
        >
            <AudioPlayer src={`audio://${path}`} name={filename} />
        </Box>
    );
};

export default Sample;
