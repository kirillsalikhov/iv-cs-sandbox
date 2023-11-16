import WofDB from '@wge/objects-db';
import { ObjectDetailsProps, ObjectPropertyGroup, ObjectPropertyValue } from '../viewer-page/ObjectDetails';

const fieldsToIgnore = ['_id', 'children'];
function isObject(v: unknown): boolean {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
};

function getPlainChildList(parent: string, content: object, depth: number = 0): ObjectPropertyValue[] {
    const children: ObjectPropertyValue[] = [];

    for (const [child, val] of Object.entries(content)) {
        if (fieldsToIgnore.includes(child)) { continue; }

        const name = depth ? `${parent} ${child}` : child;
        if (isObject(val)) {
            children.push(...getPlainChildList(name, val, depth + 1));
        } else {
            children.push({ name, value: JSON.stringify(val, null, 4) });
        }
    }

    return children;
}

function gatherObjectProps(source: object): { values: ObjectPropertyValue[]; groups: ObjectPropertyGroup[] } {
    const values: ObjectPropertyValue[] = [];
    const groups: ObjectPropertyGroup[] = [];

    for (const [name, val] of Object.entries(source)) {
        if (fieldsToIgnore.includes(name)) { continue; }
        if (isObject(val)) {
            groups.push({ name, children: getPlainChildList(name, val) })
        } else {
            values.push({ name, value: JSON.stringify(val, null, 4) })
        }
    }

    return { values, groups };
}

export async function getObjectDetails(id: number, db: WofDB): Promise<ObjectDetailsProps> {
    const response = await db.request([id]);
    const { Name, ...restProps } = response[0];
    const { values, groups } = gatherObjectProps(restProps);

    return { title: String(Name), values, groups };
}
