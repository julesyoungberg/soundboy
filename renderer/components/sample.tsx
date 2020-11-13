import React, { useRef, useEffect } from 'react';
import { Text, Box, Flex } from 'rebass';

import { Sound } from '../../@types';
import { AudioPlayer } from './audio-player';
import useTheme from '../hooks/useTheme';
import useIpcService from '../hooks/useIpcService';
import Stack from './stack';
import getFileName from '../../util/getFileName';

const Sample = ({ sound }: { sound: Sound }) => {
    const theme = useTheme();
    const ipcService = useIpcService();
    const { filename: path } = sound;
    const filename = getFileName(path);
    const onDrag = (e) => {
        event.preventDefault();
        ipcService.send('ondragstart', path);
    };
    return (
        <Stack>
            {!!filename && (
                <Text
                    sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    mx={1}
                    marginTop={2}
                    color={'black'}
                    fontStyle='italic'
                    opacity={0.8}
                    fontWeight='bold'
                    textAlign='right'
                    fontSize={[1, 2]}
                >
                    {filename}
                </Text>
            )}
            <Flex
                paddingRight={2}
                marginLeft={2}
                my={1}
                bg='white'
                alignItems='center'
                sx={{
                    borderTopLeftRadius: '7px',
                    borderBottomLeftRadius: '7px',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'grey',
                    boxShadow: theme.shadows.normal,
                }}
            >
                <Flex
                    draggable='true'
                    onDragStart={onDrag}
                    alignItems='center'
                    fontSize={3}
                    sx={{
                        paddingLeft: '3.5px',
                        color: 'grey',
                        cursor: 'grab',
                        height: '60px',
                        width: '15px',
                        borderRight: '1px solid #000',
                        borderColor: 'grey',
                    }}
                >
                    <Box bg='grey' sx={{ marginLeft: '3px', height: '20px', width: '1px' }} />
                </Flex>
                <AudioPlayer sound={sound} />
            </Flex>
        </Stack>
    );
};

export default Sample;
