import { env } from '../config/env';

/** S3 key paths vs full URLs (e.g. Google profile photos). */
export function resolveImageUrl(image) {
  if (!image) return '';
  if (/^https?:\/\//i.test(image)) {
    return image;
  }
  return `${env.staticUrl}/${image}`;
}
