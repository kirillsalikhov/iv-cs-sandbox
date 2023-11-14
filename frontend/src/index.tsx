import { createRef, ReactElement, useEffect, useMemo, useState } from 'react';
import { Viewer } from './Viewer.tsx';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Hierarchy } from './Hierarchy.tsx';
import { createHierarchyData, HierarchyData } from './hierarchy-data.ts';

function App(): ReactElement {
    const vref = useMemo(() => createRef<Viewer>(), []);
    const [hierarchyData, setHierarchyData] = useState<HierarchyData[]>([]);
    const [hierarchyLoaded, setHierarchyLoaded] = useState<boolean>(false);

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
            <Viewer ref={vref}/>
            {hierarchyLoaded && <Hierarchy data={hierarchyData} />}
        </>
    )
}

const reactRootElement = document.getElementById('react-root') as HTMLDivElement;
const reactRoot = createRoot(reactRootElement);
reactRoot.render(<App />);
