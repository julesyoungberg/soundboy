import React, { useCallback, useEffect } from 'react';
import Head from 'next/head';
import { Button, Heading } from 'rebass';

import AnalyzerProgress from '../components/analyzer-progress';
import SelectFolder from '../components/select-folder';
import Samples from '../components/samples';
import useAppState from '../hooks/useAppState';
import useIpcService from '../hooks/useIpcService';

export default function Home() {
    const { dispatch, state } = useAppState();
    const ipcService = useIpcService();

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

    const onSelect = async (path) => {
        await analyze(path);
        getSounds();
    };

    console.log(state.sounds.data);

    return (
        <>
            <Head>
                <title>Soundboy</title>
            </Head>
            <div>
                <Heading fontSize={[6, 7, 8]} color='primary' fontWeight='800'>
                    Soundboy
                </Heading>
                {state.sounds.data.length > 0 && (
                    <Button onClick={clear} variant='primary' mr={2}>
                        Clear Sounds
                    </Button>
                )}
                <SelectFolder onChange={onSelect} />
                <AnalyzerProgress />
                <Samples sounds={state.sounds.data} />
            </div>
        </>
    );
}
