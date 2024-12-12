import { useAtom } from 'jotai';
import { GrHelpBook, GrUpdate, GrSettingsOption } from 'react-icons/gr';
import { useMemo, useState } from 'react';
import { isDeprecatedPCReceptionAtom } from '../../atom';
import { ChangeReceptionModeModal } from '../Modal/ChangeReceptionModeModal';
import { SettingModal } from '../Modal/Setting';
import Button from '../Button';
import styles from './styles.module.scss';


export default function Footer() {
  const [isDeprecatedPCReception, setIsDeprecatedPCReception] = useAtom(isDeprecatedPCReceptionAtom);
  const [receptionModalIsOpen, setReceptionModalIsOpen] = useState(false);
  const [settingModalIsOpen, setSettingModalIsOpen] = useState(false);

  function onClickChangeMode() {
    setIsDeprecatedPCReception(!isDeprecatedPCReception);
    setReceptionModalIsOpen(false);
  }

  const currentMode = useMemo(() => {
    return isDeprecatedPCReception ? '非推奨機' : '推奨機';
  }, [isDeprecatedPCReception]);

  return (
    <>
      <footer className="pt-3 mt-4 text-muted border-top">
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <div className={styles.mode}>
                現在の受付モード: <span>{currentMode}</span>
              </div>
              <div className={styles.small}>ver: {__APP_VERSION__} (build: {__BUILD_DATE__})</div>
              <div className={styles.small}>
                ※外観・仕様は開発中または改良のため、各種仕様は予告なく変更される場合があります。
              </div>
              <div className={styles.small + ' mt-1'}>
                本システムの音声案内は<a href="https://vidweb.co.jp/voicegate/" target="_blank" rel="noreferrer">ボイスゲート</a>を利用しています。
              </div>
            </div>
            <div className="col-sm-6">
              <div className={styles.toolBox}>
                <Button
                  status='wide'
                  onClick={() => {
                    window.open('https://github.com/MediaLobby-dev/new_student_reception_system');
                  }}
                >
                  <GrHelpBook /> ヘルプ
                </Button>
                <Button
                  status='wide'
                  onClick={() => {
                    setSettingModalIsOpen(true);
                  }}
                >
                  <GrSettingsOption /> 設定
                </Button>
                <Button
                  status="important"
                  onClick={() => {
                    setReceptionModalIsOpen(true);
                  }}
                >
                  <GrUpdate /> 受付モード変更
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <ChangeReceptionModeModal
        receptionModalIsOpen={receptionModalIsOpen}
        setReceptionModalIsOpen={setReceptionModalIsOpen}
        isDeprecatedPCReception={isDeprecatedPCReception}
        onClickChangeMode={onClickChangeMode} />

      <SettingModal
        isOpen={settingModalIsOpen}
        closeModal={() => setSettingModalIsOpen(false)} />
    </>
  );
}
