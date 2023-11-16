import { ReactNode } from 'react';
import { Accordion } from './Accordion';

export type ObjectProperty = ObjectPropertyValue | ObjectPropertyGroup;

export interface ObjectPropertyValue {
    name: string;
    value: number | string | boolean;
}

export interface ObjectPropertyGroup {
    name: string;
    children: ObjectPropertyValue[];
}

export interface ObjectDetailsProps {
    title: string;
    values: ObjectPropertyValue[];
    groups: ObjectPropertyGroup[];
}

function ObjectDetailsValues({ values }: { values: ObjectPropertyValue[] }): ReactNode {
    return values.map((prop, i) => (
        <div key={`${prop.name}:${i}`} className={'flex border border-gray'}>
            <div className={'py-2 px-4 w-1/2 border-r border-gray'}>{prop.name}</div>
            <div className={'py-2 px-4 w-1/2 break-words'}>{prop.value}</div>
        </div>
    ));
}

function ObjectDetailsGroups({ groups }: { groups: ObjectPropertyGroup[] }): ReactNode {
    return groups.map((group, i) => (
        <Accordion key={`${group.name}:${i}`} title={group.name}>
            <ObjectDetailsValues values={group.children} />
        </Accordion>
    ));
}

export function ObjectDetails({ title, values, groups }: ObjectDetailsProps): ReactNode {
    return (
        <div className={'absolute w-1/3 right-16 top-16 bg-white border border-black'}>
            <h1 className={'p-4 border-b border-black'}>{title}</h1>
            <div className={'max-h-96 overflow-y-scroll'}>
                <ObjectDetailsValues values={values} />
                <ObjectDetailsGroups groups={groups} />
            </div>
        </div>
    );
}
