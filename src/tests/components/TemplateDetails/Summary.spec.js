import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import Summary from '@/components/TemplateDetails/Summary.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { templates } from '@/tests/views/mocks/appMock';

vi.mock('@/stores/modules/insights.store', () => {
  return {
    insights_store: () => ({
      getTemplateAnalytics: vi.fn(),
      selectedTemplate: templates.results,
    }),
  };
});

describe('Summary.vue', () => {
  let wrapper;

  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });
  beforeEach(() => {
    wrapper = mount(Summary, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $t: (msg) => msg,
        },
        methods: {
          fetchTemplateAnalyticsWeek: vi.fn(),
        },
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main and subtitle titles correctly', () => {
    const mainTitle = wrapper.find('.whatsapp_template_summary__title__main');
    const subtitle = wrapper.find('.whatsapp_template_summary__title__subtitle');
    expect(mainTitle.text()).toBe('Performace overview');
    expect(subtitle.text()).toBe('last 7 days');
  });

  it('displays the correct week values in the summary cards', () => {
    const sentMessages = wrapper.findAll('.whatsapp_template_summary__main__card__value')[0];
    const deliveredMessages = wrapper.findAll('.whatsapp_template_summary__main__card__value')[1];
    const readMessages = wrapper.findAll('.whatsapp_template_summary__main__card__value')[2];

    expect(sentMessages.text()).toBe('0');
    expect(deliveredMessages.text()).toBe('0');
    expect(readMessages.text()).toBe('0 (--%)');
  });

  it('calls fetchTemplateAnalyticsWeek on mount', async () => {
    const fetchTemplateAnalyticsWeekSpy = vi.spyOn(Summary.methods, 'fetchTemplateAnalyticsWeek');
    wrapper = mount(Summary, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $t: (msg) => msg,
        },
        methods: {
          fetchTemplateAnalyticsWeek: vi.fn(),
        },
      },
    });
    await wrapper.vm.$nextTick();
    expect(fetchTemplateAnalyticsWeekSpy).toHaveBeenCalled();
  });

  it('fetches template analytics for the past week with the correct parameters', async () => {
    const getTemplateAnalyticsSpy = vi
      .spyOn(wrapper.vm, 'getTemplateAnalytics')
      .mockResolvedValue({});
    await wrapper.vm.fetchTemplateAnalyticsWeek();

    expect(getTemplateAnalyticsSpy).toHaveBeenCalledWith({
      app_uuid: wrapper.vm.appUuid,
      filters: {
        start: wrapper.vm.formatDate(new Date(Date.now() - wrapper.vm.sevenDays)),
        end: wrapper.vm.formatDate(new Date()),
        fba_template_ids: wrapper.vm.selectedTemplate.translations?.map(
          (item) => item.message_template_id,
        ),
      },
    });
  });

  it('formats dates correctly', () => {
    const date = new Date('2024-08-21T12:00:00Z');
    expect(wrapper.vm.formatDate(date)).toBe('8-21-2024');
  });
});
