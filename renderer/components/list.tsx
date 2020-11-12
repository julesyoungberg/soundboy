import React from 'react';
import { Flex, Box, Text } from 'rebass';
import Stack from './stack';
import Card from './card';
import Sample from './sample';
import { Sound } from '../../@types';
import IconButton from './icon-button';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import AnalyzerStatus from './analyzer-status';
import { GiSoundOn } from 'react-icons/gi';

const SOUNDS_PER_PAGE = 6;

const List = ({
    title,
    sounds,
    page,
    onPageChange,
}: {
    title: string;
    sounds: Sound[];
    page: number;
    onPageChange: (any) => void;
}) => {
    const lastPage = Math.ceil(sounds.length / SOUNDS_PER_PAGE) || 1;
    const hasManyPages = lastPage > 1;
    return (
        <Box sx={{ borderRadius: '7px', width: '100%', minHeight: '700px' }}>
            <Flex justifyContent='space-between' marginLeft={2} px={3} marginTop={4} marginBottom={1}>
                <Flex flexDirection='column'>
                    <Text color='black' fontWeight='bold' fontSize={[3, 4]}>
                        <Flex alignItems='center' sx={{ '> svg': { marginBottom: '2px', marginLeft: '8px' } }}>
                            {title} <GiSoundOn size='40px' />
                        </Flex>
                    </Text>
                    <Text
                        sx={{ visibility: hasManyPages ? 'visible' : 'hidden' }}
                        color='black'
                        fontStyle='italic'
                        fontSize={[1]}
                    >
                        {`Page ${page} of ${lastPage}`}
                    </Text>
                </Flex>
                {hasManyPages && (
                    <Box>
                        <IconButton disabled={page <= 1} onClick={() => onPageChange((page) => page - 1)}>
                            <GrFormPrevious />
                        </IconButton>
                        <IconButton disabled={page >= lastPage} onClick={() => onPageChange((page) => page + 1)}>
                            <GrFormNext />
                        </IconButton>
                    </Box>
                )}
            </Flex>
            <Stack>
                <AnalyzerStatus />
                {sounds.slice((page - 1) * SOUNDS_PER_PAGE, page * SOUNDS_PER_PAGE).map((sound) => (
                    <Sample sound={sound} key={sound._id} />
                ))}
            </Stack>
        </Box>
    );
};

export default List;
