import { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import styles from './styles.module.scss';
import Button from '../Button';

import { statusCodeAtom, studentIdAtom } from '../../atom';

export default function RemarkInputBox({
  originalRemarks,
}: {
  studentId: string;
  originalRemarks: string;
}) {
  const [remarks, setRemarks] = useState<string>(originalRemarks);
  const studentId = useAtomValue(studentIdAtom);
  const [statusCode, setStatusCode] = useAtom(statusCodeAtom);

  // const editRemarks = (studentId: string, remarks: string) => {
  //   console.log('editRemarks');
  //   return true;
  // };

  async function updateRemarks(): Promise<void> {
    // const res = await editRemarks(studentId, remarks);
    // if (res === true) {
    //   setStatusCode(201);
    // } else {
    //   setStatusCode(500);
    // }
  }

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h6 className="card-subtitle mb-2 text-body-secondary">備考欄</h6>
          <textarea
            className="form-control"
            rows={3}
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
            }}
          ></textarea>

          <div className={styles.controlBox}>
            <Button status="primary" onClick={() => updateRemarks()}>
              更新
            </Button>
            <div className={styles.statusMsg}>
              {statusCode === 201 ? <span className={styles.success}>更新しました</span> : <></>}
              {statusCode === 500 ? (
                <span className={styles.err}>
                  更新に失敗しました。画面上部のメッセージをご確認ください。
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
