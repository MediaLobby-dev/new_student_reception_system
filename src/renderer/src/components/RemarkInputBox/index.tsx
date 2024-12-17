import { useEditRemark } from '../../hooks/useEditRemark';
import styles from './styles.module.scss';
import Button from '../Button';

export default function RemarkInputBox() {
  const { isSuccess, isError, remark, setRemark, updateRemark } = useEditRemark();

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h6 className="card-subtitle mb-2 text-body-secondary">備考欄</h6>
          <textarea
            className="form-control"
            rows={3}
            value={remark}
            onChange={(e) => {
              setRemark(e.target.value);
            }}
          ></textarea>

          <div className={styles.controlBox}>
            <Button status="primary" onClick={() => updateRemark()}>
              更新
            </Button>
            <div className={styles.statusMsg}>
              {isSuccess && <span className={styles.success}>更新しました</span>}
              {isError && (
                <span className={styles.err}>
                  更新に失敗しました。画面上部のメッセージをご確認ください。
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
