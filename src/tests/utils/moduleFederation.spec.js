import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/utils/env', () => ({ default: vi.fn() }));

async function loadModule(publicPathUrl, origin = 'http://localhost') {
  vi.resetModules();

  const getEnv = (await import('@/utils/env')).default;
  getEnv.mockReturnValue(publicPathUrl);

  Object.defineProperty(window, 'location', {
    value: { origin },
    writable: true,
  });

  const { isFederatedModule } = await import('@/utils/moduleFederation');
  return isFederatedModule;
}

describe('isFederatedModule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns false when PUBLIC_PATH_URL is a relative path "/"', async () => {
    const result = await loadModule('/');
    expect(result).toBe(false);
  });

  it('returns false when PUBLIC_PATH_URL is empty', async () => {
    const result = await loadModule('');
    expect(result).toBe(false);
  });

  it('returns false when PUBLIC_PATH_URL is undefined', async () => {
    const result = await loadModule(undefined);
    expect(result).toBe(false);
  });

  it('returns false when PUBLIC_PATH_URL matches the current origin', async () => {
    const result = await loadModule('http://localhost:5174/', 'http://localhost:5174');
    expect(result).toBe(false);
  });

  it('returns true when PUBLIC_PATH_URL is a different absolute URL', async () => {
    const result = await loadModule(
      'https://integrations.stg.cloud.weni.ai/',
      'http://localhost:5174',
    );
    expect(result).toBe(true);
  });

  it('ignores trailing slashes when comparing origins', async () => {
    const result = await loadModule(
      'https://integrations.stg.cloud.weni.ai',
      'https://integrations.stg.cloud.weni.ai',
    );
    expect(result).toBe(false);
  });
});
