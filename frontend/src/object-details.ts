import WofDB from '@wg/objects-db';
import { ObjectInfo, ObjectProps } from './ObjectDetails';

export async function getObjectDetails(id: number, db: WofDB): Promise<ObjectInfo> {
    const response = await db.request([id]);
    const { Name: name, ...props } = response[0];

    const properties: ObjectProps = {};
    for (const [n, v] of Object.entries(props)) {
        if (Array.isArray(v)) {
            properties[n] = `[${v.join(', ')}]`
        } else {
            properties[n] = String(v);
        }
    }

    return {
        name: String(name),
        properties
    }
}
