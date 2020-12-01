import React from 'react';
import Card from './card';
import { Flyout } from 'victory';
import useTheme from '../hooks/useTheme';

const widthPerChar = 7.5;

const Tooltip = (props) => {
    const theme = useTheme();
    const length = props?.datum?.label?.length || 0;
    return (
        <Flyout
            {...props}
            style={{
                fill: theme.colors.white,
                filter: 'drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))',
                stroke: theme.colors.grey,
                strokeWidth: '2px',
            }}
            width={Math.ceil(length * widthPerChar)}
        />
    );
};

export default Tooltip;
