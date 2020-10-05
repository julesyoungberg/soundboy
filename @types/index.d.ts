declare module 'audio-loader';

declare module 'rebass';

declare module '@rebass/preset';

interface Sound {
    filename: string;
    instrument?: string;
}

interface AnalyzerMessage {
    done?: boolean;
    error?: string;
    result?: Sound;
}

interface SoundsMessage {
    error?: string;
    results?: Sound[];
}

interface IPCRequest {
    responseChannel?: string;
    params?: string[];
}
