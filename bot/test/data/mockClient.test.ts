import { describe, expect, it } from 'vitest';
import { lifterData } from '../../src/data/mock/lifter';
import { meetData } from '../../src/data/mock/meet';
import { topLifterData } from '../../src/data/mock/top';
import { getLifter, getMeet, getTopLifters } from '../../src/data/mockClient';

describe('getLifter', () => {
    it('returns the lifter with an exact match', async () => {
        const result = await getLifter('Hercules');
        expect(result).toEqual(lifterData.find((l) => l.name === 'Hercules'));
    });

    it('returns the closest matching lifter with fuzzy search', async () => {
        const result = await getLifter('Hercul');
        expect(result?.name).toBe('Hercules');
    });

    it('returns undefined if there is no close match', async () => {
        const result = await getLifter('NonExistentName');
        expect(result).toBeUndefined();
    });
});

describe('getMeet', () => {
    it('returns the meet with an exact match', async () => {
        const result = await getMeet('Labors of Strength');
        expect(result).toEqual(
            meetData.find((m) => m.name === 'Labors of Strength'),
        );
    });

    it('returns the closest matching meet with fuzzy search', async () => {
        const result = await getMeet('Labor of Strength');
        expect(result?.name).toBe('Labors of Strength');
    });

    it('returns undefined if there is no close match', async () => {
        const result = await getMeet('NonExistentMeet');
        expect(result).toBeUndefined();
    });
});

describe('getTopLifters', () => {
    it('returns the first page of top lifters by default', async () => {
        const result = await getTopLifters();
        expect(result).toEqual(topLifterData.slice(0, 5));
        expect(result?.length).toBe(5);
    });

    it('returns the specified page of top lifters', async () => {
        const result = await getTopLifters(2);
        expect(result).toEqual(topLifterData.slice(5, 10));
    });

    it('returns an empty array for pages out-of-bounds', async () => {
        const result = await getTopLifters(10);
        expect(result).toEqual([]);
    });
});
