import React from 'react';
import NextLink from 'next/link';
import styled from '@emotion/styled';

const Anchor = styled.a`
    text-decoration: none;
    cursor: pointer;
`;

const Link = ({ children, ...props }: { children: React.ReactNode; props?: any }) => (
    <NextLink {...(props as any)}>
        <Anchor>{children}</Anchor>
    </NextLink>
);

export default Link;
