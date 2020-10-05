import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Heading, Text } from 'rebass';
import SelectFolder from '../components/select-folder';

import useIpcService from '../hooks/useIpcService';

export default function Home() {
    const ipcService = useIpcService();
    const [folder, setFolder] = useState();

    const analyze = async () => {
        if (!ipcService) return;
        console.log('analyze');
        const res = await ipcService.analyze('./sounds');
        console.log(res);
    };

    const getSounds = async () => {
        if (!ipcService) return;
        console.log('getSounds');
        const sounds = await ipcService.getSounds({ foo: 'bar' });
        console.log(sounds);
    };

    return (
        <>
            <Head>
                <title>Soundboy</title>
            </Head>
            <div>
                <Heading fontSize={[6, 7, 8]} color='primary' fontWeight='800'>
                    Soundboy
                </Heading>
                <p>
                    ⚡ Electron + Next.js ⚡ -
                    <Link href='/next'>
                        <a>Go to next page</a>
                    </Link>
                </p>
                <Button disabled={!folder} variant='primary' mr={2} onClick={analyze}>
                    Analyze
                </Button>
                <Button variant='primary' mr={2} onClick={getSounds}>
                    Get Sounds
                </Button>
                <img src='/images/logo.png' />
                <SelectFolder onChange={setFolder} />
                {!!folder && <Text color='primary'>You have selected {folder} as your folder</Text>}
            </div>
        </>
    );
}
