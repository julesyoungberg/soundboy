import React, { useState } from 'react';
import { Box, Flex } from 'rebass';

import { Sound } from '../../@types';

import Sample from './sample';
import Card from './card';
import Stack from './stack';
import List from './list';
import BackButton from './back-button';

const RANGES = ['Low', 'Mid', 'High'];

const Samples = ({ sounds = [], group }: { sounds: Sound[]; group: string }) => {
    const [header, setHeader] = useState<string>(RANGES[0]);
    return (
        <Flex sx={{ width: '100%' }}>
            <Stack>
                <BackButton />
                {RANGES.map((range) => (
                    <Card
                        active={range === header}
                        onClick={() => setHeader(range)}
                        title={range}
                        key={`range-${range}`}
                    />
                ))}
            </Stack>
            <List title={header}>
                <Stack>
                    {sounds.map((sound) => (
                        <Sample sound={sound} key={sound._id} />
                    ))}
                </Stack>
            </List>
        </Flex>
    );
};

export default Samples;
