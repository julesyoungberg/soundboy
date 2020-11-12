import React, { useEffect, useReducer, useState } from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import type { AppProps } from 'next/app';

import IpcService, { IpcContext } from '../services/IpcService';
import { initialState, StateContext } from '../state';
import reducer from '../state/reducer';
import theme from '../theme';

const global = css`
    body {
        background: ${theme.colors.background};
        margin: 0;
    }
`;

const Main = styled.main`
    font-family: 'system-ui', sans-serif;
`;

export default function MyApp({ Component, pageProps }: AppProps) {
    const [ipcService, setIpcService] = useState<IpcService | undefined>(undefined);
    const [state, dispatch] = useReducer(reducer, initialState);

    // create the global ipcService object on mount, save in state, and pass to context
    useEffect(() => {
        if (!ipcService) setIpcService(new IpcService());
    }, [ipcService]);

    console.log(state);

    return (
        <ThemeProvider theme={theme}>
            <IpcContext.Provider value={ipcService}>
                <StateContext.Provider value={{ dispatch, state }}>
                    <Global styles={global} />
                    <Main>
                        <Component {...pageProps} />
                    </Main>
                </StateContext.Provider>
            </IpcContext.Provider>
        </ThemeProvider>
    );
}
