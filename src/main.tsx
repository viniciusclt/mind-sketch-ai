import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './utils/offline'

// Register service worker for offline functionality
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
