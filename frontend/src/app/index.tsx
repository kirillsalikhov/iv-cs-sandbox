import { createRef, ReactElement, useEffect, useMemo } from 'react';
import { Viewer } from './Viewer';
import { createRoot } from 'react-dom/client';

function App(): ReactElement {
    const vref = useMemo(() => createRef<Viewer>(), []);

    useEffect(() => {
        const { current: viewer } = vref;
        if (viewer !== null) {
            viewer.load(new URL('../simple.zip', import.meta.url).toString());
        }
    }, []);

    return (
        <>
            <Viewer ref={vref}/>
            <div className={'absolute inset-y-16 left-16 w-1/4 border bg-white bg-opacity-50'}></div>
        </>
    )
}

const reactRoot = createRoot(document.getElementById('react-root') as HTMLDivElement);
reactRoot.render(<App />);
