import { useState, useContext } from 'react'
import RemarkInputBox from '../RemarkInputBox'
import { useStudentData } from '../../hooks/useStudentData'
import { StateStore } from '../../src/App'
import styles from './styles.module.scss'
import { departmentColorList } from '../../src/types';
import Button from '../Button';
import Modal from 'react-modal';
import { cancelReception } from '../../src/gas';

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const colorList: departmentColorList = [
    {
        departmentName: "BS",
        styleName: styles.bs,
    },
    {
        departmentName: "MS",
        styleName: styles.ms,
    },
    {
        departmentName: "CS",
        styleName: styles.cs,
    },
    {
        departmentName: "ES",
        styleName: styles.es,
    },
    {
        departmentName: "HS",
        styleName: styles.hs,
    },
    {
        departmentName: "DS",
        styleName: styles.ds,
    }
]

function getDepartmentColor(departmentName: string) {
    const color = colorList.find((element) => element.departmentName === departmentName)
    if (!color) return styles.departmentdefault;
    return color?.styleName
}

export default function UserView() {
    const { setStatusCode, studentId, setStudentId, inputEl, isLoading } = useContext(StateStore);
    const { data, isDataLoading } = useStudentData(studentId);

    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function reset() {
        // 学籍番号をリセット
        setStudentId('')
        // フォーカスをリセット
        if (inputEl.current) {
            inputEl.current.value = ''
            inputEl.current.focus()
        }
    }

    async function onClickCancelReception() {
        setIsLoadingModal(true);
        // 受付取消処理
        const res = await cancelReception(studentId);
        if (res) {
            // ステータスコードを更新
            setStatusCode(202);

        } else {
            setStatusCode(500);
        }
        closeModal();
        reset();
    }


    // データ取得中
    if (isLoading || isDataLoading) {
        return (
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        );
    }

    // データが存在しない
    if (!data) return <></>;


    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-6">
                    <div className="card mb-2">
                        <div className="card-body">
                            <h6
                                className="card-subtitle mb-2 text-body-secondary">
                                受付状況
                            </h6>
                            <div className={styles.viewBox}>
                                <div className={styles.controlBtnBox}>
                                    {data?.receptionStatus ? <div className={styles.doneReception}>受付済</div> : <div>未受付</div>}
                                    {
                                        data?.receptionStatus ?
                                            <div className={styles.smallbtn}>
                                                <Button status="important" onClick={() => { openModal() }}>受付を取消する</Button>
                                            </div> : <></>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card mb-2">
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 text-body-secondary">氏名</h6>
                            <div className={styles.viewBox}>{data?.studentName ? data.studentName : "なし"}</div>
                        </div>
                    </div>
                </div>

                <div className="col-sm-6">
                    <div className="card mb-2">
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 text-body-secondary">学部</h6>
                            <div className={styles.viewBox}>
                                <span className={getDepartmentColor(data.department)}>
                                    {data?.department ? data.department : "なし"}
                                </span>
                            </div>
                        </div>
                    </div>


                    <div className="card mb-2">
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 text-body-secondary">フリガナ</h6>
                            <div className={styles.viewBox}>{data?.kana ? data.kana : "なし"}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col py-2">
                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 text-body-secondary">サプライ品</h6>
                            <div className={styles.viewBox}>
                                {data?.supply ? data.supply : "なし"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col py-2">
                    <RemarkInputBox studentId={data.studentId} originalRemarks={data?.remarks ? data.remarks : ""} />
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className={styles.modalTitle}>受付の取消</h5>
                    </div>
                    <div className={styles.modalBody}>
                        <p>受付の取り消し処理を行います。この操作は中断できません。よろしいですか？</p>
                    </div>
                    <div className={styles.modalBtnBox}>
                        <Button onClick={() => { closeModal() }}>キャンセル</Button>
                        <Button status="danger" onClick={() => { onClickCancelReception() }} disabled={isLoadingModal}>
                            {isLoadingModal ?
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div> :
                                "実行"
                            }
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
