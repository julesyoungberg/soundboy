import React from 'react';
import { Box, Text } from 'rebass';
import styled from '@emotion/styled';

import Card from './card';
import { Sound } from '../../@types';
import { AudioPlayer } from './audio-player';

const Sample = ({ sound }: { sound: Sound }) => {
    return (
        <Box
            paddingRight={2}
            marginLeft={2}
            my={1}
            bg='medGrey'
            sx={{ borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px', border: '1px solid #7d7e80' }}
        >
            <AudioPlayer sound={sound} />
        </Box>
    );
};

export default Sample;
