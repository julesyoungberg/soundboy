import styled from '@emotion/styled';
import React, { ReactNode } from 'react';
import { GrClose } from 'react-icons/gr';
import { Box, Flex, Heading } from 'rebass';
import { Line } from 'rc-progress';

import useAppState from '../hooks/useAppState';
import useTheme from '../hooks/useTheme';

import Card from './card';
import Clickable from './clickable';

const Container = styled(Card)`
    margin-top: 10px;
`;

const ProgressContainer = styled(Box)`
    width: 100%;
    max-width: 100%;
    word-wrap: break-word;
    display: inline-block;
`;

const StyledHeading = styled(Heading)`
    margin-top: 0;
`;

const Errors = styled(Box)`
    padding-bottom: 10px;
    overflow-x: scroll;
`;

const ErrorMessage = styled.div<{ color?: string }>`
    margin-top: 10px;
    width: 100%;
    color: ${(props) => props.color};
`;

export default function AnalyzerStatus() {
    const {
        dispatch,
        state: { analyzer },
    } = useAppState();
    const theme = useTheme();

    if (
        analyzer.tasks.length === 0 ||
        (!analyzer.running && analyzer.errors.length === 0)
    ) {
        return null;
    }

    const percent = (analyzer.completed / analyzer.tasks.length) * 100;

    let headerContent: ReactNode | undefined;
    if (analyzer.running) {
        headerContent = (
            <ProgressContainer>
                <small>Analyzing... {analyzer.latest || ''}</small>
                <Line percent={percent} strokeColor={theme.colors.secondary} />
            </ProgressContainer>
        );
    } else {
        const dismiss = () => dispatch({ type: 'analyzer_dismiss' });

        headerContent = (
            <Flex justifyContent='space-between'>
                <Box>
                    <StyledHeading my={2} color='red' fontWeight='bold' fontSize={[4, 3]}>
                        Failed to Analyze {analyzer.errors.length} Sounds
                    </StyledHeading>
                </Box>
                <Box>
                    <Clickable onClick={dismiss}>
                        <GrClose />
                    </Clickable>
                </Box>
            </Flex>
        );
    }

    return (
        <Container clickable={false}>
            {headerContent}
            {analyzer.errors.length > 0 && (
                <Errors>
                    {analyzer.errors.map((error) => (
                        <ErrorMessage key={error.message}>{error.message}</ErrorMessage>
                    ))}
                </Errors>
            )}
        </Container>
    );
}
