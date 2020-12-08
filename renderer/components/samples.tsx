import React, { useEffect, useReducer, useState } from 'react';
import { RiSoundModuleFill } from 'react-icons/ri';
import { FaMapMarkedAlt as FaMap } from 'react-icons/fa';
import { Text, Box, Flex } from 'rebass';
import { Input, Label, Select } from '@rebass/forms';

import { INSTRUMENTS } from '../../constants';
import useAppState from '../hooks/useAppState';
import useIpcService from '../hooks/useIpcService';
import queries from '../queries';

import FilterPair from './filter-pair';
import Stack from './stack';
import List from './list';
import Card from './card';
import Graph from './graph';

const LABELS = {
    instrument: 'Instrument',
    pitch: 'Pitch',
};

const SELECT = {
    instrument: INSTRUMENTS,
    pitch: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
};

const PAIRS = {
    brightness: ['Bright', 'Dark'],
    // TODO debug / fix these
    // fullness: ['Full', 'Holllow'],
    // loudness: ['Loud', 'Quiet'],
    // noisiness: ['Noisy', 'Soft'],
    // pitchiness: ['Tonal', 'Atonal'],
    roughness: ['Rough', 'Smooth'],
    sharpness: ['Sharp', 'Dull'],
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
    name: '',
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

const Heading = ({
    text,
    icon,
    marginTop = 2,
    paddingTop = 2,
}: {
    text: string;
    icon: React.ReactNode;
    marginTop?: number;
    paddingTop?: number;
}) => {
    return (
        <Flex justifyContent='space-between' marginTop={marginTop} marginBottom={2} px={3} py={paddingTop * 2}>
            <Text color='black' fontWeight='bold' fontSize={[3, 4]} paddingTop={paddingTop}>
                <Flex alignItems='center' sx={{ '> svg': { marginLeft: '11px' } }}>
                    {text} {icon}
                </Flex>
            </Text>
        </Flex>
    );
};

const Samples = () => {
    const [filterState, filterDispatch] = useReducer(filterReducer, initialFilter);
    const [page, setPage] = useState<number>(1);
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
            if (!ipcService) return 0;
            const query = filterToQuery({ ...filterState, [key]: opt });
            const count = await ipcService.getSoundsCount(query);
            setPage(1);
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
            const c = await getCounts();
            setCounts(c);
        };
        updateCounts();
    }, [filterState, ipcService]);

    const onUpdateFilterFactory = (filter: string) => async (event: any) => {
        let value = 'All';
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
        <Flex sx={{ width: '100%', paddingRight: 10 }}>
            <Stack marginLeft={2}>
                <Heading text='Filters' icon={<RiSoundModuleFill size='27px' />} />
                <Card>
                    <Flex>
                        <Box style={{ padding: 10, width: '100%' }}>
                            <Input
                                id='search'
                                name='search'
                                placeholder='Search Samples'
                                onChange={onUpdateFilterFactory('name')}
                                style={{ width: '100%' }}
                            />
                        </Box>
                    </Flex>
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
                </Card>
                <Heading paddingTop={1} marginTop={0} text='Mini-map' icon={<FaMap />} />
                <Graph setPage={setPage} />
            </Stack>
            <List title='Samples' sounds={sounds} page={page} onPageChange={setPage} />
        </Flex>
    );
};

export default Samples;
