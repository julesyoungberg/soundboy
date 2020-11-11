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

const LABELS = {
    instrument: 'Instrument',
    pitch: 'Pitch',
};

const SELECT = {
    instrument: ['Kick', 'Snare', 'Keys'],
    pitch: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
};

const PAIRS = {
    brightness: ['Bright', 'Dark'],
};

const GROUPS = {
    ...SELECT,
    ...PAIRS,
};

export interface SoundsFilter {
    instrument: string;
    pitch: string;
    brightness: string;
    noisiness: string;
}

export interface GroupCount {
    [key: string]: number;
}

export interface SoundsCount {
    instrument?: GroupCount;
    pitch?: GroupCount;
    brightness?: GroupCount;
    noisiness?: GroupCount;
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

const Samples = () => {
    const [filterState, filterDispatch] = useReducer(filterReducer, initialFilter);
    const [header, setHeader] = useState<string>('');
    const { state, dispatch } = useAppState();
    const sounds = state.sounds.data;
    const { running } = state.analyzer;
    const hasSounds = sounds.length > 0;
    const ipcService = useIpcService();

    const getSounds = async (q: Partial<SoundsFilter> = {}) => {
        if (!ipcService) return;
        const query = filterToQuery({ ...filterState, ...q });
        console.log(query);
        await ipcService.getSounds(query, dispatch);
    };

    const getCounts = async () => {
        const getCount = async (key, opt) => {
            if (!ipcService) return;
            const query = filterToQuery({ ...filterState, [key]: opt });
            const count = await ipcService.getSoundsCount(query);
            return count;
        };
        const features = Object.keys(GROUPS);
        const pairs = features.reduce((acc, feature) => {
            const all = GROUPS[feature].map((value) => [feature, value]);
            return acc.concat(all);
        }, []);
        const counts = {};
        // Not a great implementation here since its essentially
        // synchronous but the IPC event emitter returns the first response
        // and returns the same result for all calls.
        for (const [feature, value] of pairs) {
            const count = await getCount(feature, value);
            if (!counts[feature]) counts[feature] = {};
            counts[feature][value] = count;
        }
        return counts;
    };

    const [counts, setCounts] = useState<SoundsCount>({});

    useEffect(() => {
        if (running) return;
        getSounds(initialFilter);
        filterDispatch(initialFilter);
    }, [running]);

    useEffect(() => {
        const updateCounts = async () => {
            const counts = await getCounts();
            setCounts(counts);
        };
        updateCounts();
    }, [filterState, ipcService]);

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
                    {Object.entries(SELECT).map(([key, options]) => (
                        <Box key={key} width={1 / 2} style={{ padding: 10 }}>
                            <Label htmlFor={key}>{LABELS[key]}</Label>
                            <Select
                                id={key}
                                name={key}
                                value={filterState[key]}
                                onChange={onUpdateFilterFactory(key)}
                                disabled={!hasSounds}
                            >
                                {['All', ...options].map((opt) => {
                                    const count = counts?.[key]?.[opt];
                                    if (typeof count !== 'undefined' && count <= 0) return null;
                                    return (
                                        <option key={opt} value={opt}>
                                            {opt} {!!count && `(${count})`}
                                        </option>
                                    );
                                })}
                            </Select>
                        </Box>
                    ))}
                </Flex>
                {Object.entries(PAIRS).map(([key, [option1, option2]]) => (
                    <FilterPair
                        current={filterState[key]}
                        key={key}
                        option1={option1}
                        option2={option2}
                        option1Count={counts?.[key]?.[option1]}
                        option2Count={counts?.[key]?.[option2]}
                        onChange={onUpdateFilterFactory(key)}
                        disabled={!hasSounds}
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
