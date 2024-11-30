import { GrHelpBook, GrPrint, GrUpdate } from 'react-icons/gr';
import Button from '../Button';
import { useContext, useState } from 'react';
import { StateStore } from '../../App';
import Modal from 'react-modal';

import styles from './styles.module.scss';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10000
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

export default function Footer() {
  const { isDeprecatedPCReception, setIsDeprecatedPCReception } = useContext(StateStore);
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function onClickChangeMode() {
    setIsDeprecatedPCReception(!isDeprecatedPCReception);
    closeModal();
  }

  return (
    <>
      <footer className="pt-3 mt-4 text-muted border-top">
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <div className={styles.mode}>
                現在の受付モード: {isDeprecatedPCReception ? '非推奨機' : '推奨機'}
              </div>
              <div className={styles.small}>
                ver: {'ssss'} (build: {'ddd'})
              </div>
              <div className={styles.small}>
                ※外観・仕様は開発中または改良のため、各種仕様は予告なく変更される場合があります。
              </div>
            </div>
            <div className="col-sm-6">
              <div className={styles.toolBox}>
                <Button
                  onClick={() => {
                    window.open('https://github.com/MediaLobby-dev/new_student_reception_system');
                  }}
                >
                  <GrHelpBook /> ヘルプ
                </Button>
                <Button
                  onClick={() => {
                    console.log('test');
                  }}
                >
                  <GrPrint /> テスト印刷
                </Button>
                <Button
                  status="important"
                  onClick={() => {
                    openModal();
                  }}
                >
                  <GrUpdate /> 受付モード変更
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
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
                closeModal();
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
    </>
  );
}
