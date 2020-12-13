import { sep } from 'path';

export default (path) => {
    if (!path) return '';
    const i = path.lastIndexOf(sep);
    if (i <= -1) return path;
    return path.substring(i + 1, path.length);
};
