import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { Button, Heading } from 'rebass';

import { Sound } from '../../@types';
import SelectFolder from '../components/select-folder';
import Samples from '../components/samples';
import useIpcService from '../hooks/useIpcService';

export default function Home() {
    const ipcService = useIpcService();
    const [sounds, setSounds] = useState<Sound[]>([]);

    const analyze = async (folder) => {
        if (!ipcService) return;
        console.log('analyze');
        await ipcService.analyze(folder);
    };

    const getSounds = useCallback(async () => {
        if (!ipcService) return [];
        console.log('getSounds');
        const { results } = await ipcService.getSounds({});
        console.log(results);
        return results;
    }, [ipcService]);

    const reloadSounds = useCallback(async () => {
        const mSounds = await getSounds();
        setSounds(mSounds);
    }, [setSounds, getSounds]);

    const clear = async () => {
        if (!ipcService) return;
        await ipcService.clearSounds();
        reloadSounds();
    };

    useEffect(() => {
        if (!ipcService) return;
        reloadSounds();
    }, [ipcService, reloadSounds]);

    const onSelect = async (path) => {
        await analyze(path);
        reloadSounds();
    };

    console.log(sounds);

    return (
        <>
            <Head>
                <title>Soundboy</title>
            </Head>
            <div>
                <Heading fontSize={[6, 7, 8]} color='primary' fontWeight='800'>
                    Soundboy
                </Heading>
                {sounds.length > 0 && (
                    <Button onClick={clear} variant='primary' mr={2}>
                        Clear Sounds
                    </Button>
                )}
                <SelectFolder onChange={onSelect} />
                <Samples sounds={sounds} />
            </div>
        </>
    );
}
