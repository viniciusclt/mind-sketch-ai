// Offline functionality utilities
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// LocalStorage functions for diagrams
export const saveDiagramToLocal = (id: string, diagram: any) => {
  try {
    const diagrams = JSON.parse(localStorage.getItem('diagrams') || '{}');
    diagrams[id] = {
      ...diagram,
      lastModified: new Date().toISOString(),
      synced: navigator.onLine
    };
    localStorage.setItem('diagrams', JSON.stringify(diagrams));
    return true;
  } catch (error) {
    console.error('Error saving diagram:', error);
    return false;
  }
};

export const loadDiagramFromLocal = (id: string) => {
  try {
    const diagrams = JSON.parse(localStorage.getItem('diagrams') || '{}');
    return diagrams[id] || null;
  } catch (error) {
    console.error('Error loading diagram:', error);
    return null;
  }
};

export const getAllLocalDiagrams = () => {
  try {
    return JSON.parse(localStorage.getItem('diagrams') || '{}');
  } catch (error) {
    console.error('Error loading diagrams:', error);
    return {};
  }
};

// Online status detection
export const onlineStatusListener = (callback: (isOnline: boolean) => void) => {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));
  
  // Return initial status
  return navigator.onLine;
};

// Sync pending changes when back online
export const syncPendingChanges = async () => {
  const diagrams = getAllLocalDiagrams();
  const unsyncedDiagrams = Object.entries(diagrams).filter(([_, diagram]: [string, any]) => !diagram.synced);
  
  for (const [id, diagram] of unsyncedDiagrams) {
    try {
      // Here you would implement actual API sync
      console.log('Syncing diagram:', id, diagram);
      
      // Mark as synced after successful upload
      if (diagram && typeof diagram === 'object') {
        saveDiagramToLocal(id, { ...diagram, synced: true });
      }
    } catch (error) {
      console.error('Error syncing diagram:', id, error);
    }
  }
};