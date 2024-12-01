export interface Response<T> {
  status: boolean;
  data: T;
  error?: {
    code: number;
    message: string;
  };
}
