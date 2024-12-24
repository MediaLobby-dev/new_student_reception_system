import { GrPowerReset } from 'react-icons/gr';
import { GrCheckboxSelected } from 'react-icons/gr';
import Button from '../Button';
import { useAtomValue } from 'jotai';
import {
    isDeprecatedPCReceptionAtom,
    messageCode,
    studentIdAtom,
    studentDataAtom,
} from '../../atom';
import { useAcceptReception } from '../../hooks/useAcceptReception';
import { usePrint } from '../../hooks/usePrint';

type ControlBoxProps = {
    inputReset: () => void;
}

export default function ControlBox({ inputReset }: ControlBoxProps) {
    const studentId = useAtomValue(studentIdAtom);
    const studentData = useAtomValue(studentDataAtom);
    const messageKeyCode = useAtomValue(messageCode);
    const isDeprecatedPCReception = useAtomValue(isDeprecatedPCReceptionAtom);
    const { acceptReception } = useAcceptReception();
    const { printRecipt } = usePrint();

    async function handlReceptionCheck() {
        // 推奨機以外の生徒の場合
        if (isDeprecatedPCReception) {
            acceptReception();
            inputReset();
            return;
        }

        printRecipt().then(() => {
            acceptReception();
            inputReset();
        });
    }

    // 確認済みボタンの無効化
    function disabledCheck() {
        // 学籍番号が入力されていない場合
        if (!studentId) return true;
        // 受付済みの場合
        else if (studentData.receptionStatus) return true;
        // 除外メッセージの場合
        else if (
            messageKeyCode === 'UNABLE_RECEPTION' ||
            messageKeyCode === 'PURCHASED_RECOMMENDED_MACHINE' ||
            messageKeyCode === 'NON_RECOMMENDED_MACHINE'
        )
            return true;
        else if (
            messageKeyCode === 'INVALID_STUDENT_NUMBER' ||
            messageKeyCode === 'NOT_FOUND_STUDENT' ||
            messageKeyCode === 'INTERNAL_SERVER_ERROR'
        )
            return true;
        else return false;
    }

    return (
        <div className="col-auto">
            <Button onClick={() => inputReset()}>
                <GrPowerReset /> リセット
            </Button>
            <Button
                status="success"
                onClick={() => handlReceptionCheck()}
                disabled={disabledCheck()}
            >
                <GrCheckboxSelected /> 確認済み
            </Button>
        </div>
    )
}
