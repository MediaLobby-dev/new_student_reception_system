import { MessageCode } from "./messageCode";

export interface Response<T> {
  status: boolean;
  data: T;
  error? :{
    code: MessageCode
    message?: string;
  }
}
