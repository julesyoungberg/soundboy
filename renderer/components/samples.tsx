import React from 'react';
import { Box } from 'rebass';
import Sample from './sample';

const Samples = ({ sounds = [] }: { sounds: Sound[] }) => (
    <Box my={3} sx={{ display: 'grid', gridGap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))' }}>
        {sounds.map((sound) => (
            <Sample sound={sound} key={sound._id} />
        ))}
    </Box>
);

export default Samples;
