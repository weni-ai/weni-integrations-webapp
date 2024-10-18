import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { auth_store } from '@/stores/modules/auth.store';
import auth from '@/api/auth';
import window from 'global/window';

vi.mock('@/api/auth', () => ({
  default: {
    getFlowToken: vi.fn(),
    getFlowOrganization: vi.fn(),
  },
}));

vi.mock('global/window', () => ({
  default: {
    localStorage: {
      getItem: vi.fn(),
      setItem: vi.fn(),
    },
  },
}));

vi.mock('../../utils/storage', () => ({
  default: vi.fn(),
}));

describe('auth_store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default state', () => {
    const store = auth_store();
    expect(store.token).toBeNull();
    expect(store.org).toBeNull();
    expect(store.project).toBeNull();
    expect(store.flowOrg).toBeNull();
    expect(store.flowToken).toBeNull();
    expect(store.loadingFlowToken).toBeNull();
    expect(store.errorFlowToken).toBeNull();
  });

  it('should set token and store it locally on externalLogin', async () => {
    const store = auth_store();
    await store.externalLogin({ token: 'test-token' });
    expect(store.token).toBe('test-token');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('authToken', 'test-token');
  });

  it('should set org and store it locally on selectedOrg', async () => {
    const store = auth_store();
    await store.selectedOrg({ org: 'test-org' });
    expect(store.org).toBe('test-org');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('org', 'test-org');
  });

  it('should set project and store it locally on selectedProject', async () => {
    const store = auth_store();
    await store.selectedProject({ project: 'test-project' });
    expect(store.project).toBe('test-project');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('project', 'test-project');
  });

  it('should set flowOrg and store it locally on selectedFlowOrg', async () => {
    const store = auth_store();
    await store.selectedFlowOrg({ flowOrg: 'test-flowOrg' });
    expect(store.flowOrg).toBe('test-flowOrg');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('flowOrg', 'test-flowOrg');
  });

  it('should retrieve and set token from localStorage', () => {
    const store = auth_store();
    window.localStorage.getItem.mockReturnValue('stored-token');
    store.retriveAuthToken();
    expect(store.token).toBe('stored-token');
  });

  it('should retrieve and set org from localStorage', () => {
    const store = auth_store();
    window.localStorage.getItem.mockReturnValue('stored-org');
    store.retriveSelectedOrg();
    expect(store.org).toBe('stored-org');
  });

  it('should retrieve and set project from localStorage', () => {
    const store = auth_store();
    window.localStorage.getItem.mockReturnValue('stored-project');
    store.retriveSelectedProject();
    expect(store.project).toBe('stored-project');
  });

  it('should retrieve and set flowOrg from localStorage', () => {
    const store = auth_store();
    window.localStorage.getItem.mockReturnValue('stored-flowOrg');
    store.retriveSelectedFlowOrg();
    expect(store.flowOrg).toBe('stored-flowOrg');
  });

  it('should handle getFlowToken correctly', async () => {
    const store = auth_store();
    auth.getFlowToken.mockResolvedValue({ data: { api_token: 'test-flowToken' } });

    await store.getFlowToken();

    expect(store.loadingFlowToken).toBe(false);
    expect(store.flowToken).toBe('test-flowToken');
    expect(store.errorFlowToken).toBeNull();
  });

  it('should handle getFlowToken error correctly', async () => {
    const store = auth_store();
    const error = new Error('test-error');
    auth.getFlowToken.mockRejectedValue(error);

    await store.getFlowToken();

    expect(store.loadingFlowToken).toBe(false);
    expect(store.flowToken).toBeNull();
    expect(store.errorFlowToken).toBe(error);
  });

  it('should fetch and set flowOrg if not set', async () => {
    const store = auth_store();
    auth.getFlowOrganization.mockResolvedValue({ data: 'test-flowOrg' });
    store.project = 'test-project';

    await store.getFlowOrganization();

    expect(store.flowOrg).toBe('test-flowOrg');
    expect(auth.getFlowOrganization).toHaveBeenCalledWith('test-project');
  });
});
