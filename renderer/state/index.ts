import React from 'react';

import Action from './action';
import * as analyzer from './analyzer';

export interface State {
    analyzer: analyzer.AnalyzerState;
}

export const initialState = {
    analyzer: analyzer.initialState,
};

export interface StateContextType {
    dispatch: (_: Action) => void;
    state: State;
}

export const StateContext = React.createContext<StateContextType>({
    dispatch: (_: Action) => null,
    state: initialState,
})
