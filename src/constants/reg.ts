export const REG_USER_NAME = /^(?:[a-zA-Z0-9]{4,16}|(?:[\w+.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))$/;

/** Phone reg */
export const REG_PHONE =
  /^[1](([3][0-9])|([4][01456789])|([5][012356789])|([6][2567])|([7][0-8])|([8][0-9])|([9][012356789]))[0-9]{8}$/;

/**
 * Password reg
 *
 * 6-18 characters, including letters, numbers, and underscores
 */
export const REG_PWD = /^[\w@$!%*?&.]{6,18}$/;

/** Email reg */
export const REG_EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

/** Six digit code reg */
export const REG_CODE_SIX = /^\d{6}$/;

/** Four digit code reg */
export const REG_CODE_FOUR = /^[A-Za-z0-9]{4}$/;

/** Url reg */
export const REG_URL =
  /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
