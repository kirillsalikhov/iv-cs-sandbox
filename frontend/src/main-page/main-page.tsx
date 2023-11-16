import { useEffect, useState } from 'react';
import { DocumentData, loadDocuments } from '../data/documents';

export interface DocumentCardProps {
    document: DocumentData;
}

function DocumentCard({ document: { name, status } }: DocumentCardProps) {
    return (
        <div className="flex items-center p-4 gap-4">
            <div className="flex flex-grow font-bold">{name}</div>
            <div className="flex flex-none">{status}</div>
            <div className="flex flex-none bg-gray-200 p-2">Source Btn</div>
            <div className="flex flex-none bg-gray-300 p-2">Delete btn</div>
        </div>
    );
}

export function MainPage() {
    const [documents, setDocuments] = useState<DocumentData[]>([]);

    useEffect(() => {
        loadDocuments().then((result) => setDocuments(result));
    }, []);

    return (
        <div className=" bg-gray-100 h-screen">
            <div className="container m-auto grid grid-cols-12 gap-8">
                <div className="col-span-full mt-16">
                    <h1>Root page (delete this heading)</h1>
                </div>
                <div className="col-span-full h-min bg-white rounded-md shadow-md p-4 md:col-span-4 md:order-last">
                    <div className="block mb-4 text-center font-bold text-lg">Upload file</div>
                    <input className="block w-full border border-gray-300  cursor-pointer bg-gray-100 focus:outline-none" id="file_input" type="file">
                    </input>
                    <select
                        className="mt-4 block w-full py-1.5 px-2 border border-gray-300 hover:border-gray-400 focus:outline-none "
                        defaultValue="IFC to WMD">
                        <option>IFC to WMD options </option>
                        <option>IFC to WMD </option>
                    </select>
                    <button
                        type="button"
                        className="w-full mt-4 rounded-md bg-gray-800 px-2.5 py-1.5 font-semibold text-white shadow-sm hover:bg-gray-900 focus-outline-none"
                    >
                        Convert file
                    </button>
                </div>

                <div className="col-span-full bg-white rounded-md shadow-md md:col-span-8 ">
                    <div className="divide-y divide-gray-200">
                        {documents.map((document) => <DocumentCard key={document.id} document={document} />)}
                    </div>
                </div>
            </div>
        </div>
    )
}