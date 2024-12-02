import { useAtomValue } from 'jotai';
import { ErrorCodeList } from '../../types';
import { statusCodeAtom } from '../../atom';

export default function MessageBox() {
  const statusCode = useAtomValue(statusCodeAtom);

  const message = ErrorCodeList.find((element) => element.code === statusCode)?.message;
  const subMessage = ErrorCodeList.find((element) => element.code === statusCode)?.subMessage;

  // ステータスコードが未定義、0の場合は、非表示
  if (!statusCode) return <></>;

  // ステータスコードが405の場合は、情報メッセージを表示
  if (statusCode === 405) {
    return (
      <div className="container py-2">
        <div className="alert alert-info" role="alert">
          <p className="mb-0">{message ? message : ''}</p>
          <p className="mb-0">{subMessage ? subMessage : ''}</p>
        </div>
      </div>
    );
  }

  if (statusCode === 401) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading fw-bold">告知事項あり</h4>
        <p>{message ? message : ''}</p>
        <hr />
        <p className="mb-0">{subMessage ? subMessage : ''}</p>
      </div>
    );
  }

  if (statusCode === 4021) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading fw-bold">推奨機です</h4>
        <p>{message ? message : ''}</p>
        <hr />
        <p className="mb-0">{subMessage ? subMessage : ''}</p>
      </div>
    );
  }

  if (statusCode === 4022) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading fw-bold">非推奨機です</h4>
        <p>{message ? message : ''}</p>
        <hr />
        <p className="mb-0">{subMessage ? subMessage : ''}</p>
      </div>
    );
  }

  // ステータスコードが2xxの場合は、成功メッセージを表示
  if (statusCode.toString().startsWith('2')) {
    return (
      <div className="container py-2">
        <div className="alert alert-success" role="alert">
          <p className="mb-0">{message ? message : ''}</p>
        </div>
      </div>
    );
  }

  // ステータスコードが4xxの場合は、エラーメッセージを表示
  if (statusCode.toString().startsWith('4')) {
    return (
      <div className="container py-2">
        <div className="alert alert-danger" role="alert">
          <p className="mb-0">{message ? message : ''}</p>
          <p className="mb-0">{subMessage ? subMessage : ''}</p>
        </div>
      </div>
    );
  }

  // ステータスコードが5xxの場合は、エラーメッセージを表示
  if (statusCode.toString().startsWith('5')) {
    return (
      <div className="container py-2">
        <div className="alert alert-danger" role="alert">
          <p className="mb-0">{message ? message : ''}</p>
          <p className="mb-0">{subMessage ? subMessage : ''}</p>
        </div>
      </div>
    );
  }

  // それ以外の場合は、非表示
  return <></>;
}
