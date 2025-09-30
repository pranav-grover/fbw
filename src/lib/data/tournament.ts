// Tournament structure - supports any number of rounds with easy data entry

export interface TournamentRound {
  id: string;           // Unique identifier (e.g., "round1", "quarterfinals")
  name: string;         // Display name (e.g., "Round 1", "Quarterfinals")
  pointValue: number;   // Points awarded for correct prediction in this round
}

export interface Match {
  id: string;           // Unique match identifier
  competitor1: string;  // Bear ID of first competitor
  competitor2: string;  // Bear ID of second competitor (null for bye)
  winner: string;       // Bear ID of winner (null if not yet determined)
}

export interface TournamentStructure {
  rounds: TournamentRound[];
  matches: Record<string, Match[]>; // matches organized by round ID
  champion: string | null;          // Overall tournament champion bear ID
}

// Define the tournament structure
export const tournamentStructure: TournamentStructure = {
  rounds: [
    {
      id: 'round1',
      name: 'Round 1',
      pointValue: 1
    },
    {
      id: 'quarterfinals',
      name: 'Quarterfinals',
      pointValue: 2
    },
    {
      id: 'semifinals',
      name: 'Semifinals',
      pointValue: 4
    },
    {
      id: 'finals',
      name: 'Finals',
      pointValue: 8
    }
  ],
  matches: {
    // Round 1 matches
    round1: [
      {
        id: 'round1_match1',
        competitor1: '128Jr',
        competitor2: '609',
        winner: '128Jr'  // Easy to see who won without array indices
      },
      {
        id: 'round1_match2',
        competitor1: '26',
        competitor2: '909',
        winner: '909'
      },
      {
        id: 'round1_match3',
        competitor1: '503',
        competitor2: '901',
        winner: '901'
      },
      {
        id: 'round1_match4',
        competitor1: '99',
        competitor2: '856',
        winner: '856'
      }
    ],
    // Quarterfinals (includes byes)
    quarterfinals: [
      {
        id: 'quarters_match1',
        competitor1: '602',    // Had a bye in round 1
        competitor2: '128Jr',  // Winner from round1_match1
        winner: '602'
      },
      {
        id: 'quarters_match2',
        competitor1: '128',    // Had a bye in round 1  
        competitor2: '909',    // Winner from round1_match2
        winner: '128' // To be determined
      },
      {
        id: 'quarters_match3',
        competitor1: '32',     // Had a bye in round 1
        competitor2: '901',    // Winner from round1_match3
        winner: '32'
      },
      {
        id: 'quarters_match4',
        competitor1: '910',    // Had a bye in round 1
        competitor2: '856',    // Winner from round1_match4
        winner: '856' // To be determined
      }
    ],
    // Semifinals
    semifinals: [
      {
        id: 'semis_match1',
        competitor1: '602',    // Winner from quarters_match1
        competitor2: '32',       // Winner from quarters_match3 (TBD)
        winner: '' // To be determined
      },
      {
        id: 'semis_match2', 
        competitor1: '128',     // Winner from quarters_match2
        competitor2: '856',       // Winner from quarters_match4 (TBD)
        winner: '' // To be determined
      }
    ],
    // Finals
    finals: [
      {
        id: 'finals_match1',
        competitor1: '32',       // Winner from semis_match1 (TBD)
        competitor2: '856',       // Winner from semis_match2 (TBD)
        winner: '' // To be determined
      }
    ]
  },
  champion: null // Overall champion (TBD)
};

// Helper functions for easy data access
export function getRound(roundId: string): TournamentRound {
  const round = tournamentStructure.rounds.find(r => r.id === roundId);
  if (!round) {
    throw new Error(`Round with id "${roundId}" not found`);
  }
  return round;
}

export function getMatchesForRound(roundId: string): Match[] {
  return tournamentStructure.matches[roundId] || [];
}

export function getMatch(roundId: string, matchId: string): Match | null {
  const matches = getMatchesForRound(roundId);
  return matches.find(match => match.id === matchId) || null;
}

// Helper to get all winners from a specific round
export function getRoundWinners(roundId: string): string[] {
  const matches = getMatchesForRound(roundId);
  return matches.map(match => match.winner).filter(winner => winner !== '');
}

// Helper to check if tournament is complete
export function isTournamentComplete(): boolean {
  return tournamentStructure.champion !== null && tournamentStructure.champion !== '';
}
