import { ConversionType, DocumentData, DocumentsAPI } from '../data/documents.js';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

function Upload({ api }: { api: DocumentsAPI }) {
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
    }, [file, conversionType]);

    return (
        <div className="col-span-full h-min m-4 bg-white rounded border border-gray-200 p-4 md:col-span-4 md:order-last md:mr-8">
            <div className="block mb-6 font-medium text-lg">Add file</div>
            <input
                className="block w-full h-10 mb-4 p-1 items-center text-gray-500 rounded border border-gray-300 cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none"
                id="file_input"
                type="file"
                onChange={onChangeFile}
                ref={inputRef}
            >
            </input>
            <select
                className="block w-full h-10 mb-6 py-1.5 px-2 rounded border border-gray-300 cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none "
                defaultValue={conversionType}
                onChange={onChangeSelect}
            >
                <option value={ConversionType.IFC_2_WMD_Optimized}>IFC to WMD options </option>
                <option value={ConversionType.IFC_2_WMD}>IFC to WMD </option>
            </select>
            <button
                type="button"
                className="w-full h-10 rounded bg-blue-700 hover:bg-blue-600 px-2.5 py-1.5 text-white focus-outline-none"
                disabled={isUploading}
                onClick={onClickConversion}
                style={{ opacity: isUploading ? 0.5 : 1 }}
            >
                {isUploading ? 'Uploading...' : 'Convert'}
            </button>
        </div>
    )
}

export interface DocumentCardProps {
    document: DocumentData;
    link: string;
    onDelete: (id: number) => void;
    onDownload: (id: number) => void;
}

function classNames(...classes: (string | null | undefined | false)[]) {
    return classes.filter(Boolean).join(' ')
}

function DocumentCard({ document, link, onDelete, onDownload }: DocumentCardProps) {
    return (
        <div className="flex items-center p-4 gap-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex w-full h-6 gap-2 ">
                <div className={classNames(`badge--${document.status}`, 'flex-none sm:order-last')}>{document.status}</div>
                <a className={classNames(`docStyle--${document.status}`, 'flex-grow overflow-hidden text-ellipsis ')} href={link}>{document.name}</a>
            </div>
            <button
                type="button"
                title="Download source file"
                className="flex flex-none items-center rounded bg-white hover:bg-gray-100 text-gray-400 text-sm hover:text-gray-800 leading-5 p-2.5 gap-1"
                onClick={() => onDownload(document.id)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <div className="hidden sm:block">Source</div>
            </button>
            <button
                type="button"
                title="Delete file"
                className="flex-none items-center rounded bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-800 leading-5 p-2.5"
                onClick={() => onDelete(document.id)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
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
    }, []);

    const onDelete = useCallback((id: number) => documentsAPI.delete(id), []);
    const onDownload = useCallback((id: number) => documentsAPI.download(id), []);

    return (
        <div className="bg-white h-screen">
            <div className="container m-auto max-w-screen-2xl grid grid-cols-12">


                {/* Heading */}
                <div className="col-span-full m-4 md:m-8">
                    <h1>Root page (delete this heading)</h1>
                </div>


                {/* Upload panel */}
                <Upload api={documentsAPI} />


                {/* Documents */}
                <div className="col-span-full min-w-fit m-4 bg-white rounded border border-gray-200 md:col-span-8 md:ml-8 ">
                    <div className="divide-y divide-gray-200 md:p-4">
                        {documents.map((document) => (
                            <DocumentCard
                                key={document.id}
                                link={documentsAPI.getLink(document.id)}
                                document={document}
                                onDelete={onDelete}
                                onDownload={onDownload}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
