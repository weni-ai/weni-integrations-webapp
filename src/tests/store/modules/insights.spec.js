import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { insights_store } from '@/stores/modules/insights.store';
import insights from '@/api/insights';

vi.mock('@/api/insights', () => ({
  default: {
    get_template_analytics: vi.fn(),
    get_templates: vi.fn(),
    set_active_project: vi.fn(),
  },
}));

describe('insights_store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default state', () => {
    const store = insights_store();
    expect(store.isActive).toBe(false);
    expect(store.templateAnalytics).toEqual([]);
    expect(store.loadingTemplateAnalytics).toBe(false);
    expect(store.errorTemplateAnalytics).toBeNull();
    expect(store.selectedTemplate).toBeNull();
    expect(store.appUuid).toBeNull();
    expect(store.templates).toEqual([]);
    expect(store.errorTemplates).toBeNull();
  });

  it('should fetch template analytics and update state', async () => {
    const store = insights_store();
    const mockData = [{ id: 1, name: 'Test Analytics' }];
    insights.get_template_analytics.mockResolvedValue(mockData);

    await store.getTemplateAnalytics({ app_uuid: 'test-uuid', filters: {} });

    expect(store.loadingTemplateAnalytics).toBe(false);
    expect(store.templateAnalytics).toEqual(mockData);
    expect(store.errorTemplateAnalytics).toBeNull();
    expect(insights.get_template_analytics).toHaveBeenCalledWith('test-uuid', {});
  });

  it('should handle error when fetching template analytics', async () => {
    const store = insights_store();
    const mockError = new Error('Test Error');
    insights.get_template_analytics.mockRejectedValue({ response: { data: { error: mockError } } });

    await store.getTemplateAnalytics({ app_uuid: 'test-uuid', filters: {} });

    expect(store.loadingTemplateAnalytics).toBe(false);
    expect(store.templateAnalytics).toBeNull();
    expect(store.errorTemplateAnalytics).toBe(mockError);
  });

  it('should fetch templates and update state', async () => {
    const store = insights_store();
    const mockData = [{ id: 1, name: 'Test Template' }];
    insights.get_templates.mockResolvedValue(mockData);

    await store.getTemplates({ app_uuid: 'test-uuid' });

    expect(store.templates).toEqual(mockData);
    expect(store.errorTemplates).toBeNull();
    expect(insights.get_templates).toHaveBeenCalledWith('test-uuid');
  });

  it('should handle error when fetching templates', async () => {
    const store = insights_store();
    const mockError = new Error('Test Error');
    insights.get_templates.mockRejectedValue({ response: { data: { error: mockError } } });

    await store.getTemplates({ app_uuid: 'test-uuid' });

    expect(store.templates).toEqual([]);
    expect(store.errorTemplates).toBe(mockError);
  });

  it('should set active project', async () => {
    const store = insights_store();

    await store.setActiveProject({ app_uuid: 'test-uuid' });

    expect(store.isActive).toBe(true);
    expect(insights.set_active_project).toHaveBeenCalledWith('test-uuid');
  });

  it('should set has insights', () => {
    const store = insights_store();
    store.setHasInsights({ isActive: true });

    expect(store.isActive).toBe(true);
  });

  it('should set selected template', () => {
    const store = insights_store();
    const mockTemplate = { id: 1, name: 'Test Template' };
    store.setSelectedTemplate({ template: mockTemplate });

    expect(store.selectedTemplate).toEqual(mockTemplate);
  });

  it('should set app uuid', () => {
    const store = insights_store();
    store.setAppUuid({ appUuid: 'test-uuid' });

    expect(store.appUuid).toBe('test-uuid');
  });
});
