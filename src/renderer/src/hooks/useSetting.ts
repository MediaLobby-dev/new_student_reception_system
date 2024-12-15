import { useAtom } from "jotai";
import { isAdminModeAtom } from "../atom";
import Swal from "sweetalert2";

export const useSetting = () => {
    const [isAdminMode, setIsAdminMode] = useAtom(isAdminModeAtom);

    const handleAdminMode = () => {
        if(isAdminMode) {
            Swal.fire("管理者モードの無効化", "管理者モードを無効化しました。", "success");
            setIsAdminMode(!isAdminMode);
            return;
        }

        Swal.fire({
            title: "管理者モードの有効化",
            text: "管理者モードを有効化します。よろしいですか？",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "有効化",
            cancelButtonText: "キャンセル",
        }).then((result) => {
            if (result.isConfirmed) {
                setIsAdminMode(!isAdminMode);
            }
        });
    };

    const openAndSaveSDKFile = () => {
        // フロントからは呼び出すだけ、メインプロセスでハンドリングまで行う
        window.electron.ipcRenderer.invoke("saveSdk");
    };

    const testPrint = () => {
        // フロントからは呼び出すだけ、メインプロセスでハンドリングまで行う
        window.electron.ipcRenderer.invoke("testPrint");
    }

    return {
        isAdminMode,
        handleAdminMode,
        openAndSaveSDKFile,
        testPrint,
    };
};
