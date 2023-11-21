import { createRef, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Viewer } from './Viewer.tsx';
import { createHierarchyData, HierarchyData } from '../data/hierarchy-data.ts';
import { AttributesExpand, AttributesPopup, ObjectDetailsProps } from './Attributes.tsx';
import { getModelURL } from '../data/models.ts';
import { getObjectAttributes } from '../data/attributes.ts';
import { HierarchyExpand, Hierarchy } from './Hierarchy.tsx';
import { CameraButtons } from './CameraButtons.tsx';

export function ViewerPage(): ReactElement {
    const vref = useMemo(() => createRef<Viewer>(), []);
    const [hierarchyData, setHierarchyData] = useState<HierarchyData[]>([]);
    const [hierarchyLoaded, setHierarchyLoaded] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(-1);
    const [allowMoveCamera, setAllowMoveCamera] = useState(true);
    const [details, setDetails] = useState<ObjectDetailsProps | null>(null);
    const [detailsExpanded, setDetailsExpanded] = useState(true);
    const [modelStructureExpanded, setModelStructureExpanded] = useState(window.innerWidth > window.innerHeight);

    //note: this is an ugly workaround for react-arborist triggering onSelect even when the select is caused by changing selection prop.
    //      other virtualized trees likely don't need this hack
    const internalState = useRef({muteArboristOnSelect: false, unmuteTimeout: -1});

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
    }, [vref]);

    useEffect(() => {
        const viewer = vref.current;
        if (!hierarchyLoaded || viewer === null) { return; }
        if (selectedId >= 0) {
            getObjectAttributes(selectedId, viewer.db).then((data) => setDetails(data));
        } else {
            setDetails(null);
        }
    }, [selectedId, hierarchyLoaded])

    const muteArborist = useCallback(() => {
        if (internalState.current.unmuteTimeout !== -1) {
            clearTimeout(internalState.current.unmuteTimeout)
        }
        internalState.current.muteArboristOnSelect = true;
        internalState.current.unmuteTimeout = setTimeout(() => {
            internalState.current.muteArboristOnSelect = false;
            internalState.current.unmuteTimeout = -1;
        }, 10);
    }, [])

    const handleViewerClickObject = useCallback((id: number) => {
        muteArborist();
        setSelectedId(id);
        setAllowMoveCamera(false);
    }, []);

    return (
        <>
            <Viewer selectedId={selectedId}
                    onClickObject={handleViewerClickObject}
                    allowMoveCamera={allowMoveCamera}
                    ref={vref} />
            { hierarchyLoaded &&
                <CameraButtons viewerRef={vref}></CameraButtons>
            }
            { details && !detailsExpanded &&
                <AttributesExpand onClick={() => setDetailsExpanded(true)} />
            }
            { hierarchyLoaded && !modelStructureExpanded &&
                <HierarchyExpand onClick={() => {
                                    muteArborist();
                                    setModelStructureExpanded(true);
                                 }} />
            }
            { details && detailsExpanded &&
                <AttributesPopup {...details} onClickClose={() => setDetailsExpanded(false)} />
            }
            { hierarchyLoaded && modelStructureExpanded &&
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
                    onClickClose={() => {
                        setModelStructureExpanded(false);
                    }}
                />
            }
        </>
    )
}

