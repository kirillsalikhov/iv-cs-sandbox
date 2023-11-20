import { ReactNode, useCallback, useState } from 'react';

export interface AccordionProps {
    title: string;
    children: ReactNode | ReactNode[];
}

export function Accordion({ title, children }: AccordionProps): ReactNode {
    const [opened, setOpened] = useState(true);
    const onSwitch = useCallback(() => setOpened(!opened), [opened]);
    const display = opened ? 'block' : 'none';

    return (
        <div className={'grid border-t border-gray-200'}>
            <div
                className={'flex justify-between items-center pl-4 h-10 text-sm text-gray-600 hover:text-black font-medium leading-6 bg-gray-100  cursor-pointer'}
                onClick={onSwitch}
            >
                <span>{title}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${opened ? null : '-rotate-90'} w-5 h-5 m-2.5`}>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
            </div>
            <div className={'w-full break-words'} style={{ display }}>
                {children}
            </div>
        </div>
    );
}