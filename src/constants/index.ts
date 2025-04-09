export const ROOT_PATH = '/';
export const AUTH_PATH = 'auth';
export const AUTH_EMAIL_PATH = 'verify-email';
export const MAIN_PATH = 'main';
export const KANJI_PATH = 'kanji';
export const VOCA_PATH = 'voca';
export const OTHER_PATH = '*';

export const ROOT_ABSOLUTE_PATH = ROOT_PATH;
export const AUTH_ABSOLUTE_PATH = `${ROOT_PATH}${AUTH_PATH}`;
export const AUTH_EMAIL_ABSOLUTE_PATH = `${ROOT_PATH}${AUTH_PATH}/${AUTH_EMAIL_PATH}`;
export const MAIN_ABSOLUTE_PATH = `${ROOT_PATH}${MAIN_PATH}`;
export const KANJI_ABSOLUTE_PATH = `${ROOT_PATH}${KANJI_PATH}`;
export const VOCA_ABSOLUTE_PATH = `${ROOT_PATH}${VOCA_PATH}`;
export const KANJI_GRADE_ABSOLUTE_PATH = (grade: number | string) =>
  `${ROOT_PATH}${KANJI_PATH}/${grade}`;
export const VOCA_GRADE_ABSOLUTE_PATH = (grade: number | string) =>
  `${ROOT_PATH}${VOCA_PATH}/${grade}`;

export const ACCESS_TOKEN = 'accessToken';
