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
});
