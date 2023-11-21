import { MouseEventHandler, ReactNode, useLayoutEffect, useMemo, useRef, useState } from "react";
import { NodeApi, NodeRendererProps, Tree } from "react-arborist";
import { HierarchyData } from '../data/hierarchy-data.ts';
import { CloseButton } from './CloseButton.tsx';

function Node({ node, style }: NodeRendererProps<HierarchyData>): ReactNode {
    const openClass = node.isOpen ? 'rotate-90' : 'rotate-0';
    const selectedClass = node.isSelected ? 'bg-gray-100' : '';
    return (
        <div style={style} className={`flex h-10 align-middle text-sm text-gray-700 leading-10 hover:bg-gray-100 ${selectedClass}`}>
            {node.isLeaf
                ? <div className={'h-10 w-10 align-middle leading-10'}></div>
                : <button className={`h-10 w-10 align-middle leading-10 text-gray-500 hover:text-black hover:shadow-xs ${openClass}`}
                          onClick={() => node.toggle()}>
                    {
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 m-2.5">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                    }
                </button>
            }
            <div className={'flex-1 pr-2 py-2 leading-6 truncate hover:bg-gray-100 select-none'}>
                {node.data.originalName || '<empty name>'}
            </div>
        </div>
    );
}

export interface HierarchyProps {
    data: HierarchyData[];
    selectedId: number;
    onSelectNode?: (id: number) => void;
    onClickClose?: MouseEventHandler<HTMLButtonElement>;
}

export function Hierarchy({data, selectedId, onSelectNode, onClickClose}: HierarchyProps): ReactNode {
    const hierarchyElementRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        const el = hierarchyElementRef.current;
        if (el === null) {
            return;
        }
        setHeight(el.offsetHeight);
        setWidth(el.offsetWidth);

        const observer = new ResizeObserver(() => {
            setHeight(el.offsetHeight);
            setWidth(el.offsetWidth);
        });

        observer.observe(el);

        return () => {
            observer.unobserve(el);
        };
    }, []);

    const selectHandler = useMemo(() => onSelectNode && ((nodes: NodeApi<HierarchyData>[]): void => {
        onSelectNode(
            nodes.length > 0
                ? nodes[0].data._id
                : -1
        );
    }), [onSelectNode]);

    const idAccessor = useMemo(() => (node: HierarchyData): string => node._id.toString(), []);

    return (
        <div className={'absolute flex flex-col inset-y-4 left-4 w-1/4 min-w-[20rem] rounded shadow-[rgba(0,0,0,0.1)_0px_0px_8px_4px] bg-white'}>
            <div className={'flex items-center justify-between pl-4 border-b border-gray-300'}>
                <h2 className={'text-lg'}>Model structure</h2>
                <CloseButton onClick={onClickClose}/>
            </div>
            <div className={'flex-1 min-h-0'} ref={hierarchyElementRef}>
                <Tree
                    data={data}
                    idAccessor={idAccessor}
                    disableMultiSelection={true}
                    disableEdit={true}
                    width={width}
                    height={height}
                    openByDefault={false}
                    selection={selectedId.toString()}
                    onSelect={selectHandler}
                    rowHeight={40}>
                    {Node}
                </Tree>
            </div>
        </div>
    );
}

export interface ExpandHierarchyButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function HierarchyExpand({ onClick }:ExpandHierarchyButtonProps) {
    return (
        <button className={'absolute top-4 left-4 rounded shadow-[rgba(0,0,0,0.1)_0px_0px_8px_4px] bg-white p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-0'}
                onClick={onClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M7 9V12H10V13H7V17H10V18H6V13.4444V12.5556V9H7ZM4 5H20V8H4V5ZM11 14V11H18V14H11ZM11 19H18V16H11V19Z" fill="currentColor" />
            </svg>
        </button>
    );
}