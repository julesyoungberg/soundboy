import React from 'react';
import { Box, Heading, Flex } from 'rebass';
import { BsMusicNoteList } from 'react-icons/bs';
import styled from '@emotion/styled';
import type { Theme } from '../theme';

const Position = styled.div`
    position: absolute;
    top: -25px;
    left: 20px;
    ${({ theme }: { theme: Theme }) =>
        theme &&
        `
    @media screen and (min-width: ${theme.breakpoints[0]}) {
      top: -36px;
      left: 30px;
    }
  `}
`;

const Header = () => (
    <Heading sx={{ userSelect: 'none' }} fontSize={[7, 8]} color='black' fontStyle='italic' fontWeight='800'>
        <Flex sx={{ position: 'relative' }} alignItems='center'>
            <Box sx={{ letterSpacing: '-10px' }}>Soundboy</Box>
            <Box width='150px' sx={{ position: 'relative' }}>
                <Position>
                    <BsMusicNoteList />
                </Position>
            </Box>
        </Flex>
    </Heading>
);

export default Header;
