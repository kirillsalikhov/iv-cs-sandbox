import WofDB from '@wg/objects-db';
import { ObjectInfo, ObjectProps } from '../viewer-page/ObjectDetails.tsx';

const exceptions = ['_id', 'children'];

export async function getObjectDetails(id: number, db: WofDB): Promise<ObjectInfo> {
    const response = await db.request([id]);
    const { Name: name, ...props } = response[0];

    const properties: ObjectProps = {};
    for (const [n, v] of Object.entries(props)) {
        if (exceptions.includes(n)) { continue; }
        properties[n] = JSON.stringify(v);
    }

    return {
        name: String(name),
        properties
    }
}
