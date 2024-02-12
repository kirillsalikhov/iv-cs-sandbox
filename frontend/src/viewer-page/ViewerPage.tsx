import { createRef, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Viewer } from './Viewer.tsx';
import { createHierarchyData, HierarchyData } from '../data/hierarchy-data.ts';
import { AttributesExpand, AttributesPopup, ObjectDetailsProps } from './Attributes.tsx';
import { HierarchyExpand, Hierarchy } from './Hierarchy.tsx';
import { CameraButtons } from './CameraButtons.tsx';
import { fetchAttributeData } from '../data/attributes-data.ts';
import { getObjectDetailProps } from './attributes-utils.ts';
import { getModelURL } from '../data/models.ts';

export function ViewerPage(): ReactElement {
    const vref = useMemo(() => createRef<Viewer>(), []);
    const [hierarchyData, setHierarchyData] = useState<HierarchyData[]>([]);
    const [hierarchyLoaded, setHierarchyLoaded] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string>('');
    const [allowMoveCamera, setAllowMoveCamera] = useState(true);
    const [details, setDetails] = useState<ObjectDetailsProps | null>(null);
    const [detailsExpanded, setDetailsExpanded] = useState(true);
    const [modelStructureExpanded, setModelStructureExpanded] = useState(window.innerWidth > window.innerHeight);

    //note: this is an ugly workaround for react-arborist triggering onSelect even when the select is caused by changing selection prop.
    //      other virtualized trees likely don't need this hack
    const internalState = useRef({muteArboristOnSelect: false, unmuteTimeout: -1});

    useEffect(() => {
        const { current: viewer } = vref;
        if (viewer === null) { return; }

        const loadViewer = async () => {
            await viewer.load(getModelURL());
            const data = await createHierarchyData(viewer.db);
            setHierarchyData(data);
            setHierarchyLoaded(true);
        };

        loadViewer();
    }, [vref]);

    useEffect(() => {
        const viewer = vref.current;
        if (!hierarchyLoaded || viewer === null) { return; }
        if (selectedId) {
            fetchAttributeData(selectedId).then((data) => setDetails(getObjectDetailProps(data)));
        } else {
            setDetails(null);
        }
    }, [vref, selectedId, hierarchyLoaded])

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

    const handleClickViewerObject = useCallback((internalID: number) => {
        const viewer = vref.current;
        if (!viewer) { return; }

        muteArborist();
        setSelectedId(viewer.toGlobalID(internalID));
        setAllowMoveCamera(false);
    }, []);

    const handleClickHierarchy = useCallback((globalId: string) => {
        if (!internalState.current.muteArboristOnSelect) {
            setAllowMoveCamera(true);
            setSelectedId(globalId);
            vref.current?.moveCameraToSelection();
        }
    }, []);

    return (
        <>
            <Viewer selectedId={vref.current?.toInternalID(selectedId) ?? -1}
                    onClickObject={handleClickViewerObject}
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
                    onSelectNode={handleClickHierarchy}
                    onClickClose={() => {
                        setModelStructureExpanded(false);
                    }}
                />
            }
        </>
    )
}

