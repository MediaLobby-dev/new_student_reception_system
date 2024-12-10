import { useAtomValue } from 'jotai';
import { errorKey } from '../../atom';
import { ErrorCode, ErrorCodeList } from '../../../../types/errorCode';

export default function MessageBox() {

  const errorKeyCode = useAtomValue(errorKey);

  switch (errorKeyCode) {
    // 成功系
    case ErrorCode.SUCCESSFUL_GET_STUDENT_DATA:
    case ErrorCode.SUCCESSFUL_CANCEL_RECEPTION:
    case ErrorCode.SUCCESSFUL_RECEPTION:
    case ErrorCode.SUCCESSFUL_EDIT_REMARK:
      return (
        <div className="container py-2">
          <div className="alert alert-success" role="alert">
            <p className="mb-0">{ErrorCodeList[errorKeyCode].message}</p>
          </div>
        </div>
      )

    case ErrorCode.INVALID_STUDENT_NUMBER:
      return (
        <div className="container py-2">
          <div className="alert alert-info" role="alert">
            <p className="mb-0">{ErrorCodeList[errorKeyCode].message}</p>
            <p className="mb-0">{ErrorCodeList[errorKeyCode].subMessage}</p>
          </div>
        </div>
      )

    case ErrorCode.BAD_REQUEST:
    case ErrorCode.UNABLE_RECEPTION:
    case ErrorCode.NOT_FOUND_STUDENT:
    case ErrorCode.INTERNAL_SERVER_ERROR:
      return (
        <div className="container py-2">
          <div className="alert alert-danger" role="alert">
            <p className="mb-0">{ErrorCodeList[errorKeyCode].message}</p>
            <p className="mb-0">{ErrorCodeList[errorKeyCode].subMessage}</p>
          </div>
        </div>
      )

      case ErrorCode.PURCHASED_RECOMMENDED_MACHINE:
      case ErrorCode.NON_RECOMMENDED_MACHINE:
        return (
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading fw-bold">{ErrorCodeList[errorKeyCode].message}</h4>
            <p>{ErrorCodeList[errorKeyCode].subMessage}</p>
          </div>
        )

      default:
        return <></>;
  }
}
