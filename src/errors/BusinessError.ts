import { MessageCode } from '../types/messageCode';

export class BusinessError extends Error {
  readonly code: MessageCode;

  constructor(code: MessageCode) {
    super(code);
    this.name = 'BusinessError';
    this.code = code;
  }
}
