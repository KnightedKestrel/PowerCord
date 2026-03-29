import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import Header from '../../app/components/Header.vue';

describe('Header', () => {
    it('can mount the component', async () => {
        const component = await mountSuspended(Header);
        expect(component.vm).toBeTruthy();
    });

    it('matches the snapshot', async () => {
        const component = await mountSuspended(Header);
        expect(component.html()).toMatchSnapshot();
    });

    it('displays the PowerCord logo text', async () => {
        const component = await mountSuspended(Header);
        expect(component.text()).toContain('PowerCord');
    });

    it('has a banner role on the header element', async () => {
        const component = await mountSuspended(Header);
        expect(component.find('[role="banner"]').exists()).toBe(true);
    });

    it('exposes nav items for all three navigation links', async () => {
        const component = await mountSuspended(Header);
        const navItems = (component.vm as any).navItems;
        const labels = navItems[0].map((item: any) => item.label);
        expect(labels).toContain('Roadmap');
        expect(labels).toContain('Source');
        expect(labels).toContain('Support Server');
    });
});
