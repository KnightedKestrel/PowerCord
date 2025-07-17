import { matchSorter } from 'match-sorter';
import { Lifter, Meet, TopLifter } from '../types/types';
import { lifterData } from './mock/lifter';
import { meetData } from './mock/meet';
import { topLifterData } from './mock/top';

// export function getLifter(name: string): Lifter | undefined {
//     const lifterNames = lifterData.map((l: any) => l.name);
//     const sortedNames = matchSorter(lifterNames, name);
//     const closestName = sortedNames[0] || lifterNames[0];
//     const closestLifter = lifterData.find((l: any) => l.name === closestName);
//     if (!closestLifter) return undefined;
//     return closestLifter.meets
//         .sort((a: any, b: any) => b.Dots - a.Dots)
//         .slice(0, 5);
// }

// export function getMeets(
//     meetName: string,
//     offset: number = 0,
// ): Meet[] | undefined {
//     const meetNames = meetData.map((m: any) => m.meetName);
//     const sortedNames = matchSorter(meetNames, meetName);
//     const closestName = sortedNames[0] || meetNames[0];
//     const closestMeet = meetData.find((m: any) => m.meetName === closestName);
//     if (!closestMeet) return undefined;
//     return closestMeet.entries
//         .sort((a: any, b: any) => b.Dots - a.Dots)
//         .slice(offset, offset + 5);
// }

export function getTopLifters(page: number = 1): TopLifter[] {
    const limit = 5;
    const offset = (page - 1) * limit;
    return topLifterData.slice(offset, offset + limit);
}
