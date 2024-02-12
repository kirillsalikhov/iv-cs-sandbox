import axios from 'axios';

export interface DocumentInput {
    id: number;
    name: string;
    status: 'failed' | 'inProgress' | 'finished';
    attributes_file?: string | null;
    created_at: number;
}

export interface DocumentData extends DocumentInput {
    viewerLink: string;
    sourceLink: string;
    attribLink: string | null;
}

const documentsStub: DocumentInput[] = [
    { id: 1, name: 'file-1.ifc', status: 'finished', created_at: 0 },
    { id: 2, name: 'file-2.ifc', status: 'finished', created_at: 0 },
    { id: 3, name: 'file-3-failed.ifc', status: 'failed', created_at: 0 },
    { id: 4, name: 'file-4.ifc', status: 'inProgress', created_at: 0 },
];

export enum ConversionType {
    IFC_2_WMD_Optimized = 'ifc2wmdOpt',
    IFC_2_WMD = 'ifc2wmd',
    IFC_2_WMD_Optimized_node = 'ifc2wmdOpt_node',
    IFC_2_WMD_node = 'ifc2wmd_node'
}

declare global {
    interface Window {
        forBrowser?: {
            documents: DocumentInput[];
            modelUrl: string;
            attributesUrl: string | null;
        }
    }
}

export class DocumentsAPI {
    static readonly DOCUMENTS_URL = '/api/documents';
    static readonly FILES_URL = '/api/files';

    private _documents: Map<number, DocumentData>;
    private _serverIsAvailable: boolean;

    onUpdateDocuments = () => undefined;

    constructor() {
        const documents = new Map<number, DocumentData>();

        let serverIsAvailable = false;
        let docList: DocumentInput[] = [];
        if (window.forBrowser === undefined) {
            docList = documentsStub;
            console.warn('Standalone mode. Using static data.');
        } else {
            serverIsAvailable = true;
            docList = window.forBrowser.documents;
        }

        for (const doc of docList) {
            documents.set(doc.id, this._prepareDocument(doc));
        }

        this._documents = documents;
        this._serverIsAvailable = serverIsAvailable;

        const sse = new EventSource('/sse');
        sse.addEventListener('document_created', this._onUpdateDocument);
        sse.addEventListener('document_update', this._onUpdateDocument);
        sse.addEventListener('document_delete', this._onDeleteDocument);
    }

    get list(): DocumentData[] {
        return [...this._documents.values()].sort((p, n) => n.created_at - p.created_at);
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

    private _onUpdateDocument = async (event: MessageEvent) => {
        const id = Number(JSON.parse(event.data).id);
        const docInput = (await axios.get(`${DocumentsAPI.DOCUMENTS_URL}/${id}`)).data as DocumentInput;
        this._documents.set(id, this._prepareDocument(docInput));
        this.onUpdateDocuments();
    }

    private _onDeleteDocument = async (event: MessageEvent) => {
        const id = Number(JSON.parse(event.data).id);
        this._documents.delete(id);
        this.onUpdateDocuments();
    }

    private _prepareDocument(input: DocumentInput): DocumentData {
        const { DOCUMENTS_URL } = DocumentsAPI;
        const viewerLink = input.status === 'finished' ? `${input.id}/viewer`: '#';
        const sourceLink = `${DOCUMENTS_URL}/${input.id}/source`;
        const attribLink = input.attributes_file ? `${DOCUMENTS_URL}/${input.id}/attributes` : null;

        return { ...input, viewerLink, sourceLink, attribLink };
    }

    private _getKeyFromURL(url: string): string {
        return new URL(url).pathname.split('/')[2];
    }

    private async _getLoadingURL(): Promise<string> {
        return (await axios.post(`${DocumentsAPI.FILES_URL}/create-upload`)).data as string;
    }
}
