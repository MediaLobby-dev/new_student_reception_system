import { useContext } from "react"
import Button from "../Button"
import { StateStore } from "../../src/App"
import { printRecipt } from "../../src/printSystem"

import { GrPowerReset } from "react-icons/gr";
import { GrCheckboxSelected } from "react-icons/gr";

import { make_accepted_processing } from "../../src/gas"

if (import.meta.env.VITE_PRINT_SERVICE_DEPLOY_ID === undefined || import.meta.env.VITE_PRINT_SERVICE_DEPLOY_ID === "") {
    throw new Error("[Error] VITE_PRINT_SERVICE_DEPLOY_ID を設定してください。")
}


export default function StudentIdInputBox() {
    const { statusCode, studentId, setStudentId, data, inputEl, setStatusCode, isDeprecatedPCReception, setIsLoading } = useContext(StateStore);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0) {
            // 学籍番号をリセット
            setStudentId('')
            // フォーカスをリセット
            if (inputEl.current) {
                inputEl.current.value = ''
                inputEl.current.focus()
            }
        }
        setStudentId(e.target.value);
    }

    const inputReset = () => {
        setStatusCode(0)
        // 学籍番号をリセット
        setStudentId('')
        // フォーカスをリセット
        if (inputEl.current) {
            inputEl.current.value = ''
            inputEl.current.focus()
        }
    }

    // 確認済みボタンの無効化
    function disabledCheck() {
        // ステータスコードが0の場合は、無効にする
        if (statusCode === 0) {
            return true
        }

        // ステータスコードが4xxで始まる場合は、無効にする
        if (statusCode.toString().startsWith("4")) {
            return true
        }

        // ステータスコードが5xxで始まる場合は、無効にする
        if (statusCode.toString().startsWith("5")) {
            return true
        }

        // 受付済みの場合は再度確認を無効にする
        if (data?.receptionStatus === true) {
            return true
        }

        return false
    }

    function printSuccessfully() {
        // ステータスコードを更新
        setStatusCode(203);
        // 学籍番号をリセット
        setStudentId('')
        // フォーカスをリセット
        if (inputEl.current) {
            inputEl.current.value = ''
            inputEl.current.focus()
        }
    }

    async function handlReceptionCheck() {
        if (isDeprecatedPCReception) { // 後にリファクタリング
            setIsLoading(true)
            await make_accepted_processing(studentId)
            printSuccessfully()
            setIsLoading(false)
        } else {
            printRecipt(studentId, data.studentName, data.kana, printSuccessfully)
        }
    }


    return (
        <>
            <div className="row g-3 align-items-center py-3">
                <div className="col-auto">
                    <label className="col-form-label">学籍番号</label>
                </div>
                <div className="col-auto">
                    <input ref={inputEl} type="text" autoFocus={true} className="form-control" onChange={handleInput} />
                </div>
                <div className="col-auto">
                    <span id="passwordHelpInline" className="form-text">
                        バーコードを読み取るか、学籍番号を入力してください。
                    </span>
                </div>
                <div className="col-auto">
                    <Button onClick={() => inputReset()}>
                        <GrPowerReset /> リセット
                    </Button>
                    <Button status="success" onClick={() => handlReceptionCheck()} disabled={disabledCheck()} >
                        <GrCheckboxSelected /> 確認済み
                    </Button>
                </div>
            </div>
        </>
    )
}
