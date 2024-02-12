import WofDB from '@wge/objects-db';
import { ObjectDetailsProps, ObjectPropertyGroup, ObjectPropertyValue } from '../viewer-page/Attributes.tsx';

const fieldsToIgnore = ['_id', 'children'];
function isObject(v: unknown): boolean {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}

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

export interface DBAttribute {
    GlobalId: string;
    id: string;
    originalName: string;
    parent_id: string;
}

export interface ExtendedAttribute extends DBAttribute {
    [key: string]: unknown
}

export type AttributesMap = Map<string, ExtendedAttribute>;

export async function getObjectAttributes(id: number, attrmap: AttributesMap, db: WofDB): Promise<ObjectDetailsProps> {
    const dbAttr = (await db.request([id]))[0] as unknown as DBAttribute;

    const attribute = attrmap.get(dbAttr.id);
    if (attribute === undefined) {
        return { title: dbAttr.originalName, values: [], groups: [] };
    }

    const { originalName, ...restProps } = attribute;
    const { values, groups } = gatherObjectProps(restProps);

    return { title: originalName, values, groups };
}

export async function loadAttributesMap(url: string): Promise<AttributesMap> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error();
    }

    const attributes: AttributesMap = new Map();
    const attribArray = await response.json();
    for (const attr of attribArray) {
        attributes.set(attr.id, attr);
    }

    return attributes;
}
