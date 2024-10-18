import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AppImagesBanner from '@/components/app/AppImagesBanner.vue';

describe('AppImagesBanner.vue', () => {
  it('renders the images correctly', () => {
    const images = [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
      'https://example.com/image3.jpg',
    ];

    const wrapper = mount(AppImagesBanner, {
      props: { images },
    });

    const imageElements = wrapper.findAll('img.app-banner__image');
    expect(imageElements.length).toBe(images.length);

    imageElements.forEach((imageElement, index) => {
      expect(imageElement.attributes('src')).toBe(images[index]);
    });
  });
});
