import {ReactNode} from "react";
import { NodeRendererProps, Tree } from "react-arborist";

interface NodeData {
    _id: number;
    originalName: string;
}

function Node({ node, style, dragHandle }: NodeRendererProps<NodeData>): ReactNode {
    /* This node instance can do many things. See the API reference. */
    return (
        <div style={style} ref={dragHandle}>
            {node.isLeaf ? "🍁" : "🗀"}
            {node.data.originalName}
        </div>
    );
}

interface HierarchyProps {
    data: any;
}

export function Hierarchy({data}: HierarchyProps): ReactNode {
    return (
        <div className={'absolute inset-y-16 left-16 w-1/4 border bg-white bg-opacity-50'}>
            <Tree<NodeData>
                initialData={data}
                idAccessor={(node) => node._id.toString()}>
                {Node}
            </Tree>
        </div>
    );
}
