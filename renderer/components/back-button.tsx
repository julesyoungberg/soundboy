import React from 'react';
import { FaAngleLeft } from 'react-icons/fa';
import { Box, Text, Flex } from 'rebass';

import Clickable from './clickable';

const BackButton = () => (
    <Box mx={2} marginTop={2}>
        <Clickable href='#'>
            <Flex color='black' my={2} alignItems='center'>
                <FaAngleLeft /> <Text fontWeight='bold'>Back</Text>
            </Flex>
        </Clickable>
    </Box>
);

export default BackButton;
