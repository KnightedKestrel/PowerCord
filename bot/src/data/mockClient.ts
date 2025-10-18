import { matchSorter } from 'match-sorter';
import { Lifter, Meet, TopLifter } from '../types/types';
import { lifterData } from './mock/lifter';
import { meetData } from './mock/meet';
import { topLifterData } from './mock/top';

export async function getLifter(name: string): Promise<Lifter | undefined> {
    const lifterNames = lifterData.map((l) => l.name);
    const sortedNames = matchSorter(lifterNames, name);
    if (sortedNames.length === 0) return undefined;
    const closestName = sortedNames[0];
    return lifterData.find((l) => l.name === closestName);
}

export async function getMeet(name: string): Promise<Meet | undefined> {
    const meetNames = meetData.map((m) => m.name);
    const sortedNames = matchSorter(meetNames, name);
    if (sortedNames.length === 0) return undefined;
    const closestName = sortedNames[0];
    return meetData.find((m) => m.name === closestName);
}

export async function getTopLifters(
    page: number = 1,
): Promise<TopLifter[] | undefined> {
    const limit = 5;
    const offset = (page - 1) * limit;
    return topLifterData.slice(offset, offset + limit);
}

export async function getLifterAutocomplete(
    query: string,
    limit: number = 10,
): Promise<string[] | undefined> {
    const lifterNames = lifterData.map((l) => l.name);
    const sortedNames = matchSorter(lifterNames, query);
    return sortedNames.slice(0, limit);
}

export async function getMeetAutocomplete(
    query: string,
    limit: number = 10,
): Promise<string[] | undefined> {
    const meetNames = meetData.map((m) => m.name);
    const sortedNames = matchSorter(meetNames, query);
    return sortedNames.slice(0, limit);
}
