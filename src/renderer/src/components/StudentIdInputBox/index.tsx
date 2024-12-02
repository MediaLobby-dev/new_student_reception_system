import { GrPowerReset } from 'react-icons/gr';
import { GrCheckboxSelected } from 'react-icons/gr';
import Button from '../Button';
import { useAtomValue, useSetAtom } from 'jotai';
import { isDeprecatedPCReceptionAtom, isLoadingAtom, statusCodeAtom, studentDataAtom, studentIdAtom } from '../../atom';
import { forwardRef } from 'react';

type StudentIdInputBoxProps = {
  handleResrtInputStudentId: () => void;
};

const StudentIdInputBox = forwardRef(({ handleResrtInputStudentId } : StudentIdInputBoxProps, ref: React.Ref<HTMLInputElement>) => {
  const setStudentId = useSetAtom(studentIdAtom);
  const statusCode = useAtomValue(statusCodeAtom);
  const data = useAtomValue(studentDataAtom);

  const setIsLoading = useSetAtom(isLoadingAtom);
  
  const setStatusCode = useSetAtom(statusCodeAtom);
  const isDeprecatedPCReception = useAtomValue(isDeprecatedPCReceptionAtom);



  // const make_accepted_processing = async (studentId: string) => {
  //   console.log('make_accepted_processing');
  // };

  // const printRecipt = async (
  //   studentId: string,
  //   studentName: string,
  //   kana: string,
  //   callback: () => void,
  // ) => {
  //   console.log('printRecipt');
  // };

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
    setStatusCode(0);
    // 学籍番号をリセット
    setStudentId('');
    // フォーカスをリセット
    handleResrtInputStudentId();
  };

  // 確認済みボタンの無効化
  function disabledCheck() {
    // ステータスコードが0の場合は、無効にする
    if (statusCode === 0) {
      return true;
    }

    // ステータスコードが4xxで始まる場合は、無効にする
    if (statusCode.toString().startsWith('4')) {
      return true;
    }

    // ステータスコードが5xxで始まる場合は、無効にする
    if (statusCode.toString().startsWith('5')) {
      return true;
    }

    // 受付済みの場合は再度確認を無効にする
    if (data?.receptionStatus === true) {
      return true;
    }

    return false;
  }

  // function printSuccessfully() {
  //   // ステータスコードを更新
  //   setStatusCode(203);
  //   // 学籍番号をリセット
  //   setStudentId('');
  //   // フォーカスをリセット
  //   if (inputEl.current) {
  //     inputEl.current.value = '';
  //     inputEl.current.focus();
  //   }
  // }

  async function handlReceptionCheck() {
    if (isDeprecatedPCReception) {
      // // 後にリファクタリング
      // setIsLoading({
      //   status: true,
      //   message: '処理中...',
      // });
      // //await make_accepted_processing(studentId);
      // printSuccessfully();
      // setIsLoading({
      //   status: false,
      //   message: '',
      // });
    } else {
      //printRecipt(studentId, data.studentName, data.kana, printSuccessfully);
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
