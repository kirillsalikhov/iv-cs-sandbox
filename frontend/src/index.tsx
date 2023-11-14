import { createRef, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { Viewer } from './Viewer.tsx';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Hierarchy } from './Hierarchy.tsx';
import { createHierarchyData, HierarchyData } from './hierarchy-data.ts';

function App(): ReactElement {
    const vref = useMemo(() => createRef<Viewer>(), []);
    const [hierarchyData, setHierarchyData] = useState<HierarchyData[]>([]);
    const [hierarchyLoaded, setHierarchyLoaded] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(-1);

    //note: this is an ugly workaround for react-arborist triggering onSelect even when the select is caused by changing selection prop.
    //      other virtualized trees likely don't need this hack
    const internalState = useRef({muteArboristOnSelect: false});

    useEffect(() => {
        const { current: viewer } = vref;
        if (viewer !== null) {
            viewer.load(new URL('./simple.zip', import.meta.url).toString())
                .then(() => createHierarchyData(viewer.db))
                .then((data) => {
                    setHierarchyData(data);
                    setHierarchyLoaded(true);
                });
        }
    }, []);

    return (
        <>
            <Viewer selectedId={selectedId}
                    onClickObject={(id) => {
                        internalState.current.muteArboristOnSelect = true;
                        setSelectedId(id);
                    }}
                    ref={vref}/>
            {hierarchyLoaded && <Hierarchy data={hierarchyData}
                                           selectedId={selectedId}
                                           onSelectNode={(id) => {
                                               if (internalState.current.muteArboristOnSelect) {
                                                   if (id === selectedId) {
                                                       internalState.current.muteArboristOnSelect = false;
                                                   }
                                               } else {
                                                   setSelectedId(id);
                                               }
                                           }}/>}
        </>
    )
}

const reactRootElement = document.getElementById('react-root') as HTMLDivElement;
const reactRoot = createRoot(reactRootElement);
reactRoot.render(<App />);
