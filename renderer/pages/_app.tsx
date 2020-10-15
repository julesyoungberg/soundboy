import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import type { AppProps } from 'next/app';

import IpcService, { IpcContext } from '../services/IpcService';
import theme from '../theme';

const global = css`
    body {
        background: ${theme.colors.background};
    }
`;

const Main = styled.main`
    font-family: 'system-ui', sans-serif;
`;

export default function MyApp({ Component, pageProps }: AppProps) {
    const [ipcService, setIpcService] = useState<IpcService | undefined>(undefined);

    // create the global ipcService object on mount, save in state, and pass to context
    useEffect(() => {
        if (!ipcService) setIpcService(new IpcService());
    }, [ipcService]);

    return (
        <ThemeProvider theme={theme}>
            <IpcContext.Provider value={ipcService}>
                <Global styles={global} />
                <Main>
                    <Component {...pageProps} />
                </Main>
            </IpcContext.Provider>
        </ThemeProvider>
    );
}
