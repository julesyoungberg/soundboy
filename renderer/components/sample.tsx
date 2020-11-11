import React from 'react';
import { Text, Box } from 'rebass';

import { Sound } from '../../@types';
import { AudioPlayer } from './audio-player';
import useTheme from '../hooks/useTheme';
import Stack from './stack';
import getFileName from '../../util/getFileName';

const Sample = ({ sound }: { sound: Sound }) => {
    const theme = useTheme();
    const { filename: path } = sound;
    const filename = getFileName(path);
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
            <Box
                paddingRight={2}
                marginLeft={2}
                my={1}
                bg='white'
                sx={{
                    borderTopLeftRadius: '7px',
                    borderBottomLeftRadius: '7px',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'grey',
                    boxShadow: theme.shadows.normal,
                }}
            >
                <AudioPlayer sound={sound} />
            </Box>
        </Stack>
    );
};

export default Sample;
