import { initializedFirebaseAtom } from '../atom';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

export const useInitializeFirebase = () => {
  const [isInitialized, setIsInitialized] = useAtom(initializedFirebaseAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const res = await window.electron.ipcRenderer.invoke('initializeFirebase');
        if (res && res.status) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };

    return () => {
      initializeFirebase();
    };
  }, [setIsInitialized]);

  return {
    isLoading,
    isInitialized,
  };
};
