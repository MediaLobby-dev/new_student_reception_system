import { ErrorCode } from "./errorCode";

export interface Response<T> {
  status: boolean;
  data: T;
  error? :{
    code: ErrorCode
    message?: string;
  }
}
