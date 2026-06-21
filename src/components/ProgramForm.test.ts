import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import ProgramForm from './ProgramForm.vue';
import { useProgramStore } from '../stores/programStore';

vi.mock('../services/pdf/pdfActions', () => ({
  downloadProgramPdf: vi.fn(() => new Promise<void>((resolve) => window.setTimeout(resolve, 50))),
  openProgramPdf: vi.fn(),
}));

describe('ProgramForm', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('blocks PDF generation when required fields are missing', async () => {
    const wrapper = mount(ProgramForm, {
      global: {
        plugins: [createPinia()],
        stubs: {
          VueDraggable: { template: '<div><slot /></div>' },
        },
      },
    });

    await wrapper.find('.primary-btn').trigger('click');

    expect(wrapper.text()).toContain('Please fix the required fields');
    expect(wrapper.text()).toContain('Ward name is required.');
  });

  it('shows loading state while a PDF is being generated', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(ProgramForm, {
      global: {
        plugins: [pinia],
        stubs: {
          VueDraggable: { template: '<div><slot /></div>' },
        },
      },
    });
    const store = useProgramStore();
    store.program.wardName = 'Example Ward';
    store.program.meetingDate = '2026-06-07';
    store.program.openingHymn = { number: '1', title: 'The Morning Breaks' };
    store.program.sacramentHymn = { number: '169', title: 'As Now We Take the Sacrament' };
    store.program.closingHymn = { number: '2', title: 'The Spirit of God' };

    await nextTick();
    await wrapper.find('.primary-btn').trigger('click');

    expect(wrapper.text()).toContain('Generating...');
  });

  it('switches between congregational hymn and special music without clearing hidden values', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(ProgramForm, {
      global: {
        plugins: [pinia],
        stubs: {
          VueDraggable: { template: '<div><slot /></div>' },
        },
      },
    });
    const store = useProgramStore();
    store.program.isFastSunday = false;

    await nextTick();

    expect(wrapper.text()).toContain('Congregational Hymn');
    expect(wrapper.text()).toContain('Special Musical Number');

    await wrapper.findAll('.segmented-button')[1]?.trigger('click');
    await nextTick();

    expect(wrapper.find('#special-music-title').exists()).toBe(true);
    expect(wrapper.find('#special-music-description').exists()).toBe(true);

    await wrapper.find('#special-music-title').setValue("Father's Day Musical Number");
    await wrapper.find('#special-music-description').setValue('Primary children singing');
    await wrapper.findAll('.segmented-button')[0]?.trigger('click');
    await nextTick();

    expect(wrapper.find('#congregational-hymn').exists()).toBe(true);
    expect(store.program.specialMusic).toEqual({
      title: "Father's Day Musical Number",
      description: 'Primary children singing',
    });
  });
});
