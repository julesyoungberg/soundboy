import React, { useCallback, useEffect } from 'react';
import { Box, Heading, Flex } from 'rebass';
import { BsMusicNoteList } from 'react-icons/bs';

const Header = () => (
    <Heading fontSize={[6, 7, 8]} color='black' fontStyle='italic' font Weight='800'>
        <Flex sx={{ position: 'relative' }} alignItems='center'>
            <Box sx={{ letterSpacing: '-10px' }}>Soundboy</Box>
            <Box sx={{ position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: '-36px', left: '30px' }}>
                    <BsMusicNoteList />
                </Box>
            </Box>
        </Flex>
    </Heading>
);

export default Header;
