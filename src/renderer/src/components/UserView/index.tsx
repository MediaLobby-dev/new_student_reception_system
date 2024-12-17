import { useState } from 'react';
import { getDepartmentColor } from './functions/getDepartmentColor';
import RemarkInputBox from '../RemarkInputBox';
import styles from './styles.module.scss';
import Button from '../Button';
import { useStudentData } from '../../hooks/useStudentData';
import { useCancelReception } from '../../hooks/useCancelReception';
import { useAtomValue } from 'jotai';
import { isAdminModeAtom } from '../../atom';
import { useDisableNotifyFlug } from '../../hooks/useDisableNotifyFlug';
import { CancelStudentReceptionModal } from '../Modal/CancelStudentReceptionModal';

type UserViewProps = {
  handleResrtInputStudentId: () => void;
};

export default function UserView({ handleResrtInputStudentId }: UserViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdminMode = useAtomValue(isAdminModeAtom);

  const { data } = useStudentData();
  const { cancelReception } = useCancelReception();
  const { disableNotifyFlug } = useDisableNotifyFlug();

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (!data || !data.studentName) {
    return null;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-6">
          {isAdminMode ? (
            <div className="card mb-2">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-body-secondary">対応状況</h6>
                {data?.isNeedNotify ? (
                  <div className={styles.acceptReceptionBox}>
                    <Button
                      status="success"
                      onClick={() => {
                        disableNotifyFlug();
                      }}
                    >
                      対応済にする
                    </Button>
                  </div>
                ) : (
                  <div className={styles.viewBox}>対応済み</div>
                )}
              </div>
            </div>
          ) : (
            <div className="card mb-2">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-body-secondary">受付状況</h6>
                <div className={styles.viewBox}>
                  <div className={styles.controlBtnBox}>
                    {data?.receptionStatus ? (
                      <div className={styles.doneReception}>受付済</div>
                    ) : (
                      <div>未受付</div>
                    )}
                    {data?.receptionStatus && (
                      <div className={styles.smallbtn}>
                        <Button
                          status="important"
                          onClick={() => {
                            handleModal();
                          }}
                        >
                          受付を取消する
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card mb-2">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-body-secondary">氏名</h6>
              <div className={styles.viewBox}>{data?.studentName ? data.studentName : 'なし'}</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6">
          <div className="card mb-2">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-body-secondary">学部</h6>
              <div className={styles.viewBox}>
                <span className={getDepartmentColor(data.department)}>
                  {data?.department ? data.department : 'なし'}
                </span>
              </div>
            </div>
          </div>

          <div className="card mb-2">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-body-secondary">フリガナ</h6>
              <div className={styles.viewBox}>{data?.kana ? data.kana : 'なし'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col py-2">
          <div className="card">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-body-secondary">サプライ品</h6>
              <div className={styles.viewBox}>{data?.supply ? data.supply : 'なし'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col py-2">
          <RemarkInputBox />
        </div>
      </div>

      <CancelStudentReceptionModal
        receptionModalIsOpen={isModalOpen}
        handleModal={handleModal}
        cancelReception={cancelReception}
        handleResrtInputStudentId={handleResrtInputStudentId}
      />
    </div>
  );
}
