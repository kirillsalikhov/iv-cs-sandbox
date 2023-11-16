import { ReactNode, useLayoutEffect, useMemo, useRef, useState } from "react";
import { NodeApi, NodeRendererProps, Tree } from "react-arborist";
import { HierarchyData } from '../data/hierarchy-data.ts';

function Node({ node, style }: NodeRendererProps<HierarchyData>): ReactNode {
    const openClass = node.isOpen ? 'rotate-90' : 'rotate-0';
    const selectedClass = node.isSelected ? 'bg-gray-100' : '';
    return (
        <div style={style} className={`flex h-10 align-middle text-gray-700 leading-10 hover:bg-gray-100 ${selectedClass}`}>
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
            <div className={'flex-1 h-10 leading-10 hover:bg-gray-100 select-none'}>
                {node.data.originalName || '<empty name>'}
            </div>
        </div>
    );
}

export interface HierarchyProps {
    data: HierarchyData[];
    selectedId: number;
    onSelectNode?: (id: number) => void;
}

export function Hierarchy({data, selectedId, onSelectNode}: HierarchyProps): ReactNode {
    const hierarchyElementRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        const el = (hierarchyElementRef.current as HTMLDivElement);
        setHeight(el.offsetHeight);
        setWidth(el.offsetWidth);

        const observer = new ResizeObserver(() => {
            setHeight(el.offsetHeight);
            setWidth(el.offsetWidth);
        });

        observer.observe(el);
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
        <div className={'absolute inset-y-4 left-4 w-1/4 border border-gray-100 rounded shadow-xl bg-white'} ref={hierarchyElementRef}>
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
                rowHeight={36}>
                {Node}
            </Tree>
        </div>
    );
}
