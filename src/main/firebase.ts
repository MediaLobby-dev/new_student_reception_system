import { initializeApp, credential } from 'firebase-admin';
import { getApp } from 'firebase-admin/app';
import { readFileSync } from 'fs';
import { join } from 'path';
import { BASE_PATH } from './index';
import { Response } from '../types/response';

export const isExsistsFirebaseSDKJson = (): boolean => {
  return readFileSync(join(BASE_PATH, 'config', 'sdk.json')).length > 0;
};

export const initializeFirebase = (): Response<null> => {
  if (!isExsistsFirebaseSDKJson()) {
    return {
      status: false,
      data: null,
      error: {
        code: 400,
        message: 'SDK not found',
      },
    };
  }

  if (!getApp()) {
    initializeApp({
      credential: credential.cert(
        JSON.parse(readFileSync(join(BASE_PATH, 'config', 'sdk.json')).toString()),
      ),
    });
    return {
      status: true,
      data: null,
    };
  }

  return {
    status: false,
    data: null,
    error: {
      code: 400,
      message: 'Firebase already initialized',
    },
  };
};
