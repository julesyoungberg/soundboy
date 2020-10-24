import Action from './action';
import State from './state';

function startAnalyzer(state: State, action: Action): State {
    return {
        ...state,
        analyzer: {
            running: true,
            tasks: action.payload.soundfiles,
            completed: 0,
        },
    };
}

function updateAnalyzer(state: State, action: Action): State {
    return {
        ...state,
        analyzer: {
            running: !action.payload.done,
            tasks: state.analyzer.tasks,
            completed: state.analyzer.completed + 1,
            latest: action.payload.result.filename,
        },
    };
}

export default function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'analyzer_start':
            return startAnalyzer(state, action);
        case 'analyzer_update':
            return updateAnalyzer(state, action);
        default:
            return state;
    }
}
