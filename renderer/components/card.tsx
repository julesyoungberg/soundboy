import React from 'react';
import { Box, Heading } from 'rebass';
import Clickable from './clickable';
import type { Url } from '../../@types';
import useTheme from '../hooks/useTheme';

const Card = ({
    title,
    active,
    children,
    onClick,
    href,
    className,
}: {
    title?: string;
    active?: boolean;
    href?: Url;
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
}) => {
    const theme = useTheme();
    let activeStyle = {};
    const clickable = typeof href !== 'undefined' || typeof onClick === 'function';
    if (clickable) {
        activeStyle = {
            borderWidth: '3px',
            borderColor: 'primary',
        };
    }
    const style = {
        borderRadius: '7px',
        borderWidth: '1px',
        borderColor: 'grey',
        borderStyle: 'solid',
        boxShadow: theme.shadows.normal,
        '&:active': {
            ...activeStyle,
        },
    };
    return (
        <Clickable href={href} onClick={onClick} className={className}>
            <Box p={3} mx={2} my={2} sx={active ? { ...style, ...activeStyle } : style} bg='white'>
                {!!title && (
                    <Heading my={2} color='primary' fontWeight='bold' fontSize={[4, 3]}>
                        {title}
                    </Heading>
                )}
                {children}
            </Box>
        </Clickable>
    );
};

export default Card;
