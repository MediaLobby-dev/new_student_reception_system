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
        window.electron.ipcRenderer.invoke("saveSdk").then((res) => {
            // ファイル未選択の場合は何もしない
            if(res && res?.error) {
                if(res.error.code === "NO_SELECTED_FILE") {
                    return;
                }
            }
            
            // エラーが発生した場合はエラーメッセージを表示
            if(res && res?.error) {
                Swal.fire("エラー", res.error.message ?? "原因不明のエラーが発生しました。", "error");
                return;
            }

            Swal.fire("読み込み成功", "Firebase接続情報の読み込みに成功しました。", "success");
        });
    };

    return {
        isAdminMode,
        handleAdminMode,
        openAndSaveSDKFile,
    };
};
