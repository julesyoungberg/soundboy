import React, { useCallback, useEffect } from 'react';
import Head from 'next/head';
import { Button, Box } from 'rebass';

import Header from '../components/header';
import AnalyzerStatus from '../components/analyzer-status';
import SelectFolder from '../components/select-folder';
import Samples from '../components/samples';
import Groups from '../components/groups';
import useAppState from '../hooks/useAppState';
import useIpcService from '../hooks/useIpcService';

function Home({ group }: { group?: string }) {
    const { dispatch, state } = useAppState();
    const ipcService = useIpcService();
    const hasSounds = state.sounds.data.length > 0;
    const showGroups = typeof group === 'undefined';

    const analyze = async (folder) => {
        if (!ipcService) return;
        await ipcService.analyze(folder, dispatch);
    };

    const getSounds = useCallback(async () => {
        if (!ipcService) return [];
        await ipcService.getSounds({}, dispatch);
    }, [ipcService]);

    const clear = async () => {
        if (!ipcService) return;
        await ipcService.clearSounds();
        getSounds();
    };

    useEffect(() => {
        if (!ipcService) return;
        getSounds();
    }, [ipcService, getSounds]);

    useEffect(() => {
        if (!state.analyzer.running) {
            // just stopped, get sounds
            getSounds();
        }
    }, [state.analyzer.running, getSounds])

    const onSelect = async (path) => {
        await analyze(path);
        getSounds();
    };

    return (
        <>
            <Head>
                <title>Soundboy</title>
            </Head>
            <div>
                <Box px={3}>
                    <Header />
                    {state.sounds.data.length > 0 && (
                        <Button onClick={clear} variant='primary' mr={2}>
                            Clear Sounds
                        </Button>
                    )}
                    <SelectFolder onChange={onSelect} />
                </Box>
                <AnalyzerStatus />
                {hasSounds && (showGroups ? <Groups /> : <Samples sounds={state.sounds.data} group={group} />)}
            </div>
        </>
    );
}

Home.getInitialProps = ({ query }) => query;

export default Home;
