import React from 'react';
import ReactDOM from 'react-dom';
import { ReactElement } from 'react';
import { Viewer } from './Viewer';

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

ReactDOM.render(<App />, document.body);