import { MouseEventHandler, ReactNode, useLayoutEffect, useMemo, useRef, useState } from "react";
import { NodeApi, NodeRendererProps, Tree } from "react-arborist";
import { HierarchyData } from '../data/hierarchy-data.ts';
import { IconButton } from './IconButton.tsx';
import { iconClose, iconHierarchy } from './icons.ts';
import { ArrowIcon } from './ArrowIcon.tsx';
import './Hierarchy.css';

function Node({ node, style }: NodeRendererProps<HierarchyData>): ReactNode {
    const selectedClass = node.isSelected ? 'hierarchy-node--selected' : '';
    return (
        <div style={style} className={`hierarchy-node ${selectedClass}`}>
            {node.isLeaf
                ? <div className={'h-10 w-10 align-middle leading-10'}></div>
                : <ArrowIcon direction={node.isOpen ? 'down' : 'right'}
                             onClick={(event) => {
                                 node.toggle();
                                 event.stopPropagation();
                             }} />
            }
            <div className={'hierarchy-node__title'}>
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
        <div className={'hierarchy'}>
            <div className={'hierarchy__title-row'}>
                <h2 className={'text-lg'}>Model structure</h2>
                <IconButton onClick={onClickClose} icon={iconClose} />
            </div>
            <div className={'hierarchy__content'} ref={hierarchyElementRef}>
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
        <div className={'hierarchy-expand'}>
            <IconButton icon={iconHierarchy}
                        onClick={onClick}/>
        </div>
    );
}