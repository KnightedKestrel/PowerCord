import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import Header from '../components/Header.vue';

describe('Header', () => {
    it('can mount the component', async () => {
        const component = await mountSuspended(Header);
        expect(component.vm).toBeTruthy();
    });

    it('matches the snapshot', async () => {
        const component = await mountSuspended(Header);
        expect(component.html()).toMatchSnapshot();
    });
});
