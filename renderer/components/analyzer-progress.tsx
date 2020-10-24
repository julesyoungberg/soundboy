import styled from '@emotion/styled';
import React from 'react';
import { Line } from 'rc-progress';

import useAppState from '../hooks/useAppState';
import useTheme from '../hooks/useTheme';

const Container = styled.div`
    margin-top: 10px;
`;

export default function AnalyzerProgress() {
    const { state } = useAppState();
    const theme = useTheme();

    if (state.analyzer.tasks.length === 0) {
        // the analyzer is not running nor did it just finish
        return null;
    }

    const percent = (state.analyzer.completed / state.analyzer.tasks.length) * 100;

    return (
        <Container>
            <small>Analyzing... {state.analyzer.latest || ''}</small>
            <Line percent={percent} strokeColor={theme.colors.secondary} />
        </Container>
    );
}
