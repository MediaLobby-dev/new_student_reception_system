import { initializedFirebaseAtom } from '../atom';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export const useInitializeFirebase = () => {
    const [isInitialized, setIsInitialized] = useAtom(initializedFirebaseAtom);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const initializeFirebase = async () => {
            try {
                const res = await window.electron.ipcRenderer.invoke("initializeFirebase");
                if (res && res.status) {
                    setIsInitialized(true);
                    clearInterval(interval);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Firebase SDK 初期化エラー',
                        text: "Firebase SDKの接続情報が存在しません。マニュアルを参照の上、[設定]から接続情報を設定してください。",
                    });
                }
            } catch (error) {
                console.error(error);
            }
            setIsLoading(false);
        };

        interval = setInterval(() => {
            initializeFirebase();
        }, 3000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return {
        isLoading,
        isInitialized,
    };
}
