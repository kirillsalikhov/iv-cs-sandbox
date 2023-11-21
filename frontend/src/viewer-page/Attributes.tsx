import { MouseEventHandler, ReactNode } from 'react';
import { Accordion } from './Accordion';
import { CloseButton } from './CloseButton.tsx';

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
            <div className={'py-2 px-4 w-1/2 text-sm leading-6 text-gray-600'}>{prop.name}</div>
            <div className={'py-2 px-4 w-1/2 text-sm leading-6 break-words text-black'}>{prop.value}</div>
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
        <div className={'absolute w-1/3 right-4 top-4 min-w-[20rem] bg-white rounded shadow-[rgba(0,0,0,0.1)_0px_0px_8px_4px]'}>
            <div className="flex items-center justify-between pl-4 border-b border-gray-300">
                <h2 className={'text-lg truncate'}>{title}</h2>
                <CloseButton onClick={onClickClose} />
            </div>

            <div className={'max-h-96 overflow-y-scroll'}>
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
        <button className={'absolute right-4 top-4 items-center p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-0 bg-white rounded shadow-[rgba(0,0,0,0.1)_0px_0px_8px_4px]'}
                onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
        </button>
    )
}
