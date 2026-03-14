import { MessageCode } from '../types/messageCode';
import { Response } from '../types/response';

export class ErrorResponseDto<T = null> implements Response<T> {
  readonly status = false as const;
  readonly data: T;
  readonly error: { code: MessageCode };

  constructor(code: MessageCode, data: T = null as T) {
    this.data = data;
    this.error = { code };
  }
}
