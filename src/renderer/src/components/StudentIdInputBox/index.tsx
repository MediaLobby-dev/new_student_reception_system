import { GrPowerReset } from 'react-icons/gr';
import { GrCheckboxSelected } from 'react-icons/gr';
import Button from '../Button';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  isDeprecatedPCReceptionAtom,
  messageCode,
  studentIdAtom,
  studentDataAtom,
  resetStudentData,
} from '../../atom';
import { forwardRef } from 'react';
import { useAcceptReception } from '../../hooks/useAcceptReception';
import { usePrint } from '../../hooks/usePrint';

type StudentIdInputBoxProps = {
  handleResrtInputStudentId: () => void;
};

const StudentIdInputBox = forwardRef(
  ({ handleResrtInputStudentId }: StudentIdInputBoxProps, ref: React.Ref<HTMLInputElement>) => {
    const [studentId, setStudentId] = useAtom(studentIdAtom);
    const studentData = useAtomValue(studentDataAtom);
    const resetAll = useSetAtom(resetStudentData);
    const [messageKeyCode, setMessageKeyCode] = useAtom(messageCode);
    const isDeprecatedPCReception = useAtomValue(isDeprecatedPCReceptionAtom);

    const { acceptReception } = useAcceptReception();
    const { printRecipt } = usePrint();

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length === 0) {
        // 学籍番号をリセット
        setStudentId('');
        // フォーカスをリセット
        handleResrtInputStudentId();
      }
      setStudentId(e.target.value);
    };

    const inputReset = () => {
      setMessageKeyCode(null);
      // 学籍番号をリセット
      setStudentId('');
      // フォーカスをリセット
      handleResrtInputStudentId();
      // メッセージをリセット
      resetAll();
    };

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

    return (
      <>
        <div className="row g-3 align-items-center py-3">
          <div className="col-auto">
            <label className="col-form-label">学籍番号</label>
          </div>
          <div className="col-auto">
            <input
              ref={ref}
              type="text"
              autoFocus={true}
              className="form-control"
              onChange={handleInput}
            />
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
            <Button
              status="success"
              onClick={() => handlReceptionCheck()}
              disabled={disabledCheck()}
            >
              <GrCheckboxSelected /> 確認済み
            </Button>
          </div>
        </div>
      </>
    );
  },
);

export default StudentIdInputBox;
