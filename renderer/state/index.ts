/**
 * This file describes the application state
 */
import React from 'react';

import Action from './action';
import * as analyzer from './analyzer';
import * as sounds from './sounds';

export interface State {
    analyzer: analyzer.AnalyzerState;
    sounds: sounds.SoundsState;
}

export const initialState = {
    analyzer: analyzer.initialState,
    sounds: sounds.initialState,
};

export interface StateContextType {
    dispatch: (_: Action) => void;
    state: State;
}

export const StateContext = React.createContext<StateContextType>({
    dispatch: () => null,
    state: initialState,
});
