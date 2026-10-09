// @ts-check

/**
 * ky HTTPError의 응답 본문에서 서버가 내려준 message를 읽는다.
 * 본문이 없거나 JSON이 아니면 fallback을 돌려준다.
 *
 * @param {unknown} err
 * @param {string} fallback
 * @returns {Promise<string>}
 */
export const readErrorMessage = async (err, fallback) => {
  const response = /** @type {{ response?: Response }} */ (err)?.response;
  const body = await response?.json?.().catch(() => null);

  return typeof body?.message === 'string' && body.message
    ? body.message
    : fallback;
};
