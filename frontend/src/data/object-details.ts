import WofDB from '@wge/objects-db';
import { ObjectDetailsProps, ObjectProperty } from '../viewer-page/ObjectDetails';

const exceptions = ['_id', 'children'];
function isObject(v: unknown): boolean {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
};

function gatherObjectProps(source: object): ObjectProperty[] {
    const props: ObjectProperty[] = [];

    for (const [name, val] of Object.entries(source)) {
        if (exceptions.includes(name)) { continue; }
        if (isObject(val)) {
            props.push({ type: 'group', name, children: gatherObjectProps(val) });
        } else {
            props.push({ type: 'value', name, value: JSON.stringify(val, null, 4) })
        }
    }

    return props;
}

export async function getObjectDetails(id: number, db: WofDB): Promise<ObjectDetailsProps> {
    const response = await db.request([id]);
    const { Name, ...restProps } = response[0];
    const properties = gatherObjectProps(restProps);

    properties.sort((p) => p.type === 'group' ? 1 : -1);

    return { title: String(Name), properties };
}
