import WofDB from '@wg/objects-db';

interface DBRecord {
    _id: number;
    originalName: string;
    children?: number[];
}

export interface HierarchyData {
    _id: number;
    originalName: string;
    children: HierarchyData[];
}

export const createHierarchyData = async (db: WofDB): Promise<HierarchyData[]> => {
    const allDbRecords = await db.request(null, ['_id', 'originalName', 'children']) as unknown as DBRecord[];
    const objectById: Record<number, DBRecord> = {};
    const rootIds: Set<number> = new Set();

    for (const rec of allDbRecords) {
        objectById[rec._id] = rec;
        rootIds.add(rec._id);
    }

    for (const rec of allDbRecords) {
        if (!rec.children) { continue; }

        for (const childId of rec.children) {
            rootIds.delete(childId);
        }
    }

    function getBranch(id: number): HierarchyData {
        const obj = objectById[id];
        return {
            ...obj,
            children: obj.children ? obj.children.map(getBranch) : []
        }
    }

    return [...rootIds].map(getBranch);
};
