import { MouseEventHandler } from 'react';

export interface CloseButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function CloseButton({ onClick }: CloseButtonProps) {
    return (
        <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-0"
            onClick={onClick}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    );
}
