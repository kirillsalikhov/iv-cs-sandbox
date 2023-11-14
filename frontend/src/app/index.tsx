import React from 'react';
import { ReactElement } from 'react';
import { Viewer } from './Viewer';
import { createRoot } from 'react-dom/client';

function App(): ReactElement {
    const vref = React.useMemo(() => React.createRef<Viewer>(), []);

    React.useEffect(() => {
        const { current: viewer } = vref;
        if (viewer !== null) {
            viewer.load(new URL('../simple.zip', import.meta.url).toString());
        }
    }, []);

    return (
        <Viewer ref={vref}/>
    )
}

const reactRoot = createRoot(document.getElementById('react-root') as HTMLDivElement);
reactRoot.render(<App />);
