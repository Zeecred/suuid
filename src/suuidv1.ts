import { DEFAULT_SUUID_V1_LENGTH } from './constants';
import { ISuuidOptions } from './types';

function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getSwatchInternetTime(date: Date = new Date()): string {
  // eslint-disable-next-line @stylistic/max-len
  const utc = date.getUTCHours() * 3600 + date.getUTCMinutes() * 60 + date.getUTCSeconds();
  const bmt = utc + 3600;
  const beats = Math.floor((bmt / 86.4) % 1000);
  return beats.toString().padStart(3, '0');
}

export function suuidv1(options?: ISuuidOptions): string {
  // eslint-disable-next-line @stylistic/max-len
  const charset = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789_';
  const { length = DEFAULT_SUUID_V1_LENGTH, prefix = '' } = options || {};

  if (length < 8) {
    throw new Error('Length must be at least 8');
  }

  const max = charset.length - 1;
  const prefixStr = prefix.padStart(2, '0');

  const year2Digits = new Date().getFullYear() % 100;
  const dayOfYear = getDayOfYear().toString().padStart(3, '0');
  const swatchInternetTime = getSwatchInternetTime();

  const intKey = parseInt(
    `${year2Digits}${dayOfYear}${swatchInternetTime}`,
  );

  const ts = intKey.toString(16).toUpperCase(); // Convert to hex and uppercase
  const baseStr = `${prefixStr}${ts}`;
  const retArr = baseStr.split('');

  while (retArr.length < length) {
    const randomIndex = Math.floor(Math.random() * max);
    retArr.push(charset[randomIndex]);
  }
  const ret = retArr.join('');
  return ret;
}
