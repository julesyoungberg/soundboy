import React from 'react';
import { Box } from 'rebass';
import { css } from '@emotion/core';

const text = css`
    color: #fff;
`;

const SelectFolder = ({ onChange }) => {
    const handleFile = (e) => {
        const { files } = e.target;
        const [head] = files;
        const { path, webkitRelativePath: relPath } = head;
        const folder = [path.substring(0, path.indexOf(relPath) - 1), relPath.split('/')[0]].join('/');
        onChange(folder);
    };
    const onlyFolders = { webkitdirectory: '', multiple: '' };
    return (
        <Box sx={{ my: 3 }}>
            <input css={text} type='file' onChange={handleFile} {...(onlyFolders as any)} />
        </Box>
    );
};

export default SelectFolder;
