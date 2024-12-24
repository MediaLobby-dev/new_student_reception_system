import { useSetAtom } from 'jotai';
import {
  messageCode,
  studentIdAtom,
  resetStudentData,
} from '../../atom';
import { forwardRef } from 'react';
import ControlBox from '../ControlBox';

type StudentIdInputBoxProps = {
  handleResrtInputStudentId: () => void;
};

const StudentIdInputBox = forwardRef(
  ({ handleResrtInputStudentId }: StudentIdInputBoxProps, ref: React.Ref<HTMLInputElement>) => {
    const setStudentId = useSetAtom(studentIdAtom);
    const resetAll = useSetAtom(resetStudentData);
    const setMessageKeyCode = useSetAtom(messageCode);

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
          <ControlBox inputReset={inputReset} />
        </div>
      </>
    );
  },
);

export default StudentIdInputBox;
