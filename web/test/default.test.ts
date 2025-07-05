import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import DefaultLayout from '../layouts/default.vue';

describe('DefaultLayout', () => {
    it('renders header, footer, and slot', async () => {
        const component = await mountSuspended(DefaultLayout, {
            slots: { default: '<div>Page Content</div>' },
        });
        expect(component.html()).toContain('Page Content');
        expect(component.html()).toContain('PowerCord');
    });

    it('matches the snapshot', async () => {
        const component = await mountSuspended(DefaultLayout);
        expect(component.html()).toMatchSnapshot();
    });
});
