import React from 'react';
import { Box, Text } from 'rebass';

import { Sound } from '../../@types';
import getFileName from '../../util/getFileName';

const Sample = ({ sound }: { sound: Sound }) => {
    const { filename: path } = sound;
    const filename = getFileName(path);
    return (
        <Box p={3} sx={{ borderRadius: '3px' }} bg='primary'>
            <Text my={2} color='secondary' fontWeight='bold' fontSize={[2, 3]}>
                {filename}
            </Text>
            <Box my={3}>
                <Text my={2} color='secondary' fontSize={[1, 2]}>
                    Loudness: {sound.loudness.mean.toFixed(2)}
                </Text>
                <Text my={2} color='secondary' fontSize={[1, 2]}>
                    Centroid: {sound.spectralCentroid.mean.toFixed(2)}
                </Text>
                <Text my={2} color='secondary' fontSize={[1, 2]}>
                    Flatness: {sound.spectralFlatness.mean.toFixed(4)}
                </Text>
                <Text my={2} color='secondary' fontSize={[1, 2]}>
                    Kurtosis: {sound.spectralKurtosis.mean.toFixed(2)}
                </Text>
            </Box>
            <audio controls>
                <source src={`audio://${path}`} />
            </audio>
        </Box>
    );
};

export default Sample;
