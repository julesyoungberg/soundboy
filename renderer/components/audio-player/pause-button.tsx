import React from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import styled from '@emotion/styled';
import type { Theme } from '../../theme';

interface PlayStyle {
    color?: string;
    width: number;
    height: number;
    onClick: () => void;
    theme: Theme;
}

const paddingX = 18;
const paddingY = 23;

const PlayButton = styled.button<PlayStyle>`
    background: none;
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${(props: PlayStyle) => props.height + paddingY * 2}px;
    width: ${(props: PlayStyle) => props.width + paddingX * 2}px;
    border: none;
    outline: none;
    cursor: pointer;
    padding-bottom: 3px;
    color: ${(props: PlayStyle) => props.color || props.theme.colors.white};
    svg {
        width: ${(props: PlayStyle) => props.width}px;
        height: ${(props: PlayStyle) => props.height}px;
    }
`;

const PauseButton = ({
    playing,
    color,
    onClick,
    width,
    height,
}: {
    playing: boolean;
    color?: string;
    onClick: () => void;
    width: number;
    height: number;
}) => (
    <PlayButton color={color} onClick={onClick} width={width} height={height}>
        {playing ? <FaPause /> : <FaPlay />}
    </PlayButton>
);

PauseButton.defaultProps = {
    width: 14,
    height: 14,
};

export default PauseButton;
