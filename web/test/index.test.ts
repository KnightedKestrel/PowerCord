import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import Index from '../pages/index.vue';

describe('Index', () => {
    it('can mount the component', async () => {
        const component = await mountSuspended(Index);
        expect(component.vm).toBeTruthy();
    });
});
