import { DEFAULT_SUUID_V1_LENGTH } from './constants';
import { ISuuidOptions } from './types';

function dec2hex(n: number): string {
  const hv = '0123456789ABCDEF';
  let ret = '';
  let num = n;
  if (num === 0) return '0';
  while (num > 0) {
    ret = hv[num % 16] + ret;
    num = Math.floor(num / 16);
  }
  return ret;
}

function getTimestampHex(): string {
  const year = Number(new Date().getFullYear().toString().slice(-2));
  // eslint-disable-next-line @stylistic/max-len
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const beat = Math.floor((Date.now() / 86400) % 1000);
  const tsStr = `${year}${dayOfYear.toString().padStart(3, '0')}${beat}`;
  return dec2hex(Number(tsStr));
}

export function suuidv1(options?: ISuuidOptions): string {
  // eslint-disable-next-line @stylistic/max-len
  const charset = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789_';
  const {
    length = DEFAULT_SUUID_V1_LENGTH,
    prefix = '',
    suffix = '',
  } = options || {};

  const tsHex = getTimestampHex();
  const prefixStr = prefix || '';
  const totalFixedLen = prefixStr.length + tsHex.length + suffix.length;
  const remainingLen = length - totalFixedLen;

  if (length < 0) throw new Error('Length must be non-negative');
  if (remainingLen < 0) return '';

  let bytes = new Uint8Array(remainingLen);

  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.getRandomValues === 'function'
  ) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require('crypto');
    bytes = crypto.randomBytes(remainingLen);
  }

  // eslint-disable-next-line @stylistic/max-len
  const id = prefixStr + tsHex + Array.from(bytes, (b: number) => charset[b % charset.length]).join('') + suffix;
  return id;
}
