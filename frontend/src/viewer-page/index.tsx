import { createRef, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { Viewer } from './Viewer.tsx';
import { createRoot } from 'react-dom/client';
import { Hierarchy } from './Hierarchy.tsx';
import { createHierarchyData, HierarchyData } from '../data/hierarchy-data.ts';
import { ObjectDetails, ObjectDetailsProps } from './ObjectDetails.tsx';
import { getObjectDetails } from '../data/object-details.ts';
import { CameraButtons } from './CameraButtons.tsx';
import { getModelURL } from '../data/models.ts';

import '../index.css';

function App(): ReactElement {
    const vref = useMemo(() => createRef<Viewer>(), []);
    const [hierarchyData, setHierarchyData] = useState<HierarchyData[]>([]);
    const [hierarchyLoaded, setHierarchyLoaded] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(-1);
    const [allowMoveCamera, setAllowMoveCamera] = useState(true);
    const [details, setDetails] = useState<ObjectDetailsProps | null>(null);

    //note: this is an ugly workaround for react-arborist triggering onSelect even when the select is caused by changing selection prop.
    //      other virtualized trees likely don't need this hack
    const internalState = useRef({muteArboristOnSelect: false});

    useEffect(() => {
        const { current: viewer } = vref;
        if (viewer !== null) {
            viewer.load(getModelURL())
                .then(() => createHierarchyData(viewer.db))
                .then((data) => {
                    setHierarchyData(data);
                    setHierarchyLoaded(true);
                });
        }
    }, []);

    useEffect(() => {
        const viewer = vref.current;
        if (!hierarchyLoaded || viewer === null) { return; }
        if (selectedId >= 0) {
            getObjectDetails(selectedId, viewer.db).then((data) => setDetails(data));
        } else {
            setDetails(null);
        }
    }, [selectedId, hierarchyLoaded])

    return (
        <>
            <Viewer selectedId={selectedId}
                    onClickObject={(id) => {
                        internalState.current.muteArboristOnSelect = true;
                        setSelectedId(id);
                        setAllowMoveCamera(false);
                        setTimeout(() => {
                            internalState.current.muteArboristOnSelect = false;
                        }, 10);
                    }}
                    allowMoveCamera={allowMoveCamera}
                    ref={vref}/>
            {
                hierarchyLoaded &&
                <Hierarchy
                    data={hierarchyData}
                    selectedId={selectedId}
                    onSelectNode={(id) => {
                        if (!internalState.current.muteArboristOnSelect) {
                            setAllowMoveCamera(true);
                            setSelectedId(id);
                        }
                    }}
                />
            }
            {details && <ObjectDetails {...details}/>}
            {hierarchyLoaded && <CameraButtons viewerRef={vref}></CameraButtons>}
        </>
    )
}

const reactRootElement = document.getElementById('react-root') as HTMLDivElement;
const reactRoot = createRoot(reactRootElement);
reactRoot.render(<App />);
