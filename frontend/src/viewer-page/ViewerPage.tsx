import { createRef, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Viewer } from './Viewer.tsx';
import { createHierarchyData, HierarchyData } from '../data/hierarchy-data.ts';
import { AttributesExpand, AttributesPopup, ObjectDetailsProps } from './Attributes.tsx';
import { getViewerURL } from '../data/models.ts';
import { AttributesMap, getObjectAttributes, loadAttributesMap } from '../data/attributes.ts';
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
    const [attributes, setAttributes] = useState<AttributesMap | null>(null);

    //note: this is an ugly workaround for react-arborist triggering onSelect even when the select is caused by changing selection prop.
    //      other virtualized trees likely don't need this hack
    const internalState = useRef({muteArboristOnSelect: false, unmuteTimeout: -1});

    useEffect(() => {
        const { current: viewer } = vref;
        if (viewer === null) { return; }

        const url = getViewerURL();

        const loadAttributes = async () => {
            if (url.attributes) {
                const attribs = await loadAttributesMap(url.attributes);
                setAttributes(attribs);
            }
        }

        const loadViewer = async () => {
            await viewer.load(url.model);
            const data = await createHierarchyData(viewer.db);
            setHierarchyData(data);
            setHierarchyLoaded(true);
        };

        loadAttributes();
        loadViewer();
    }, [vref]);

    useEffect(() => {
        const viewer = vref.current;
        if (!hierarchyLoaded || viewer === null || attributes === null) { return; }
        if (selectedId >= 0) {
            getObjectAttributes(selectedId, attributes, viewer.db).then((data) => setDetails(data));
        } else {
            setDetails(null);
        }
    }, [vref, selectedId, attributes, hierarchyLoaded])

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

    const handleClickViewerObject = useCallback((id: number) => {
        muteArborist();
        setSelectedId(id);
        setAllowMoveCamera(false);
    }, []);

    const handleClickHierarchy = useCallback((id: number) => {
        if (!internalState.current.muteArboristOnSelect) {
            setAllowMoveCamera(true);
            setSelectedId(id);
            vref.current?.moveCameraToSelection();
        }
    }, []);

    return (
        <>
            <Viewer selectedId={selectedId}
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

