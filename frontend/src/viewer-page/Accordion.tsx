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
        <div className={'grid border-b border-gray-300'}>
            <div
                className={'py-2 px-4 flex justify-between bg-gray-200 cursor-pointer'}
                onClick={onSwitch}
            >
                <span>{title}</span>
                <span>{opened ? '^' : '>'}</span>
            </div>
            <div className={'w-full break-words'} style={{ display }}>
                {children}
            </div>
        </div>
    );
}