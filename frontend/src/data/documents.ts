import axios from 'axios';

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

export const DOCUMENTS_URL = '/api/documents';

export function getInitialDocuments(): DocumentData[] {
    if (window.forBrowser === undefined) {
        return documentsStub;
    }

    return window.forBrowser.documents;
}

export async function getDocuments(): Promise<DocumentData[] | null> {
    try {
        const response = await axios.get(DOCUMENTS_URL);
        return response.data as DocumentData[];
    } catch (err) {
        alert (err);
        return null;
    }
}

export function download(name: string, ext: string, data: string): void {
    const a = document.createElement('a');
    const file = new Blob([data], { type : 'plain/text' });
    a.href = URL.createObjectURL(file);
    a.download = `${name}.${ext}`;
    a.click();
}

export async function getDocumentSource(id: number): Promise<string | null> {
    try {
        const src = await axios.get(`${DOCUMENTS_URL}/${id}/source`);
        return src.data as string;
    } catch (err) {
        alert(err);
        return null;
    }
}

export async function downloadDocument(name: string, id: number) {
    const src = await getDocumentSource(id);
    if (src !== null) {
        download(name, 'ifc', src);
    }
}

export async function deleteDocument(id: number): Promise<boolean> {
    try {
        await axios.delete(`${DOCUMENTS_URL}/${id}`);
        return true;
    } catch (err) {
        alert(err);
        return false;
    }
}
