import { ReactNode } from 'react';

export type ObjectProperty = ObjectPropertyValue | ObjectPropertyGroup;

export interface ObjectPropertyValue {
    type: 'value';
    name: string;
    value: number | string | boolean;
}

export interface ObjectPropertyGroup {
    type: 'group';
    name: string;
    children: ObjectProperty[];
}

export interface ObjectDetailsProps {
    title: string;
    properties: ObjectProperty[];
}

export interface AccordionProps {
    title: string;
    isOpened: boolean;
    onSwitch: () => void;
    children: ReactNode | ReactNode[];
}

function ObjectDetailsBody({ properties, depth = 1 }: { depth?: number; properties: ObjectProperty[] }): ReactNode {
    return properties.map((prop, i) => {
        const key = `${prop.name}:${i}:${depth}`;
        const paddingLeft = depth + 'rem';

        if (prop.type === 'value') {
            return (
                <li key={key} className={'flex border border-gray'}>
                    <div className={'py-2 w-1/2 border-r border-gray'} style={{ paddingLeft }}>{prop.name}</div>
                    <div className={'py-2 px-4 w-1/2 break-words'}>{prop.value}</div>
                </li>
            );
        }

        return (
            <li key={key} className={'grid border-b border-gray'}>
                <div className={'py-2 whitespace-nowrap bg-gray-200'} style={{ paddingLeft }}>{prop.name}</div>
                <div className={'w-full break-words'}>
                    <ObjectDetailsBody depth={depth + 1} properties={prop.children} />
                </div>
            </li>
        );
    });
}

export function ObjectDetails({ title, properties }: ObjectDetailsProps): ReactNode {
    return (
        <div className={'absolute w-1/3 right-16 top-16 bg-white border border-black'}>
            <h1 className={'p-4 border-b border-black'}>{title}</h1>
            <ul className={'max-h-96 overflow-y-scroll'}>
                <ObjectDetailsBody properties={properties} />
            </ul>
        </div>
    );
}
