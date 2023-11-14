import {ReactNode} from "react";

export interface ObjectInfo {
    name: string;
    properties: { [key: string]: number | string; }
}

export interface ObjectDetailsProps {
    info: ObjectInfo;
}

export function ObjectDetails({ info }: ObjectDetailsProps): ReactNode {
    return (
        <div className={'absolute w-1/4 right-16 top-16 bg-white border border-black'}>
            <h1 className={'p-4 border-b border-black'}>{info.name}</h1>
            <ul>
                {Object.entries(info.properties).map(([pname, pvalue]) => {
                    return (
                        <li key={pname} className={'flex border-b border-gray'}>
                            <div className={'py-2 px-4 w-1/2 border-r border-gray'}>{pname}</div>
                            <div className={'py-2 px-4'}>{pvalue}</div>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}
