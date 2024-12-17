import React, { useState } from 'react';
import Modal from 'react-modal';
import Button from '../../Button';
import styles from '../styles.module.scss';

type CancelStudentReceptionModalProps = {
  receptionModalIsOpen: boolean;
  handleModal: () => void;
  cancelReception: () => void;
  handleResrtInputStudentId: () => void;
};

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

export const CancelStudentReceptionModal: React.FC<CancelStudentReceptionModalProps> = ({
  receptionModalIsOpen,
  handleModal,
  cancelReception,
  handleResrtInputStudentId,
}) => {
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  const onClickCancelReception = () => {
    setIsLoadingModal(true);
    cancelReception();
    setIsLoadingModal(false);
    handleModal();
    handleResrtInputStudentId();
  };
  return (
    <Modal isOpen={receptionModalIsOpen} onRequestClose={handleModal} style={customStyles}>
      <div className="modal-content">
        <div className="modal-header">
          <h5 className={styles.modalTitle}>受付の取消</h5>
        </div>
        <div className={styles.modalBody}>
          <p>受付の取り消し処理を行います。この操作は中断できません。よろしいですか？</p>
        </div>
        <div className={styles.modalBtnBox}>
          <Button
            onClick={() => {
              handleModal();
            }}
          >
            キャンセル
          </Button>
          <Button
            status="danger"
            onClick={() => {
              onClickCancelReception();
            }}
            disabled={isLoadingModal}
          >
            {isLoadingModal ? (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              '実行'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
