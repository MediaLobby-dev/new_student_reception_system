import React from 'react';
import Modal from 'react-modal';
import Button from '../../Button';
import styles from '../styles.module.scss';

type ChangeReceptionModeModalProps = {
    receptionModalIsOpen: boolean;
    setReceptionModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isDeprecatedPCReception: boolean;
    onClickChangeMode: () => void;
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

export const ChangeReceptionModeModal: React.FC<ChangeReceptionModeModalProps> = ({ receptionModalIsOpen, setReceptionModalIsOpen, isDeprecatedPCReception, onClickChangeMode }) => {

    const handleCloseModal = () => {
        setReceptionModalIsOpen(!receptionModalIsOpen);
    }

    return (
        <Modal isOpen={receptionModalIsOpen} onRequestClose={handleCloseModal} style={customStyles}>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className={styles.modalTitle}>受付モードの変更</h5>
                </div>
                <div className={styles.modalBody}>
                    <p>
                        受付モードを <span>{isDeprecatedPCReception ? '非推奨機' : '推奨機'}</span> から{' '}
                        <span>{isDeprecatedPCReception ? '推奨機' : '非推奨機'}</span>{' '}
                        に変更します。よろしいですか？
                    </p>
                </div>
                <div className={styles.modalBtnBox}>
                    <Button
                        onClick={() => {
                            handleCloseModal();
                        }}
                    >
                        キャンセル
                    </Button>
                    <Button
                        status="danger"
                        onClick={() => {
                            onClickChangeMode();
                        }}
                    >
                        実行
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
