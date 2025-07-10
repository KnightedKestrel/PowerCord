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
});
