import React from 'react';
import Modal from 'react-modal';
import Button from '../../Button';
import styles from '../styles.module.scss';
import settingModalStyles from './styles.module.scss';
import { useSetting } from '../../../hooks/useSetting';
import { usePrint } from '../../../hooks/usePrint';

type SettingModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
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

export const SettingModal: React.FC<SettingModalProps> = ({ isOpen, closeModal }) => {
  const { isAdminMode, handleAdminMode, openAndSaveSDKFile } = useSetting();
  const { testPrint } = usePrint();

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <div className="modal-content">
        <div className="modal-header">
          <h5 className={styles.modalTitle}>設定</h5>
        </div>
        <div className={styles.modalBody}>
          <table className={settingModalStyles.table}>
            <tr>
              <th>項目</th>
              <th>説明</th>
              <th>操作</th>
            </tr>
            <tr>
              <td>Firebase SDK 設定ファイル</td>
              <td>システムのDBにアクセスするための設定ファイルを読み込みます。</td>
              <td>
                <Button status="primary" onClick={() => openAndSaveSDKFile()}>
                  開く
                </Button>
              </td>
            </tr>
            <tr>
              <td>レシート印刷テスト</td>
              <td>レシート印字機の動作確認を行います。</td>
              <td>
                <Button status="primary" onClick={() => testPrint()}>
                  印刷実行
                </Button>
              </td>
            </tr>
            <tr className={settingModalStyles.adminMode}>
              <td>管理者モード</td>
              <td>案内所担当者向けの管理者モードを有効化します。</td>
              <td>
                {!isAdminMode ? (
                  <Button status="danger" onClick={() => handleAdminMode()}>
                    有効化
                  </Button>
                ) : (
                  <Button status="info" onClick={() => handleAdminMode()}>
                    無効化
                  </Button>
                )}
              </td>
            </tr>
          </table>
        </div>
        <div className={styles.modalBtnBox}>
          <Button
            onClick={() => {
              closeModal();
            }}
          >
            閉じる
          </Button>
        </div>
      </div>
    </Modal>
  );
};
