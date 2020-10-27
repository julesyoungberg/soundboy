import styled from '@emotion/styled';
import React from 'react';
import { Line } from 'rc-progress';

import useAppState from '../hooks/useAppState';
import useTheme from '../hooks/useTheme';

const Container = styled.div`
    margin-top: 10px;
`;

const ErrorMessage = styled.small`
    margin-top: 10px;
    color: red;
`;

export default function AnalyzerProgress() {
    const {
        state: { analyzer },
    } = useAppState();
    const theme = useTheme();

    if (analyzer.tasks.length === 0) {
        // the analyzer is not running nor did it just finish
        return null;
    }

    const percent = (analyzer.completed / analyzer.tasks.length) * 100;
    const error = analyzer.errors.length > 0 ? analyzer.errors[analyzer.errors.length - 1] : undefined;

    return (
        <Container>
            <small>Analyzing... {analyzer.latest || ''}</small>
            <Line percent={percent} strokeColor={theme.colors.secondary} />
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </Container>
    );
}
