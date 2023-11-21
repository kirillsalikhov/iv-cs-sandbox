import { ConversionType, DocumentData, DocumentsAPI } from '../data/documents.js';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './main-page.css';
import { iconDelete, iconSource } from './icons.tsx';

function UploadPanel({ api }: { api: DocumentsAPI }) {
    const [conversionType, setConversionType] = useState<ConversionType>(ConversionType.IFC_2_WMD);
    const [isUploading, setUploading] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const resetFileInput = () => {
        const { current: fileInput } = inputRef;
        if (fileInput !== null) {
            fileInput.value = '';
            setFile(null);
        }
    }

    const onChangeSelect = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        setConversionType(event.target.value as ConversionType);
    }, []);

    const onChangeFile = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (files !== null) {
            setFile(files[0]);
        }
    }, []);

    const onClickConversion = useCallback(async () => {
        if (file === null || isUploading) { return; }

        setUploading(true);
        await api.convert(file, conversionType);
        setUploading(false);
        resetFileInput();
    }, [file, conversionType, api, isUploading]);

    return (
        <>
            <div className="upload__title">Add file</div>
            <input
                className="upload__input"
                id="file_input"
                type="file"
                onChange={onChangeFile}
                ref={inputRef}
            >
            </input>
            <select
                className="upload__select"
                defaultValue={conversionType}
                onChange={onChangeSelect}
            >
                <option value={ConversionType.IFC_2_WMD_Optimized}>IFC to WMD optimized</option>
                <option value={ConversionType.IFC_2_WMD}>IFC to WMD</option>
            </select>
            <button
                type="button"
                className="upload__button"
                disabled={isUploading}
                onClick={onClickConversion}
                style={{ opacity: isUploading ? 0.5 : 1 }}
            >
                {isUploading ? 'Uploading...' : 'Convert'}
            </button>
        </>
    );
}

export interface DocumentCardProps {
    document: DocumentData;
    onDelete: (id: number) => void;
}

function classNames(...classes: (string | null | undefined | false)[]) {
    return classes.filter(Boolean).join(' ')
}

function DocumentCard({ document, onDelete }: DocumentCardProps) {
    return (
        <div className="document-card">
            <div className="document-card__name-and-badge">
                <div className={classNames('document-card__badge', `document-card__badge--${document.status}`)}>{document.status}</div>
                <a
                    className={classNames('document-card__name', `document-card__name--${document.status}`)}
                    href={document.viewerLink}
                >{document.name}</a>
            </div>
            <a
                title="Download source file"
                className="document-card__source-button"
                href={document.sourceLink}>
                {iconSource}
                <div className="document-card__source-button-text">Source</div>
            </a>
            <button
                type="button"
                title="Delete file"
                className="document-card__delete-button"
                onClick={() => onDelete(document.id)}
            >
                {iconDelete}
            </button>
        </div>
    )
}

export function MainPage() {
    const [documents, setDocuments] = useState<DocumentData[]>([]);
    const documentsAPI = useMemo(() => new DocumentsAPI(), []);

    useEffect(() => {
        setDocuments(documentsAPI.list);
        documentsAPI.onUpdateDocuments = () => {
            setDocuments(documentsAPI.list);
        }
    }, [documentsAPI]);

    const onDelete = useCallback((id: number) => documentsAPI.delete(id), [documentsAPI]);

    return (
        <div className="main-page">
            <div className="main-page__container">
                <div className="main-page__upload">
                    <UploadPanel api={documentsAPI} />
                </div>

                <div className="main-page__documents">
                    <div className="divide-y divide-gray-200 md:p-4">
                        {documents.map((document) => (
                            <DocumentCard key={document.id} document={document} onDelete={onDelete} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
