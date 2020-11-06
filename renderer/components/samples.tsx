import React, { useCallback, useEffect, useState } from 'react';
import { Flex } from 'rebass';

import { Sound } from '../../@types';
import useAppState from '../hooks/useAppState';
import useIpcService from '../hooks/useIpcService';
import queries from '../queries';

import Sample from './sample';
import Card from './card';
import Stack from './stack';
import List from './list';
import BackButton from './back-button';

const DEFAULT_RANGES = ['Low', 'Mid', 'High'];

const RANGES = {
    'Instrument': DEFAULT_RANGES,
    'Pitch': ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
};

const Samples = ({ sounds = [], group }: { sounds: Sound[]; group: string }) => {
    const [header, setHeader] = useState<string | undefined>(DEFAULT_RANGES[0]);
    const { dispatch, state } = useAppState();
    const ipcService = useIpcService();

    const ranges = RANGES[group];

    useEffect(() => {
        setHeader(ranges[0]);
    }, [setHeader, ranges]);

    const handleSelectRange = async (range: string) => {
        setHeader(range);
        await ipcService.getSounds(queries[group](range), dispatch);
    };

    return (
        <Flex sx={{ width: '100%' }}>
            <Stack>
                <BackButton />
                {ranges.map((range: string) => (
                    <Card
                        active={range === header}
                        onClick={() => handleSelectRange(range)}
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
