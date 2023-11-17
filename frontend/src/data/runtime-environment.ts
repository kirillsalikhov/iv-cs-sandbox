import { DocumentData } from './documents';

export const backendIsAvailable = () => location.port === '3050';

declare global {
    var forBrowser: { documents: DocumentData[] } | undefined;
}