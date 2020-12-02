import React from 'react';
import { Flex } from 'rebass';

const Stack = ({
    children,
    marginLeft,
    onDragStart,
}: {
    children: React.ReactNode;
    marginLeft?: number;
    onDragStart?: (any) => void;
}) => {
    return (
        <Flex sx={{ width: '100%' }} flexDirection='column' marginLeft={marginLeft} onDragStart={onDragStart}>
            {children}
        </Flex>
    );
};

export default Stack;
