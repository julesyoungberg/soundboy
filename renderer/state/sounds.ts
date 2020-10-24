/**
 * This file describes the sounds part of the state tree
 */
import { Sound } from '../../@types';

export interface SoundsState {
    data: Sound[];
    error: string;
    fetching: boolean;
}

export const initialState: SoundsState = {
    data: [],
    error: '',
    fetching: false,
};
