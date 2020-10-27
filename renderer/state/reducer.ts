/**
 * This file descibes how the application state changes based on actions
 */
import Action from './action';
import { State } from '.';

/**
 * An analyzation has been initiated
 * @param state
 * @param action
 */
function startAnalyzer(state: State, action: Action): State {
    return {
        ...state,
        analyzer: {
            completed: 0,
            errors: [],
            running: true,
            tasks: action.payload.soundfiles,
        },
    };
}

/**
 * Data from the analyzer has been received
 * @param state
 * @param action
 */
function updateAnalyzer(state: State, action: Action): State {
    const errors = [...state.analyzer.errors];
    if (action.payload.error) {
        errors.push({ error: action.payload.error, filename: action.payload.result.filename });
    }

    return {
        ...state,
        analyzer: {
            completed: state.analyzer.completed + 1,
            errors,
            latest: action.payload.result.filename,
            running: !action.payload.done,
            tasks: state.analyzer.tasks,
        },
    };
}

/**
 * A fetch sounds request has been initiated
 * @param state
 * @param action
 */
function fetchSoundsRequest(state: State, _action: Action): State {
    return {
        ...state,
        sounds: {
            data: [],
            error: '',
            fetching: true,
        },
    };
}

/**
 * A response from the DB has been received
 * @param state
 * @param action
 */
function fetchSoundsResponse(state: State, action: Action): State {
    return {
        ...state,
        sounds: {
            data: action.payload.results,
            error: action.payload.error,
            fetching: false,
        },
    };
}

/**
 * Main top-level application reducer
 * @param state
 * @param action
 */
export default function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'analyzer_start':
            return startAnalyzer(state, action);
        case 'analyzer_update':
            return updateAnalyzer(state, action);
        case 'fetch_sounds_request':
            return fetchSoundsRequest(state, action);
        case 'fetch_sounds_response':
            return fetchSoundsResponse(state, action);
        default:
            return state;
    }
}
