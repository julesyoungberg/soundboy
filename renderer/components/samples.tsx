import React, { useEffect, useReducer, useState } from 'react';
import { Box, Button, Flex } from 'rebass';
import { Label, Select } from '@rebass/forms';

import { Sound } from '../../@types';
import useAppState from '../hooks/useAppState';
import useIpcService from '../hooks/useIpcService';
import queries from '../queries';

import FilterPair from './filter-pair';
import Sample from './sample';
import Stack from './stack';
import List from './list';

const GROUPS = {
    Instrument: ['Kick', 'Snare', 'Keys'],
    Pitch: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
};

export interface SoundsFilter {
    instrument: string;
    pitch: string;
    brightness: string;
    noisiness: string;
}

const initialFilter = {
    instrument: 'All',
    pitch: 'All',
    brightness: 'All',
    noisiness: 'All',
};

const filterReducer = (state: SoundsFilter = initialFilter, action: Partial<SoundsFilter>): SoundsFilter => ({
    ...state,
    ...action,
});

const filterToQuery = (filterState: SoundsFilter) =>
    Object.keys(filterState).reduce((acc, filter) => {
        const v = filterState[filter];
        if (v === 'All') {
            return acc;
        }

        return {
            ...acc,
            ...queries[filter](v),
        };
    }, {});

const Samples = ({ sounds = [] }: { sounds: Sound[] }) => {
    const [filterState, filterDispatch] = useReducer(filterReducer, initialFilter);
    const [header, setHeader] = useState<string>('');
    const { dispatch } = useAppState();
    const ipcService = useIpcService();

    const getSounds = async (q: Partial<SoundsFilter> = {}) => {
        if (!ipcService) return;
        const query = filterToQuery({ ...filterState, ...q });
        console.log(query);
        await ipcService.getSounds(query, dispatch);
    };

    useEffect(() => {
        getSounds();
    }, []);

    const onUpdateFilterFactory = (filter: string) => async (event: any) => {
        let value: string = 'All';
        if (typeof event === 'string') {
            value = event;
        } else if (event.target) {
            value = event.target.value;
        }
        const query = { [filter]: value };
        filterDispatch(query);
        await getSounds(query);
    };

    return (
        <Flex sx={{ width: '100%' }}>
            <Stack>
                <Flex>
                    {Object.entries(GROUPS).map(([key, options]) => (
                        <Box key={key} width={1 / 2} style={{ padding: 10 }}>
                            <Label htmlFor={key.toLowerCase()}>{key}</Label>
                            <Select
                                id={key.toLowerCase()}
                                name={key}
                                defaultValue='All'
                                onChange={onUpdateFilterFactory(key.toLowerCase())}
                            >
                                {['All', ...options].map((opt) => (
                                    <option key={opt}>{opt}</option>
                                ))}
                            </Select>
                        </Box>
                    ))}
                </Flex>
                <FilterPair
                    current={filterState.brightness}
                    option1='Bright'
                    option2='Dark'
                    onChange={onUpdateFilterFactory('brightness')}
                />
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
