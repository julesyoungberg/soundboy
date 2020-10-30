/**
 * This file describes the analyzer part of the state tree
 */
export interface AnalyzerError {
    message: string;
    filename?: string;
}

export interface AnalyzerState {
    completed: number;
    errors: AnalyzerError[];
    latest?: string;
    running: boolean;
    tasks: string[];
}

export const initialState: AnalyzerState = {
    completed: 0,
    errors: [],
    running: false,
    tasks: [],
};
