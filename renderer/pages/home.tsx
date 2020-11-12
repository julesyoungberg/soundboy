import React, { useCallback, useEffect } from 'react';
import Head from 'next/head';
import { Button, Flex, Box } from 'rebass';

import Header from '../components/header';
import SelectFolder from '../components/select-folder';
import Samples from '../components/samples';
import Groups from '../components/groups';
import useAppState from '../hooks/useAppState';
import useIpcService from '../hooks/useIpcService';
import { MainAudioPlayer } from '../components/audio-player';

function Home() {
    const { dispatch, state } = useAppState();
    const ipcService = useIpcService();

    const analyze = useCallback(
        async (folder) => {
            if (!ipcService) return;
            await ipcService.analyze(folder, dispatch);
        },
        [ipcService, dispatch]
    );

    const getSounds = useCallback(async () => {
        if (!ipcService) return;
        await ipcService.getSounds({}, dispatch);
    }, [ipcService, dispatch]);

    const clear = useCallback(async () => {
        if (!ipcService) return;
        await ipcService.clearSounds();
        getSounds();
    }, [ipcService, getSounds]);

    useEffect(() => {
        if (state.sounds.data.length === 0) {
            getSounds();
        }
    }, [ipcService, getSounds]);

    useEffect(() => {
        if (!state.analyzer.running) {
            getSounds();
        }
    }, [state.analyzer.running, getSounds]);

    const onSelect = async (path: string) => {
        await analyze(path);
    };

    return (
        <>
            <Head>
                <title>Soundboy</title>
            </Head>
            <div>
                <Box px={3}>
                    <Flex width='100%' justifyContent='space-between' flexWrap='wrap'>
                        <Box>
                            <Header />
                            <Button onClick={clear} variant='primary' mr={2}>
                                Clear Sounds
                            </Button>
                            <SelectFolder onChange={onSelect} />
                        </Box>
                        <MainAudioPlayer />
                    </Flex>
                </Box>
                <Samples />
            </div>
        </>
    );
}

export default Home;
