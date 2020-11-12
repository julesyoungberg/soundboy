import React from 'react';
import Clickable from './clickable';
import styled from '@emotion/styled';

import type { Theme } from '../theme';

const Wrapper = styled.div<{ disabled?: boolean }>`
    display: flex;
    align-items: center;
    ${(props) =>
        props.disabled &&
        `
    opacity: 0.3;
    cursor: auto;
  `}

    svg {
        height: 25px;
        width: 25px;
    }

    ${({ theme }: { theme: Theme }) =>
        theme &&
        `
    @media screen and (min-width: ${theme.breakpoints[0]}) {
      svg {
          height: 40px;
          width: 40px;
      }
    }
  `}
`;

const IconButton = ({
    children,
    onClick,
    disabled,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}) => {
    return (
        <Clickable onClick={onClick} disabled={disabled}>
            <Wrapper disabled={disabled}>{children}</Wrapper>
        </Clickable>
    );
};

export default IconButton;
