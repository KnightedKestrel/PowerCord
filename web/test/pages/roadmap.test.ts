import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import Roadmap from '../../app/pages/roadmap.vue';

describe('Roadmap', () => {
    it('can mount the component', async () => {
        const component = await mountSuspended(Roadmap);
        expect(component.vm).toBeTruthy();
    });

    it('matches the snapshot', async () => {
        const component = await mountSuspended(Roadmap);
        expect(component.html()).toMatchSnapshot();
    });

    it('renders an iframe with the correct volta.net src', async () => {
        const component = await mountSuspended(Roadmap);
        const parser = new DOMParser();
        const doc = parser.parseFromString(component.html(), 'text/html');

        const iframe = doc.querySelector('iframe');
        expect(iframe).toBeTruthy();

        const src = iframe?.getAttribute('src') || '';
        expect(src).toContain('https://volta.net/embed/');
        expect(src).toContain('theme=');
        expect(src).toContain('primary=');
        expect(src).toContain('gray=');
    });
});
