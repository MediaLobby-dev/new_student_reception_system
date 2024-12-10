export interface Response<T> {
  status: boolean;
  data: T;
  error?: ErrorObject;
}

export interface ErrorObject {
  code: number;
  message: string;
}
