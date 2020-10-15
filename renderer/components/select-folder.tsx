import React from 'react';
import { Box, Button } from 'rebass';
import styled from '@emotion/styled';

const Hidden = styled.div`
    display: none;
`;

const SelectFolder = ({ onChange }) => {
    const handleFile = (e) => {
        const { files } = e.target;
        const [head] = files;
        if (!head) return;
        const { path, webkitRelativePath: relPath } = head;
        const folder = [path.substring(0, path.indexOf(relPath) - 1), relPath.split('/')[0]].join('/');
        onChange(folder);
    };
    const onlyFolders = { webkitdirectory: '', multiple: '' };
    return (
        <Box sx={{ my: 3, position: 'relative' }} display='inline'>
            <Button sx={{ fontSize: 2, fontFamily: 'Arial' }} htmlFor='file-select' as='label' variant='primary' mr={2}>
                Add Sounds
            </Button>
            <Hidden>
                <input id='file-select' type='file' onChange={handleFile} {...(onlyFolders as any)} />
            </Hidden>
        </Box>
    );
};

export default SelectFolder;
