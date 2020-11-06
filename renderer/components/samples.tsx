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
    Instrument: DEFAULT_RANGES,
    Pitch: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
};

const Samples = ({ sounds = [], group }: { sounds: Sound[]; group: string }) => {
    const [header, setHeader] = useState<string | undefined>(DEFAULT_RANGES[0]);
    const { dispatch } = useAppState();
    const ipcService = useIpcService();

    const getSounds = async (range: string = header) => {
        if (!ipcService) return;
        const query = queries[group.toLowerCase()](range);
        console.log('getting sounds', query);
        await ipcService.getSounds(query, dispatch);
    };

    const selectRange = async (range: string) => {
        setHeader(range);
        await getSounds(range);
    };

    useEffect(() => {
        // TODO
        // this should be selectRange but that causes the app to crash sometimes
        setHeader(RANGES[group][0]);
    }, [group]);

    return (
        <Flex sx={{ width: '100%' }}>
            <Stack>
                <BackButton />
                {RANGES[group].map((range: string) => (
                    <Card
                        active={range === header}
                        onClick={() => selectRange(range)}
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
