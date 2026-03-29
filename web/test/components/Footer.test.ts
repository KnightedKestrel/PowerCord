import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import Footer from '../../app/components/Footer.vue';

describe('Footer', () => {
    it('can mount the component', async () => {
        const component = await mountSuspended(Footer);
        expect(component.vm).toBeTruthy();
    });

    it('matches the snapshot', async () => {
        const component = await mountSuspended(Footer);
        expect(component.html()).toMatchSnapshot();
    });

    it('displays copyright text with current year', async () => {
        const component = await mountSuspended(Footer);
        const currentYear = new Date().getFullYear();
        expect(component.text()).toContain('Copyright');
        expect(component.text()).toContain(String(currentYear));
    });

    it('contains the AGPLv3 license link', async () => {
        const component = await mountSuspended(Footer);
        const link = component.find('a[href*="LICENSE"]');
        expect(link.exists()).toBe(true);
        expect(link.text()).toContain('AGPLv3');
    });

    it('has a contentinfo role on the footer element', async () => {
        const component = await mountSuspended(Footer);
        expect(component.find('[role="contentinfo"]').exists()).toBe(true);
    });
});
