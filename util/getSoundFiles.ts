import glob from 'glob-promise';

/**
 * Recursively finds all the sound files (mp3, wav, aif) in the given folder
 * @param folder
 * @returns an array of sound file names
 */
export default function getSoundFiles(folder: string) {
    return glob.promise(`${folder}/**/*.{mp3,wav,aif,flac}`);
}
