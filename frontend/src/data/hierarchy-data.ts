import WofDB from '@wge/objects-db';

interface DBRecord {
    _id: number;
    GlobalId: string;
    originalName: string;
    children?: number[];
}

export interface HierarchyData {
    globalId: string;
    originalName: string;
    children?: HierarchyData[];
}

export const createHierarchyData = async (db: WofDB): Promise<HierarchyData[]> => {
    const allDbRecords = await db.request(null, ['_id', 'GlobalId', 'originalName', 'children']) as unknown as DBRecord[];
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
        const result: HierarchyData = {
            globalId: obj.GlobalId,
            originalName: obj.originalName
        };

        if (obj.children !== undefined && obj.children.length !== 0) {
            result.children = obj.children.map(getBranch);
        }

        return result;
    }

    return [...rootIds].map(getBranch);
};
