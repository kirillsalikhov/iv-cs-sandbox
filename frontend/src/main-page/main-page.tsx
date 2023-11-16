import { useEffect, useState } from 'react';
import { DocumentData, loadDocuments } from '../data/documents';

export interface DocumentCardProps {
    document: DocumentData;
}

const statusBadges = {
    failed: 'rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10',
    inProgress: 'rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 not-italic ring-1 ring-inset ring-gray-500/10 ',
    finished: 'hidden',
}
const docStyles = {
    failed: 'text-red-900',
    inProgress: 'text-gray-500 italic',
    finished: 'font-medium'
}

function classNames(...classes: (string | null | undefined | false)[]) {
    return classes.filter(Boolean).join(' ')
}

function DocumentCard({ document: { name, status } }: DocumentCardProps) {
    return (
        <div className="flex items-center p-4 gap-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex w-full h-6 gap-2 ">
                <div className={classNames(statusBadges[status], 'flex-none sm:order-last')}>{status}</div>
                <div className={classNames(docStyles[status], 'flex-grow overflow-hidden text-ellipsis ')}>{name}</div>
            </div>
            <button type="button" title="Download source file" className="flex flex-none items-center rounded bg-white hover:bg-gray-100 text-gray-400 text-sm hover:text-gray-800 leading-5 p-2.5 gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <div className="hidden sm:block">Source</div>
            </button>
            <button type="button" title="Delete file" className="flex-none items-center rounded bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-800 leading-5 p-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>
        </div>
    )
}

export function MainPage() {
    const [documents, setDocuments] = useState<DocumentData[]>([]);

    useEffect(() => {
        loadDocuments().then((result) => setDocuments(result));
    }, []);

    return (
        <div className="bg-white h-screen">
            <div className="container m-auto max-w-screen-2xl grid grid-cols-12">
                {/* Upload panel */}
                <div className="col-span-full h-min m-4 bg-white rounded border border-gray-200 p-4 md:col-span-4 md:order-last md:mr-8">
                    <div className="block mb-6 font-medium text-lg">Add file</div>
                    <input className="block w-full h-10 mb-4 p-1 items-center text-gray-500 rounded border border-gray-300 cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none" id="file_input" type="file">
                    </input>
                    <select
                        className="block w-full h-10 mb-6 py-1.5 px-2 rounded border border-gray-300 cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none "
                        defaultValue="IFC to WMD">
                        <option>IFC to WMD options </option>
                        <option>IFC to WMD </option>
                    </select>
                    <button
                        type="button"
                        className="w-full h-10 rounded bg-blue-700 hover:bg-blue-600 px-2.5 py-1.5 text-white focus-outline-none"
                    >
                        Convert
                    </button>
                </div>


                {/* Documents */}
                <div className="col-span-full min-w-fit m-4 bg-white rounded border border-gray-200 md:col-span-8 md:ml-8 ">
                    <div className="h-[18rem] overflow-y-scroll divide-y divide-gray-200 md:p-4">
                        {documents.map((document) => <DocumentCard key={document.id} document={document} />)}
                    </div>


                    {/* Pagination */}
                    <div className="flex border-t border-gray-300 p-4"
                         aria-label="Pagination"
                    >
                        <div className="flex w-full items-center gap-4 justify-between md:justify-end">
                            <div className="hidden text-xs text-gray-700 md:block ">
                                1-10 of 20
                            </div>
                            <a
                                href="#"
                                className="relative inline-flex items-center rounded-md bg-white p-2.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="relative inline-flex items-center rounded-md bg-white p-2.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}