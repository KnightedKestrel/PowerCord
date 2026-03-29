import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import Index from '../../app/pages/index.vue';

describe('Index', () => {
    it('can mount the component', async () => {
        const component = await mountSuspended(Index);
        expect(component.vm).toBeTruthy();
    });

    it('matches the snapshot', async () => {
        const component = await mountSuspended(Index);
        expect(component.html()).toMatchSnapshot();
    });

    it('renders all 4 feature cards', async () => {
        const component = await mountSuspended(Index);
        const features = (component.vm as any).features;
        expect(features).toHaveLength(4);
    });

    it('feature titles are present in rendered output', async () => {
        const component = await mountSuspended(Index);
        expect(component.text()).toContain('Zero Configuration');
        expect(component.text()).toContain('Always Up-to-date');
        expect(component.text()).toContain('Open Source');
        expect(component.text()).toContain('Support Available');
    });

    it('contains Add to Discord and View on GitHub CTA buttons', async () => {
        const component = await mountSuspended(Index);
        expect(component.text()).toContain('Add to Discord');
        expect(component.text()).toContain('View on GitHub');
    });
});
