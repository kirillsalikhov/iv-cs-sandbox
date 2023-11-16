export interface DocumentData {
    id: number;
    name: string;
    status: 'failed' | 'inProgress' | 'finished';
}

export const documents: DocumentData[] = [
    {id: 1, name: 'file-1.ifc', status: 'finished'},
    {id: 2, name: 'file-2.ifc', status: 'finished'},
    {id: 3, name: 'file-3-failed.ifc', status: 'failed'},
    {id: 4, name: 'file-4.ifc', status: 'inProgress'},
];

