import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import DefaultLayout from '../../app/layouts/default.vue';

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

    it('renders a header and footer landmark element', async () => {
        const component = await mountSuspended(DefaultLayout);
        expect(component.find('[role="banner"]').exists()).toBe(true);
        expect(component.find('[role="contentinfo"]').exists()).toBe(true);
    });

    it('renders slot content between header and footer', async () => {
        const component = await mountSuspended(DefaultLayout, {
            slots: { default: '<p id="slot-content">Hello</p>' },
        });
        const html = component.html();
        const bannerPos = html.indexOf('role="banner"');
        const slotPos = html.indexOf('slot-content');
        const footerPos = html.indexOf('role="contentinfo"');
        expect(bannerPos).toBeLessThan(slotPos);
        expect(slotPos).toBeLessThan(footerPos);
    });
});
