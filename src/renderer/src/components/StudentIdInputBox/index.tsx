import { GrPowerReset } from 'react-icons/gr';
import { GrCheckboxSelected } from 'react-icons/gr';
import Button from '../Button';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { isDeprecatedPCReceptionAtom, isLoadingAtom, errorKey, studentIdAtom } from '../../atom';
import { forwardRef } from 'react';
import { ErrorCode } from '../../../../types/errorCode';
import { useAcceptReception } from '../../hooks/useAcceptReception';

type StudentIdInputBoxProps = {
  handleResrtInputStudentId: () => void;
};

const StudentIdInputBox = forwardRef(({ handleResrtInputStudentId } : StudentIdInputBoxProps, ref: React.Ref<HTMLInputElement>) => {
  const setStudentId = useSetAtom(studentIdAtom);
  const [errorKeyCode, setErrorKeyCode] = useAtom(errorKey);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const isDeprecatedPCReception = useAtomValue(isDeprecatedPCReceptionAtom);
  const { acceptReception } = useAcceptReception();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      // 学籍番号をリセット
      setStudentId('');
      // フォーカスをリセット
      handleResrtInputStudentId();
    }
    console.log(e.target.value);
    setStudentId(e.target.value);
  };

  const inputReset = () => {
    setErrorKeyCode(null);
    // 学籍番号をリセット
    setStudentId('');
    // フォーカスをリセット
    handleResrtInputStudentId();
  };

  // 確認済みボタンの無効化
  function disabledCheck() {
    if(errorKeyCode === ErrorCode.SUCCESSFUL_GET_STUDENT_DATA) return false;
    return true;
  }

  async function handlReceptionCheck() {
    if (isDeprecatedPCReception) {
      // 後にリファクタリング
      setIsLoading({
        status: true,
        message: '処理中...',
      });
      acceptReception();
      setIsLoading({
        status: false,
        message: '',
      });
    } else {
      setIsLoading({
        status: true,
        message: '処理中...',
      });
      acceptReception();
      setIsLoading({
        status: false,
        message: '',
      });
    }
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
          <Button status="success" onClick={() => handlReceptionCheck()} disabled={disabledCheck()}>
            <GrCheckboxSelected /> 確認済み
          </Button>
        </div>
      </div>
    </>
  );
});

export default StudentIdInputBox;
