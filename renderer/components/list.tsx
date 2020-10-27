import React from 'react';
import { Box, Text } from 'rebass';
import Stack from './stack';

const List = ({ title, children }: { title: string; children: React.ReactNode }) => {
    return (
        <Box sx={{ borderRadius: '7px', width: '100%', minHeight: '700px' }} bg='darkGrey'>
            <Box
                sx={{ borderTopLeftRadius: '7px', borderTopRightRadius: '7px', marginBottom: '50px' }}
                px={3}
                py={4}
                bg='primary'
            >
                <Text color='white' fontWeight='bold' fontSize={[2, 3]}>
                    {title}
                </Text>
            </Box>
            <Stack>{children}</Stack>
        </Box>
    );
};

export default List;
