import { createRef, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Viewer } from './Viewer.tsx';
import { createRoot } from 'react-dom/client';
import { Hierarchy } from './Hierarchy.tsx';
import { createHierarchyData, HierarchyData } from '../data/hierarchy-data.ts';
import { AttributesExpand, AttributesPopup, ObjectDetailsProps } from './Attributes.tsx';
import { getObjectAttributes } from '../data/attributes.ts';
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
    const [detailsExpanded, setDetailsExpanded] = useState(true);

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
            getObjectAttributes(selectedId, viewer.db).then((data) => setDetails(data));
        } else {
            setDetails(null);
        }
    }, [selectedId, hierarchyLoaded])

    const handleViewerClickObject = useCallback((id: number) => {
        internalState.current.muteArboristOnSelect = true;
        setSelectedId(id);
        setAllowMoveCamera(false);
        setTimeout(() => {
            internalState.current.muteArboristOnSelect = false;
        }, 10);
    }, []);

    return (
        <>
            <Viewer selectedId={selectedId}
                    onClickObject={handleViewerClickObject}
                    allowMoveCamera={allowMoveCamera}
                    ref={vref} />
            {
                hierarchyLoaded &&
                <Hierarchy
                    data={hierarchyData}
                    selectedId={selectedId}
                    onSelectNode={(id) => {
                        if (!internalState.current.muteArboristOnSelect) {
                            setAllowMoveCamera(true);
                            setSelectedId(id);
                            vref.current?.moveCameraToSelection();
                        }
                    }}
                />
            }
            {details && (
                detailsExpanded
                    ? <AttributesPopup {...details} onClickClose={() => setDetailsExpanded(false)} />
                    : <AttributesExpand onClick={() => setDetailsExpanded(true)} />
            )}
            {hierarchyLoaded && <CameraButtons viewerRef={vref}></CameraButtons>}
        </>
    )
}

const reactRootElement = document.getElementById('react-root') as HTMLDivElement;
const reactRoot = createRoot(reactRootElement);
reactRoot.render(<App />);
