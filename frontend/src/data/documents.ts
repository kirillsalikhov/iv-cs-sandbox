import axios from 'axios';

export interface DocumentData {
    id: number;
    name: string;
    status: 'failed' | 'inProgress' | 'finished';
    created_at: number;
}

const documentsStub: DocumentData[] = [
    { id: 1, name: 'file-1.ifc', status: 'finished', created_at: 0 },
    { id: 2, name: 'file-2.ifc', status: 'finished', created_at: 0 },
    { id: 3, name: 'file-3-failed.ifc', status: 'failed', created_at: 0 },
    { id: 4, name: 'file-4.ifc', status: 'inProgress', created_at: 0 },
];

export enum ConversionType {
    IFC_2_WMD_Optimized = 'ifc2wmdOpt',
    IFC_2_WMD = 'ifc2wmd'
}

declare global {
    interface Window {
        forBrowser?: {
            documents: DocumentData[];
            modelUrl: string;
        }
    }
}

export class DocumentsAPI {
    static readonly DOCUMENTS_URL = '/api/documents';
    static readonly FILES_URL = '/api/files';

    private _documents: Map<number, DocumentData>;
    private _serverIsAvailable: boolean;
    private _sse: EventSource;

    onUpdateDocuments = () => undefined;

    constructor() {
        const documents = new Map();

        let serverIsAvailable = false;
        let docList: DocumentData[] = [];
        if (window.forBrowser === undefined) {
            docList = documentsStub;
            console.warn('Your browser is offline');
        } else {
            serverIsAvailable = true;
            docList = window.forBrowser.documents;
        }

        for (const doc of docList) {
            documents.set(doc.id, doc);
        }

        this._documents = documents;
        this._serverIsAvailable = serverIsAvailable;

        const sse = new EventSource('/sse');
        sse.addEventListener('document_created', this._onUpdateDocument);
        sse.addEventListener('document_update', this._onUpdateDocument);
        sse.addEventListener('document_delete', this._onDeleteDocument);
        this._sse = sse;
    }

    private _onUpdateDocument = async (event: MessageEvent) => {
        const id = Number(JSON.parse(event.data).id);
        const document = (await axios.get(`${DocumentsAPI.DOCUMENTS_URL}/${id}`)).data;
        this._documents.set(id, document);
        this.onUpdateDocuments();
    }

    private _onDeleteDocument = async (event: MessageEvent) => {
        const id = Number(JSON.parse(event.data).id);
        this._documents.delete(id);
        this.onUpdateDocuments();
    }

    get list(): DocumentData[] {
        return [...this._documents.values()].sort((p, n) => n.created_at - p.created_at);
    }

    getLink(id: number): string {
        const document = this._documents.get(id);
        if (document !== undefined && document.status === 'finished') {
            return `${id}/viewer`;
        }
        return '#';
    }

    async convert(file: File, type: ConversionType): Promise<void> {
        if (!this._serverIsAvailable) {
            return;
        }

        const url = await this._getLoadingURL();
        await axios.put(url, file);

        const form = {
            fileKey: this._getKeyFromURL(url),
            fileName: file.name,
            conversionType: type
        };

        await axios.post(`${DocumentsAPI.DOCUMENTS_URL}/convert`, form);
    }

    async delete(id: number): Promise<void> {
        if (!this._serverIsAvailable) {
            this._documents.delete(id);
            return;
        }

        try {
            await axios.delete(`${DocumentsAPI.DOCUMENTS_URL}/${id}`);
        } catch (err) {
            alert(err);
        }
    }

    async download(id: number): Promise<void> {
        const document = this._documents.get(id);
        if (document === undefined) {
            alert(`Can't download non-existent document ${id}`);
            return;
        }

        const source = await this._getSource(id);
        if (source !== null) {
            this._saveOnDisk(document.name, source);
        }
    }

    private _getKeyFromURL(url: string): string {
        return new URL(url).pathname.split('/')[2];
    }

    private async _getLoadingURL(): Promise<string> {
        return (await axios.post(`${DocumentsAPI.FILES_URL}/create-upload`)).data as string;
    }

    private _saveOnDisk(name: string, data: string): void {
        const a = document.createElement('a');
        const file = new Blob([data], { type : 'plain/text' });
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
    }

    private async _getSource(id: number): Promise<string | null> {
        if (!this._serverIsAvailable) {
            alert(`Can't get document source ${id} because of offline`);
            return null;
        }

        try {
            const source = await axios.get(`${DocumentsAPI.DOCUMENTS_URL}/${id}/source`);
            return source.data as string;
        } catch (err) {
            alert(err);
            return null;
        }
    }
}
