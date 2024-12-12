import { useAtomValue } from 'jotai';
import { messageCode } from '../../atom';
import { MessageCode, MessageCodeList } from '../../../../types/messageCode';

export default function MessageBox() {

  const messageKeyCode = useAtomValue(messageCode);

  switch (messageKeyCode) {
    // 成功系
    case MessageCode.SUCCESSFUL_GET_STUDENT_DATA:
    case MessageCode.SUCCESSFUL_CANCEL_RECEPTION:
    case MessageCode.SUCCESSFUL_RECEPTION:
    case MessageCode.SUCCESSFUL_EDIT_REMARK:
    case MessageCode.SUCCESSFUL_DISABLE_NOTIFY_FLUG:
      return (
        <div className="container py-2">
          <div className="alert alert-success" role="alert">
            <p className="mb-0">{MessageCodeList[messageKeyCode].message}</p>
          </div>
        </div>
      )

    case MessageCode.INVALID_STUDENT_NUMBER:
      return (
        <div className="container py-2">
          <div className="alert alert-info" role="alert">
            <p className="mb-0">{MessageCodeList[messageKeyCode].message}</p>
            <p className="mb-0">{MessageCodeList[messageKeyCode].subMessage}</p>
          </div>
        </div>
      )

    case MessageCode.BAD_REQUEST:
    case MessageCode.NOT_FOUND_STUDENT:
    case MessageCode.INTERNAL_SERVER_ERROR:
      return (
        <div className="container py-2">
          <div className="alert alert-danger" role="alert">
            <p className="mb-0">{MessageCodeList[messageKeyCode].message}</p>
            <p className="mb-0">{MessageCodeList[messageKeyCode].subMessage}</p>
          </div>
        </div>
      )

    case MessageCode.UNABLE_RECEPTION:
    case MessageCode.PURCHASED_RECOMMENDED_MACHINE:
    case MessageCode.NON_RECOMMENDED_MACHINE:
      return (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading fw-bold">{MessageCodeList[messageKeyCode].title}</h4>
          <p className="mb-0">{MessageCodeList[messageKeyCode].message}</p>
          <hr />
          <span>{MessageCodeList[messageKeyCode].subMessage}</span>
        </div>
      )

    default:
      return <></>;
  }
}
