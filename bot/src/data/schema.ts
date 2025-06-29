// Documentation on data used
// https://gitlab.com/openpowerlifting/opl-data/blob/main/docs/data-readme.md

// Largely based on
// https://gitlab.com/openpowerlifting/opl-data/blob/main/scripts/compile-sqlite

export const schema = `
    CREATE TABLE IF NOT EXISTS opl_data_version (
        UpdatedDate TEXT PRIMARY KEY UNIQUE
    );

    CREATE TABLE IF NOT EXISTS entries (
        EntryID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Sex TEXT CHECK(Sex IN ('M', 'F', 'Mx')) NOT NULL,
        Event TEXT CHECK(Event IN ('SBD', 'BD', 'SD', 'SB', 'S', 'B', 'D')) NOT NULL,
        Equipment TEXT NOT NULL,
        Age FLOAT,
        AgeClass TEXT,
        BirthYearClass TEXT,
        Division TEXT,
        BodyweightKg FLOAT,
        WeightClassKg FLOAT,
        Squat1Kg FLOAT,
        Squat2Kg FLOAT,
        Squat3Kg FLOAT,
        Squat4Kg FLOAT,
        Best3SquatKg FLOAT,
        Bench1Kg FLOAT,
        Bench2Kg FLOAT,
        Bench3Kg FLOAT,
        Bench4Kg FLOAT,
        Best3BenchKg FLOAT,
        Deadlift1Kg FLOAT,
        Deadlift2Kg FLOAT,
        Deadlift3Kg FLOAT,
        Deadlift4Kg FLOAT,
        Best3DeadliftKg FLOAT,
        TotalKg FLOAT,
        Place TEXT,
        Dots FLOAT,
        Wilks FLOAT,
        Glossbrenner FLOAT,
        Goodlift FLOAT,
        Tested TEXT,
        Country TEXT,
        State TEXT,
        Federation TEXT,
        ParentFederation TEXT,
        Date DATE NOT NULL,
        MeetCountry TEXT NOT NULL,
        MeetState TEXT,
        MeetTown TEXT,
        MeetName TEXT NOT NULL,
        Sanctioned TEXT
    );
`;

// TODO:
// Break up into real tables.
// Store the id at the end of the csv name along with the date for versioning

// CREATE TABLE IF NOT EXISTS meets (
//     MeetID INTEGER PRIMARY KEY AUTOINCREMENT,
//     Federation TEXT NOT NULL,
//     MeetDate DATE NOT NULL,
//     MeetCountry TEXT NOT NULL,
//     MeetState TEXT,
//     MeetTown TEXT,
//     MeetName TEXT NOT NULL,
//     RuleSet TEXT,
//     Sanctioned TEXT
// );

// CREATE TABLE IF NOT EXISTS entries (
//     EntryID INTEGER PRIMARY KEY AUTOINCREMENT,
//     MeetID INTEGER NOT NULL,
//     LifterID INTEGER NOT NULL,
//     Sex TEXT DEFAULT 'M' CHECK(Sex IN ('M', 'F', 'Mx')) NOT NULL,
//     Event TEXT CHECK(Event IN ('SBD', 'BD', 'SD', 'SB', 'S', 'B', 'D')) NOT NULL,
//     Equipment TEXT NOT NULL,
//     Age FLOAT,
//     AgeClass TEXT,
//     BirthYearClass TEXT,
//     Division TEXT,
//     BodyweightKg FLOAT,
//     WeightClassKg FLOAT,
//     Squat1Kg FLOAT,
//     Squat2Kg FLOAT,
//     Squat3Kg FLOAT,
//     Squat4Kg FLOAT,
//     Best3SquatKg FLOAT,
//     Bench1Kg FLOAT,
//     Bench2Kg FLOAT,
//     Bench3Kg FLOAT,
//     Bench4Kg FLOAT,
//     Best3BenchKg FLOAT,
//     Deadlift1Kg FLOAT,
//     Deadlift2Kg FLOAT,
//     Deadlift3Kg FLOAT,
//     Deadlift4Kg FLOAT,
//     Best3DeadliftKg FLOAT,
//     TotalKg FLOAT,
//     Place TEXT,
//     Wilks FLOAT,
//     McCulloch FLOAT,
//     Glossbrenner FLOAT,
//     Goodlift FLOAT,
//     Wilks2020 FLOAT,
//     Dots FLOAT,
//     Tested TEXT,
//     Country TEXT,
//     State TEXT,

//     FOREIGN KEY (MeetID) REFERENCES meets (MeetID),
//     FOREIGN KEY (LifterID) REFERENCES lifters (LifterID)
// );

// CREATE TABLE IF NOT EXISTS lifters (
//     LifterID INTEGER PRIMARY KEY AUTOINCREMENT,
//     Name TEXT NOT NULL,
//     CyrillicName TEXT,
//     ChineseName TEXT,
//     GreekName TEXT,
//     JapaneseName TEXT,
//     KoreanName TEXT,
//     Username TEXT UNIQUE NOT NULL,
//     Instagram TEXT,
//     Color TEXT
// );
