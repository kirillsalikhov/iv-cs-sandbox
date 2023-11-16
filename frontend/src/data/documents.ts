import { backendIsAvailable } from './runtime-environment.ts';

export interface DocumentData {
    id: number;
    name: string;
    status: 'failed' | 'inProgress' | 'finished';
}

export const documentsStub: DocumentData[] = [
    {id: 1, name: 'file-1.ifc', status: 'finished'},
    {id: 2, name: 'file-2.ifc', status: 'finished'},
    {id: 3, name: 'file-3-failed.ifc', status: 'failed'},
    {id: 4, name: 'file-4.ifc', status: 'inProgress'},
];

export const DOCUMENT_URL = '/api/documents';

export async function loadDocuments(): Promise<DocumentData[]> {
    if (!backendIsAvailable()) {
        return documentsStub;
    }

    const response = await fetch(DOCUMENT_URL);
    if (response.ok) {
        return await response.json() as DocumentData[];;
    }

    throw new Error(`Error ${response.status}`);
}
