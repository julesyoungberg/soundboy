/**
 * This file descibes how the application state changes based on actions
 */
import Action from './action';
import { initialState, State } from '.';
import type { NowPlaying } from './sounds';

/**
 * An analyzation has been initiated
 * @param state
 * @param action
 */
function startAnalyzer(state: State, action: Action): State {
    if (!action.payload?.soundfiles) {
        return state;
    }

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
    if (!action.payload) {
        return state;
    }

    const { done, error, result } = action.payload;
    let errors = [...state.analyzer.errors];

    if (error) {
        // remove previous errors for the same file
        errors = errors.filter((e) => !e.filename || e.filename !== error.filename);
        errors.push({
            message: error.message || error,
            filename: action.payload.result?.filename,
        });
    }

    return {
        ...state,
        analyzer: {
            ...state.analyzer,
            completed: state.analyzer.completed + 1,
            errors,
            latest: result?.filename,
            running: !done,
            tasks: state.analyzer.tasks,
        },
    };
}

/**
 * A fetch sounds request has been initiated
 * @param state
 * @param action
 */
function fetchSoundsRequest(state: State): State {
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
    if (!action.payload) {
        return state;
    }

    return {
        ...state,
        sounds: {
            data: action.payload.results,
            error: action.payload.error,
            fetching: false,
        },
    };
}

function toNowPlaying(payload: Action['payload'] = {}): NowPlaying {
    const { audio, sound } = payload;
    if (sound && audio) {
        return { audio, playing: true, sound };
    }
    return null;
}

function playSound(state: State, action: Action): State {
    const nextTrack = toNowPlaying(action.payload);
    const { audio, sound } = state.sounds.nowPlaying || {};
    if (audio && nextTrack.sound?._id !== sound?._id) {
        audio.stop();
    }
    return {
        ...state,
        sounds: {
            ...state.sounds,
            nowPlaying: nextTrack,
        },
    };
}

function stopSound(state: State, action: Action): State {
    const prevTrack = toNowPlaying(action.payload);
    const nowPlaying = state.sounds.nowPlaying;
    const { audio, sound } = nowPlaying;
    if (audio && prevTrack.sound?._id === sound?._id) {
        nowPlaying.playing = false;
    }
    return {
        ...state,
        sounds: {
            ...state.sounds,
            nowPlaying,
        },
    };
}

function clearSound(state: State, action: Action): State {
    const prevTrack = toNowPlaying(action.payload);
    const { audio, sound, playing } = state.sounds.nowPlaying || {};
    let nowPlaying = { audio, sound, playing };
    if (audio && prevTrack.sound?._id === nowPlaying.sound?._id) {
        nowPlaying = null;
    }
    return {
        ...state,
        sounds: {
            ...state.sounds,
            nowPlaying,
        },
    };
}

/**
 * Main top-level application reducer
 * @param state
 * @param action
 */
export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case 'analyzer_start':
            return startAnalyzer(state, action);
        case 'analyzer_update':
            return updateAnalyzer(state, action);
        case 'analyzer_dismiss':
            return {
                ...state,
                analyzer: initialState.analyzer,
            };
        case 'fetch_sounds_request':
            return fetchSoundsRequest(state);
        case 'fetch_sounds_response':
            return fetchSoundsResponse(state, action);
        case 'play_sound':
            return playSound(state, action);
        case 'stop_sound':
            return stopSound(state, action);
        case 'clear_sound':
            return clearSound(state, action);
        default:
            return state;
    }
}
