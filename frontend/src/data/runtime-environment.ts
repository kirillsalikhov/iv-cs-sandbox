import { DocumentData } from './documents';

export const backendIsAvailable = () => location.port === '3050';

export interface ForBrowser {
    documents: DocumentData[];
    modelUrl: string;
}

declare global {
    var forBrowser: ForBrowser | undefined;
}