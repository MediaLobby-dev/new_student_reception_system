import Swal from "sweetalert2";

export const useSetting = () => {

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
        openAndSaveSDKFile,
    };
};
