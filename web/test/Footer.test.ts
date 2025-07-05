import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import Footer from '../components/Footer.vue';

describe('Footer', () => {
    it('can mount the component', async () => {
        const component = await mountSuspended(Footer);
        expect(component.vm).toBeTruthy();
    });

    it('matches the snapshot', async () => {
        const component = await mountSuspended(Footer);
        expect(component.html()).toMatchSnapshot();
    });
});
