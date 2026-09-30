import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  ky: vi.fn(),
  refreshToken: vi.fn(),
  setAuth: vi.fn(),
  clearAuth: vi.fn(),
}));

vi.mock('ky', () => ({
  default: mocks.ky,
  HTTPError: class HTTPError extends Error {},
}));

vi.mock('@/features/auth/api/index.js', () => ({
  refreshToken: mocks.refreshToken,
}));

vi.mock('@/features/auth/stores/use-auth-store.js', () => ({
  useAuthStore: {
    getState: () => ({
      setAuth: mocks.setAuth,
      clearAuth: mocks.clearAuth,
    }),
  },
}));

import { afterResponseHooks } from './after-response-hooks.js';

const hook = afterResponseHooks[0];

const unauthorizedResponse = () =>
  new Response(null, {
    status: 401,
    statusText: 'Unauthorized',
  });

describe('afterResponse refresh single-flight', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.ky.mockResolvedValue(
      new Response(null, {
        status: 200,
        statusText: 'OK',
      }),
    );
  });

  it('shares one refresh request across concurrent 401 responses and retries each request', async () => {
    let resolveRefresh;
    const refreshGate = new Promise((resolve) => {
      resolveRefresh = resolve;
    });

    mocks.refreshToken.mockReturnValue(refreshGate);

    const requests = [
      new Request('https://example.test/api/orders'),
      new Request('https://example.test/api/products'),
      new Request('https://example.test/api/statistics'),
    ];

    const pending = requests.map((request) =>
      hook(request, {}, unauthorizedResponse()),
    );

    expect(mocks.refreshToken).toHaveBeenCalledTimes(1);

    resolveRefresh({
      data: {
        user: { id: 'demo-user' },
        token: 'new-access-token',
      },
    });

    await Promise.all(pending);

    expect(mocks.refreshToken).toHaveBeenCalledTimes(1);
    expect(mocks.setAuth).toHaveBeenCalledTimes(3);
    expect(mocks.ky).toHaveBeenCalledTimes(3);

    for (const [retryRequest] of mocks.ky.mock.calls) {
      expect(retryRequest.headers.get('Authorization')).toBe(
        'Bearer new-access-token',
      );
    }
  });

  it('does not recursively refresh when the refresh endpoint itself returns 401', async () => {
    const request = new Request('https://example.test/api/auth/refresh');
    const response = unauthorizedResponse();

    const result = await hook(request, {}, response);

    expect(result).toBe(response);
    expect(mocks.refreshToken).not.toHaveBeenCalled();
    expect(mocks.ky).not.toHaveBeenCalled();
    expect(mocks.clearAuth).toHaveBeenCalledTimes(1);
  });

  it('passes through non-401 responses without starting refresh', async () => {
    const request = new Request('https://example.test/api/orders');
    const response = new Response(null, {
      status: 200,
      statusText: 'OK',
    });

    const result = await hook(request, {}, response);

    expect(result).toBe(response);
    expect(mocks.refreshToken).not.toHaveBeenCalled();
    expect(mocks.ky).not.toHaveBeenCalled();
  });
});
