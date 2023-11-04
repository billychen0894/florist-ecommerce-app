'use server';

import { getPlaiceholder } from '@node_modules/plaiceholder';

export const generateBase64 = async (src: string) => {
  try {
    const res = await fetch(src);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch image: ${res.status}; ${res.statusText}`
      );
    }

    const buffer = await res.arrayBuffer();
    const { base64 } = await getPlaiceholder(Buffer.from(buffer));

    return base64;
  } catch (err) {
    console.error('Generate Base64 Error:', err);
  }
};
