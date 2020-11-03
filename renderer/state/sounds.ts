/**
 * This file describes the sounds part of the state tree
 */
import { Sound } from '../../@types';

export interface NowPlaying {
    sound: Sound | null;
    audio: WaveSurfer;
    playing: boolean;
}

export interface SoundsState {
    data: Sound[];
    error: string;
    fetching: boolean;
    nowPlaying?: NowPlaying;
}

export const initialState: SoundsState = {
    data: [],
    error: '',
    fetching: false,
    nowPlaying: null,
};
