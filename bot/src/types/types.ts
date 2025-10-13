// Documentation on data used
// https://gitlab.com/openpowerlifting/opl-data/blob/main/docs/data-readme.md

// Largely based on
// https://gitlab.com/openpowerlifting/opl-data/blob/main/scripts/compile-sqlite

export interface Lifter {
    name: string;
    sex?: string;
    url?: string;
    meets: {
        place: number;
        federation: string;
        date: string;
        country: string;
        state?: string;
        name: string;
        division?: string;
        age?: number;
        equipment: string;
        weightClass?: number;
        bodyWeight?: number;
        squat?: number;
        bench?: number;
        deadlift?: number;
        total?: number;
        dots?: number;
    }[];
    personalBests?: {
        equipment: string;
        squat?: string;
        bench?: string;
        deadlift?: string;
        total: string;
        dots: string;
    }[];
}

export interface Meet {
    name: string;
    federation: string;
    date: string;
    country: string;
    state?: string;
    town?: string;
    entries: {
        place: number;
        name: string;
        sex: string;
        age?: number;
        equipment: string;
        weightClass?: number;
        bodyWeight?: number;
        squat?: number;
        bench?: number;
        deadlift?: number;
        total?: number;
        dots?: number;
    }[];
}

export interface TopLifter {
    name: string;
    sex: string;
    url?: string;
    squat: number;
    bench: number;
    deadlift: number;
    total: number;
    dots: number;
}
