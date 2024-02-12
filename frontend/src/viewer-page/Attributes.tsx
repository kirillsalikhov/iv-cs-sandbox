import { MouseEventHandler, ReactNode } from 'react';
import { Accordion } from './Accordion';
import { IconButton } from './IconButton.tsx';
import { iconAttributes, iconClose } from './icons.ts';
import './Attributes.css';

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
    onClickClose?: MouseEventHandler<HTMLButtonElement>;
}

function Attributes({ values }: { values: ObjectPropertyValue[] }): ReactNode {
    return values.map((prop, i) => (
        <div key={`${prop.name}:${i}`} className={'flex border-t border-gray-100'}>
            <div className={'attributes-list__field-name'}>{prop.name}</div>
            <div className={'attributes-list__field-value'}>{prop.value}</div>
        </div>
    ));
}

function AttributeGroups({ groups }: { groups: ObjectPropertyGroup[] }): ReactNode {
    return groups.map((group, i) => (
        <Accordion key={`${group.name}:${i}`} title={group.name}>
            <Attributes values={group.children} />
        </Accordion>
    ));
}

export function AttributesPopup({ title, values, groups, onClickClose }: ObjectDetailsProps): ReactNode {
    return (
        <div className={'attributes-placement max-w-[50%] min-w-[20rem] attributes-base'}>
            <div className='attributes-popup__title'>
                <h2 className={'text-lg truncate'}>{title || '<empty name>'}</h2>
                <IconButton onClick={onClickClose} icon={iconClose} />
            </div>

            <div className={'attributes-popup__content'}>
                <Attributes values={values} />
                <AttributeGroups groups={groups} />
            </div>
        </div>
    );
}

export interface AttributesExpandProps {
    onClick: MouseEventHandler<HTMLButtonElement>
}

export function AttributesExpand({ onClick }: AttributesExpandProps): ReactNode {
    return (
        <div className={'attributes-placement attributes-base'}>
            <IconButton icon={iconAttributes}
                        onClick={onClick} />
        </div>
    )
}
