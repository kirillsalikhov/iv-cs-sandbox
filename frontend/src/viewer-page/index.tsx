import { createRoot } from 'react-dom/client';

import '../index.css';
import { ViewerPage } from './ViewerPage.tsx';

const reactRootElement = document.getElementById('react-root') as HTMLDivElement;
const reactRoot = createRoot(reactRootElement);
reactRoot.render(<ViewerPage />);
