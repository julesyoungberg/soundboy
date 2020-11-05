import React from 'react';
import { Box } from 'rebass';

import Card from './card';

const GROUPS = ['Instrument', 'Loudness', 'Genre', 'Tempo', 'Pitch'];

const Groups = () => (
    <Box
        my={3}
        sx={{
            display: 'grid',
            gridGap: 3,
            textAlign: 'center',
            gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
        }}
    >
        {GROUPS.map((sound) => (
            <Card href={{ query: { group: sound } }} title={sound} key={`group-${sound}`} />
        ))}
    </Box>
);

export default Groups;
