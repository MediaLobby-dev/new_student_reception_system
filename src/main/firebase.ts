import { initializeApp, credential } from 'firebase-admin';
import { FirebaseAppError } from 'firebase-admin/app';
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
  try {
    initializeApp({
      credential: credential.cert(
        JSON.parse(readFileSync(join(BASE_PATH, 'config', 'sdk.json')).toString()),
      ),
    });
    return {
      status: true,
      data: null,
    };
  } catch (error) {
    if (error instanceof FirebaseAppError) {
      return {
        status: true,
        data: null,
      };
    }

    return {
      status: false,
      data: null,
      error: {
        code: 500,
        message: (error as Error).message,
      },
    };
  }
};
