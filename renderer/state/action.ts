export type ActionType = 'analyzer_start' | 'analyzer_update';

export default interface Action {
    type: ActionType
    payload?: Record<string, any>
}
