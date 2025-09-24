import { type TournamentResults } from "$lib/data/winners";

export interface PlayerResults {
    name: string;
    initials: string;
    id: number;
    picks: TournamentResults;
}

const p = (n: number): number => {
    return ({
        '-1': 0,
        '609': 1,
        '26': 2,
        '909': 3,
        '503': 4,
        '901': 5,
        '99': 6,
        '856': 7,
        '602': 8,
        '128': 9,
        '32': 10,
        '910': 11
    }[n]) ?? -1
}

export const players: PlayerResults[] = [
    {
        name: "Hertel",
        initials: "MH",
        id: 1,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [1, 3, 5, 7], 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [8, 10, 9, 7],
            
            // Semifinals winners (2 matches)
            round3Winners: [10, 7],
            
            // Finals winner (1 match)
            round4Winner: 10,
            
            // Overall champion
            champion: 10
        }
    },
    {
        name: "Basit",
        initials: "BS",
        id: 2,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [-1, 909, 901, 856].map(p), 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 909, 32, 910].map(p),
            
            // Semifinals winners (2 matches)
            round3Winners: [32, 910].map(p),
            
            // Finals winner (1 match)
            round4Winner: p(32),
            
            // Overall champion
            champion: p(32)
        }
    },
    {
        name: "Pete",
        initials: "PH",
        id: 3,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [609, 909, 901, 99].map(p), 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 128, 32, 910].map(p),
            
            // Semifinals winners (2 matches)
            round3Winners: [32, 128].map(p),
            
            // Finals winner (1 match)
            round4Winner: p(32),
            
            // Overall champion
            champion: p(32)
        }
    },
    {
        name: "Jason",
        initials: "JG",
        id: 4,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [609, 909, 901, 856].map(p), 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 128, 32, 856].map(p),
            
            // Semifinals winners (2 matches)
            round3Winners: [602, 128].map(p),
            
            // Finals winner (1 match)
            round4Winner: p(128),
            
            // Overall champion
            champion: p(128)
        }
    },
    {
        name: "Karel",
        initials: "KK",
        id: 5,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [-1, 909, 901, 99].map(p), 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 128, 32, 910].map(p),
            
            // Semifinals winners (2 matches)
            round3Winners: [602, 910].map(p),
            
            // Finals winner (1 match)
            round4Winner: p(602),
            
            // Overall champion
            champion: p(602)
        }
    },
    {
        name: "Pranav",
        initials: "PG",
        id: 6,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [609, 909, 901, 99].map(p), 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 128, 32, 910].map(p),
            
            // Semifinals winners (2 matches)
            round3Winners: [32, 910].map(p),
            
            // Finals winner (1 match)
            round4Winner: p(32),
            
            // Overall champion
            champion: p(32)
        }
    },
    {
        name: "Yukie",
        initials: "YK",
        id: 7,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [609, 909, 503, 856].map(p), 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 128, 32, 856].map(p),
            
            // Semifinals winners (2 matches)
            round3Winners: [602, 128].map(p),
            
            // Finals winner (1 match)
            round4Winner: p(602),
            
            // Overall champion
            champion: p(602)
        }
    },
    {
        name: "Sandeep",
        initials: "SD",
        id: 8,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [609, 26, 901, 99].map(p), 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 128, 901, 99].map(p),
            
            // Semifinals winners (2 matches)
            round3Winners: [602, 99].map(p),
            
            // Finals winner (1 match)
            round4Winner: p(602),
            
            // Overall champion
            champion: p(602)
        }
    },
    {
        name: "Natalie",
        initials: "NB",
        id: 9,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [-1, 909, 503, 856].map(p), 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [-1, 128, 32, 910].map(p),
            
            // Semifinals winners (2 matches)
            round3Winners: [32, 910].map(p),
            
            // Finals winner (1 match)
            round4Winner: p(32),
            
            // Overall champion
            champion: p(32)
        }
    },
    {
        name: "Sarah",
        initials: "SS",
        id: 10,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [-1, 909, 901, 856].map(p), 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 128, 32, 910].map(p),
            
            // Semifinals winners (2 matches)
            round3Winners: [602, 128].map(p),
            
            // Finals winner (1 match)
            round4Winner: p(602),
            
            // Overall champion
            champion: p(602)
        }
    },
    {
        name: "Pratik",
        initials: "PP",
        id: 11,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [609, 909, 901, 99].map(p), 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 128, 32, 99].map(p),
            
            // Semifinals winners (2 matches)
            round3Winners: [602, 128].map(p),
            
            // Finals winner (1 match)
            round4Winner: p(602),
            
            // Overall champion
            champion: p(602)
        }
    },
    {
        name: "Mike",
        initials: "MS",
        id: 12,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [-1, 26, 503, 99].map(p), 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [-1, 128, 32, 99].map(p),
            
            // Semifinals winners (2 matches)
            round3Winners: [-1, 128].map(p),
            
            // Finals winner (1 match)
            round4Winner: p(-1),
            
            // Overall champion
            champion: p(-1)
        }
    },
    {
        name: "Paula",
        initials: "PN",
        id: 13,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [609, 909, 503, 99].map(p), 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 909, 32, 99].map(p),
            
            // Semifinals winners (2 matches)
            round3Winners: [602, 99].map(p),
            
            // Finals winner (1 match)
            round4Winner: p(602),
            
            // Overall champion
            champion: p(602)
        }
    },
    {
        name: "Hannah",
        initials: "HC",
        id: 14,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [-1, 909, 901, 99].map(p), 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 128, 32, 99].map(p),
            
            // Semifinals winners (2 matches)
            round3Winners: [602, 128].map(p),
            
            // Finals winner (1 match)
            round4Winner: p(602),
            
            // Overall champion
            champion: p(602)
        }
    },

]