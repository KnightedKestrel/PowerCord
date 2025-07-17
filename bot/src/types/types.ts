export interface Lifter {
    name: string;
    meets: {
        Place: number;
        Federation: string;
        Date: string;
        MeetCountry: string;
        MeetState: string | null;
        MeetName: string;
        Division: string | null;
        Age: number | null;
        Equipment: string;
        Class: number | null;
        Weight: number | null;
        Squat: number | null;
        Bench: number | null;
        Deadlift: number | null;
        Total: number | null;
        Dots: number | null;
    }[];
}

export interface Meet {
    meetName: string;
    entries: {
        Place: number;
        Federation: string;
        Date: string;
        MeetCountry: string;
        MeetState: string | null;
        MeetName: string;
        Division: string | null;
        Name: string;
        Age: number | null;
        Equipment: string;
        Class: number | null;
        Weight: number | null;
        Squat: number | null;
        Bench: number | null;
        Deadlift: number | null;
        Total: number | null;
        Dots: number | null;
    }[];
}

export interface TopLifter {
    Name: string;
    Sex: string;
    Squat: number;
    Bench: number;
    Deadlift: number;
    Total: number;
    Dots: number;
}
