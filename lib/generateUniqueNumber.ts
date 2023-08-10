import { v4 as uuidv4 } from 'uuid';

export function generateUniqueNumber(prefix: string) {
  const uniqueId = uuidv4().split('-')[0].toUpperCase();
  return `${prefix}${uniqueId}`;
}
