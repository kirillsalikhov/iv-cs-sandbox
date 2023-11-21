import { MouseEventHandler } from 'react';
import './IconButton.css'

export interface CloseButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    title?: string;
    icon: string;
}

export function IconButton({ onClick, icon, title }: CloseButtonProps) {
    return (
        <button
            type="button"
            className="icon-button"
            onClick={onClick}
            title={title}
            dangerouslySetInnerHTML={{__html: icon}}>
        </button>
    );
}
