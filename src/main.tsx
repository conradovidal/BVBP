import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializePortalLocalState } from './lib/portalStorage.ts'

initializePortalLocalState();
createRoot(document.getElementById("root")!).render(<App />);
