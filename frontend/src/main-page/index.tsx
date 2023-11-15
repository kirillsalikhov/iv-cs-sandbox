import { createRoot } from 'react-dom/client';
import { MainPage } from './main-page.tsx';
import '../index.css';

const reactRootElement = document.getElementById('react-root') as HTMLDivElement;
const reactRoot = createRoot(reactRootElement);
reactRoot.render(<MainPage />);
