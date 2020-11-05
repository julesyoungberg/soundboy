import React from 'react';
import { Flex } from 'rebass';

const Stack = ({ children }: { children: React.ReactNode }) => {
    return (
        <Flex sx={{ width: '100%' }} flexDirection='column'>
            {children}
        </Flex>
    );
};

export default Stack;
