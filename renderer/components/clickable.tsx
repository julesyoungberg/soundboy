import styled from '@emotion/styled';
import React from 'react';
import Link from './link';
import type { Theme } from '../theme';
import type { Url } from '../../@types';

const Button = styled.button`
    background: none;
    cursor: pointer;
    border: none;
    outline: none;
    font-family: ${(props: Theme) => props.theme.fonts.body};
`;

const Clickable = ({
    children,
    href,
    onClick,
    className,
}: {
    children: React.ReactNode;
    href?: Url;
    onClick?: () => void;
    className?: string;
}) => {
    const isLink = typeof href !== 'undefined';
    const isButton = typeof onClick === 'function';
    if (!isLink && !isButton) {
        return <div className={className}>{children}</div>;
    }
    const Wrapper = isLink ? Link : Button;
    const props = isLink ? { href } : { onClick };
    return <Wrapper {...props}>{children}</Wrapper>;
};

export default Clickable;
