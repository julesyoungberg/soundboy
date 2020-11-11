import React from 'react';
import { Flex } from 'rebass';

const Stack = ({ children, marginLeft }: { children: React.ReactNode; marginLeft?: number }) => {
    return (
        <Flex sx={{ width: '100%' }} flexDirection='column' marginLeft={marginLeft}>
            {children}
        </Flex>
    );
};

export default Stack;
