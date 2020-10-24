export interface AnalyzerState {
    running: boolean;
    tasks: string[];
    completed: number;
    latest?: string;
}

export const initialState: AnalyzerState = {
    running: false,
    tasks: [],
    completed: 0,
};
