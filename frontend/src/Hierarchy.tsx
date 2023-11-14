import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { NodeRendererProps, Tree } from "react-arborist";
import { HierarchyData } from './hierarchy-data.ts';

function Node({ node, style }: NodeRendererProps<HierarchyData>): ReactNode {
    const openClass = node.isOpen ? 'rotate-90' : 'rotate-0';
    const selectedClass = node.isSelected ? 'bg-gray-100' : '';
    return (
        <div style={style} className={`flex h-8 align-middle leading-8 ${selectedClass}`}>
            {node.isLeaf
                ? <div className={'h-8 w-8 align-middle leading-8'}></div>
                : <button className={`h-8 w-8 text-center align-middle leading-8 ${openClass}`} onClick={() => node.toggle()}>{'>'}</button>}
            <div className={'flex-1 h-8 leading-8 select-none'}>
                {node.data.originalName}
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

    return (
        <div className={'absolute inset-y-16 left-16 w-1/4 border bg-white bg-opacity-75'} ref={hierarchyElementRef}>
            <Tree
                data={data}
                idAccessor={(node) => node._id.toString()}
                disableMultiSelection={true}
                disableEdit={true}
                width={width}
                height={height}
                selection={selectedId.toString()}
                onSelect={onSelectNode && ((nodes): void => {
                    onSelectNode(
                        nodes.length > 0
                            ? nodes[0].data._id
                            : -1
                    );
                })}
                rowHeight={36}>
                {Node}
            </Tree>
        </div>
    );
}
