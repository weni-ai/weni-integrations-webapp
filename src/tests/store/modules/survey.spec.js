import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { survey_store } from '@/stores/modules/survey.store';
import surveyApi from '@/api/survey';
import setLocal from '@/utils/storage';
vi.mock('@/api/survey', () => ({
  default: {
    submitSurveyAnswer: vi.fn(),
  },
}));

vi.mock('@/utils/storage', () => ({
  default: vi.fn(),
}));

describe('survey_store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const store = survey_store();
    expect(store.surveyStatus).toBe('TO_ANSWER');
    expect(store.loadingSurveyAnswer).toBe(false);
    expect(store.errorSurveyAnswer).toBeNull();
    expect(store.surveyAnswerResult).toBeNull();
  });

  it('should set survey status and update local storage', () => {
    const store = survey_store();
    const mockStatus = 'ANSWERED';

    store.setSurveyStatus({ status: mockStatus });

    expect(store.surveyStatus).toBe(mockStatus);

    expect(setLocal).toHaveBeenCalledWith('surveyStatus', mockStatus);
  });

  it('should submit survey answer and update state', async () => {
    const store = survey_store();
    const mockPayload = { answer: 'Yes' };
    const mockData = { success: true };

    surveyApi.submitSurveyAnswer.mockResolvedValue({ data: mockData });

    await store.submitSurveyAnswer({ payload: mockPayload });

    expect(store.loadingSurveyAnswer).toBe(false);
    expect(store.errorSurveyAnswer).toBeNull();
    expect(store.surveyAnswerResult).toEqual(mockData);
    expect(surveyApi.submitSurveyAnswer).toHaveBeenCalledWith(mockPayload);
  });

  it('should handle error when submitting survey answer', async () => {
    const store = survey_store();
    const mockPayload = { answer: 'Yes' };
    const mockError = new Error('Submission failed');

    surveyApi.submitSurveyAnswer.mockRejectedValue(mockError);

    await store.submitSurveyAnswer({ payload: mockPayload });

    expect(store.loadingSurveyAnswer).toBe(false);
    expect(store.errorSurveyAnswer).toBe(mockError);
    expect(store.surveyAnswerResult).toBeNull();
    expect(surveyApi.submitSurveyAnswer).toHaveBeenCalledWith(mockPayload);
  });
});
