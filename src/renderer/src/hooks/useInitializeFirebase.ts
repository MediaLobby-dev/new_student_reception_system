import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export const useInitializeFirebase = () => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    useEffect(() => {
        const initializeFirebase = async () => {
            try {
                const res = await window.electron.ipcRenderer.invoke("initializeFirebase");
                console.log(res);
                if (res && res.status) {
                    setIsInitialized(true);
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
        };
    
        return () => {
            initializeFirebase();
        }
    }, []);

    return isInitialized;
}
