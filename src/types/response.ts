import { MessageCode } from "./errorCode";

export interface Response<T> {
  status: boolean;
  data: T;
  error? :{
    code: MessageCode
    message?: string;
  }
}
