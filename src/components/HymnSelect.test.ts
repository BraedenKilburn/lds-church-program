import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import HymnSelect from './HymnSelect.vue';

function mountHymnSelect() {
  return mount(HymnSelect, {
    props: {
      id: 'test-hymn',
      label: 'Test Hymn',
      modelValue: { number: '', title: '' },
      'onUpdate:modelValue': (value: { number: string; title: string }) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });
}

let wrapper: ReturnType<typeof mount<typeof HymnSelect>>;

describe('HymnSelect', () => {
  it('selects a hymn by clicking an option', async () => {
    wrapper = mountHymnSelect();

    await wrapper.find('input').trigger('focus');
    await wrapper.findAll('.hymn-option')[0]?.trigger('mousedown');

    expect(wrapper.props('modelValue')).toMatchObject({ number: '1' });
  });

  it('selects an exact number query on enter', async () => {
    wrapper = mountHymnSelect();
    const input = wrapper.find('input');

    await input.trigger('focus');
    await input.setValue('2');
    await input.trigger('keydown.enter');

    expect(wrapper.props('modelValue')).toMatchObject({ number: '2' });
  });

  it('clears the selected hymn', async () => {
    wrapper = mount(HymnSelect, {
      props: {
        id: 'test-hymn',
        label: 'Test Hymn',
        modelValue: { number: '1', title: 'The Morning Breaks' },
      },
    });

    await nextTick();
    await wrapper.find('.hymn-clear-btn').trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ number: '', title: '' }]);
  });
});
