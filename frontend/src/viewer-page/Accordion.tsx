import { ReactNode, useCallback, useState } from 'react';
import { ArrowIcon } from './ArrowIcon.tsx';
import './Accordion.css';

export interface AccordionProps {
    title: string;
    children: ReactNode | ReactNode[];
}

export function Accordion({ title, children }: AccordionProps): ReactNode {
    const [opened, setOpened] = useState(true);
    const onSwitch = useCallback(() => setOpened(!opened), [opened]);
    const display = opened ? 'block' : 'none';

    return (
        <div className={'accordion'}>
            <div
                className={'accordion__title'}
                onClick={onSwitch}
            >
                <span>{title}</span>
                <ArrowIcon direction={ opened ? 'down' : 'right' } />
            </div>
            <div className={'accordion__content'} style={{ display }}>
                {children}
            </div>
        </div>
    );
}
