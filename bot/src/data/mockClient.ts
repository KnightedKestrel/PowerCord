import { matchSorter } from 'match-sorter';
import { Lifter, Meet, TopLifter } from '../types/types';
import { lifterData } from './mock/lifter';
import { meetData } from './mock/meet';
import { topLifterData } from './mock/top';

export function getLifter(name: string): Lifter | undefined {
    const lifterNames = lifterData.map((l) => l.name);
    const sortedNames = matchSorter(lifterNames, name);
    if (sortedNames.length === 0) return undefined;
    const closestName = sortedNames[0];
    return lifterData.find((l) => l.name === closestName);
}

export function getMeet(meetName: string): Meet | undefined {
    const meetNames = meetData.map((m) => m.name);
    const sortedNames = matchSorter(meetNames, meetName);
    if (sortedNames.length === 0) return undefined;
    const closestName = sortedNames[0];
    return meetData.find((m) => m.name === closestName);
}

export function getTopLifters(page: number = 1): TopLifter[] {
    const limit = 5;
    const offset = (page - 1) * limit;
    return topLifterData.slice(offset, offset + limit);
}
