import { describe, expect, it } from 'vitest';

import { readErrorMessage } from './read-error-message.js';

const errorWith = (body) => ({
  response: { json: () => body },
});

describe('readErrorMessage', () => {
  it('returns the message sent by the server', async () => {
    const err = errorWith(
      Promise.resolve({ success: false, message: '재고 조정 수량이 0 미만입니다.' }),
    );

    await expect(readErrorMessage(err, 'fallback')).resolves.toBe(
      '재고 조정 수량이 0 미만입니다.',
    );
  });

  it('falls back when the body is not JSON', async () => {
    const err = errorWith(Promise.reject(new SyntaxError('Unexpected token')));

    await expect(readErrorMessage(err, 'fallback')).resolves.toBe('fallback');
  });

  it('falls back when message is missing or empty', async () => {
    await expect(
      readErrorMessage(errorWith(Promise.resolve({ success: false })), 'fallback'),
    ).resolves.toBe('fallback');
    await expect(
      readErrorMessage(errorWith(Promise.resolve({ message: '' })), 'fallback'),
    ).resolves.toBe('fallback');
  });

  it('falls back when the error has no response', async () => {
    await expect(readErrorMessage(new Error('network'), 'fallback')).resolves.toBe('fallback');
    await expect(readErrorMessage(undefined, 'fallback')).resolves.toBe('fallback');
  });
});
