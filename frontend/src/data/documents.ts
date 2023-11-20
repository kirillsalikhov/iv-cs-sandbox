import axios from 'axios';

export interface DocumentData {
    id: number;
    name: string;
    status: 'failed' | 'inProgress' | 'finished';
}

const documentsStub: DocumentData[] = [
    {id: 1, name: 'file-1.ifc', status: 'finished'},
    {id: 2, name: 'file-2.ifc', status: 'finished'},
    {id: 3, name: 'file-3-failed.ifc', status: 'failed'},
    {id: 4, name: 'file-4.ifc', status: 'inProgress'},
];

export enum ConversionType {
    IFC_2_WMD_Optimized = 'ifc2wmdOpt',
    IFC_2_WMD = 'ifc2wmd'
}

export class DocumentsAPI {
    static readonly DOCUMENTS_URL = '/api/documents';

    private _documents: Map<number, DocumentData>;
    private _serverIsAvailable: boolean;

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
    }

    get list(): DocumentData[] {
        return [...this._documents.values()];
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

        await axios.post('/api/documents/convert', form);
        await this._syncDocuments();
    }

    async delete(id: number): Promise<void> {
        if (!this._serverIsAvailable) {
            this._documents.delete(id);
            return;
        }

        try {
            await axios.delete(`${DocumentsAPI.DOCUMENTS_URL}/${id}`);
            await this._syncDocuments();
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
        return (await axios.post('api/files/create-upload')).data as string;
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

    private async _syncDocuments(): Promise<void> {
        const response = await axios.get(DocumentsAPI.DOCUMENTS_URL);
        const documents = response.data as DocumentData[];

        if (documents) {
            this._documents.clear();
            for (const doc of documents) {
                this._documents.set(doc.id, doc);
            }

            this.onUpdateDocuments();
        }
    }
}
