import { type TournamentResults } from "$lib/data/winners";

export interface PlayerResults {
    name: string;
    initials: string;
    id: number;
    picks: TournamentResults;
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
            round1Winners: [0, 909, 901, 856], 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 909, 32, 910],
            
            // Semifinals winners (2 matches)
            round3Winners: [32, 910],
            
            // Finals winner (1 match)
            round4Winner: 32,
            
            // Overall champion
            champion: 32
        }
    },
    {
        name: "Pete",
        initials: "PH",
        id: 3,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [609, 909, 901, 99], 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 128, 32, 910],
            
            // Semifinals winners (2 matches)
            round3Winners: [32, 128],
            
            // Finals winner (1 match)
            round4Winner: 32,
            
            // Overall champion
            champion: 32
        }
    },
    {
        name: "Jason",
        initials: "JG",
        id: 4,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [609, 909, 901, 856], 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 128, 32, 856],
            
            // Semifinals winners (2 matches)
            round3Winners: [602, 128],
            
            // Finals winner (1 match)
            round4Winner: 128,
            
            // Overall champion
            champion: 128
        }
    },
    {
        name: "Karel",
        initials: "KK",
        id: 5,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [0, 909, 901, 99], 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 128, 32, 910],
            
            // Semifinals winners (2 matches)
            round3Winners: [602, 910],
            
            // Finals winner (1 match)
            round4Winner: 602,
            
            // Overall champion
            champion: 602
        }
    },
    {
        name: "Yukie",
        initials: "YK",
        id: 6,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [609, 909, 503, 856], 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 128, 32, 856],
            
            // Semifinals winners (2 matches)
            round3Winners: [602, 128],
            
            // Finals winner (1 match)
            round4Winner: 602,
            
            // Overall champion
            champion: 602
        }
    },
    {
        name: "Sandeep",
        initials: "SD",
        id: 7,
        picks: {
            // First Round winners (4 matches)
            round1Winners: [609, 26, 901, 99], 
            
            // Quarterfinals winners (4 matches) - includes byes from round 2
            round2Winners: [602, 128, 901, 99],
            
            // Semifinals winners (2 matches)
            round3Winners: [602, 99],
            
            // Finals winner (1 match)
            round4Winner: 602,
            
            // Overall champion
            champion: 602
        }
    }
]
