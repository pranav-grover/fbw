// Player predictions data - uses new bear ID system and generic round structure

export interface PlayerPredictions {
  playerName: string;
  initials: string;
  id: number;
  predictions: Record<string, string[]>; // roundId -> array of predicted winner bear IDs
  championPick: string;                  // predicted overall champion bear ID
}

export const players: PlayerPredictions[] = [
  {
    playerName: "Hertel",
    initials: "MH", 
    id: 1,
    predictions: {
      round1: ['609', '909', '901', '856'],           // [1, 3, 5, 7] from old system
      quarterfinals: ['602', '128', '32', '856'],     // [8, 10, 9, 7] from old system  
      semifinals: ['32', '856'],                      // [10, 7] from old system
      finals: ['32']                                  // [10] from old system
    },
    championPick: '32'  // [10] from old system
  },
  {
    playerName: "Basit",
    initials: "BS",
    id: 2,
    predictions: {
      round1: ['128Jr', '909', '901', '856'],
      quarterfinals: ['602', '909', '32', '910'],
      semifinals: ['32', '910'],
      finals: ['32']
    },
    championPick: '32'
  },
  {
    playerName: "Pete",
    initials: "PH",
    id: 3,
    predictions: {
      round1: ['609', '909', '901', '99'],
      quarterfinals: ['602', '128', '32', '910'],
      semifinals: ['32', '128'],
      finals: ['32']
    },
    championPick: '32'
  },
  {
    playerName: "Jason",
    initials: "JG",
    id: 4,
    predictions: {
      round1: ['609', '909', '901', '856'],
      quarterfinals: ['602', '128', '32', '856'],
      semifinals: ['602', '128'],
      finals: ['128']
    },
    championPick: '128'
  },
  {
    playerName: "Karel",
    initials: "KK",
    id: 5,
    predictions: {
      round1: ['128Jr', '909', '901', '99'],
      quarterfinals: ['602', '128', '32', '910'],
      semifinals: ['602', '910'],
      finals: ['602']
    },
    championPick: '602'
  },
  {
    playerName: "Pranav",
    initials: "PG",
    id: 6,
    predictions: {
      round1: ['609', '909', '901', '99'],
      quarterfinals: ['602', '128', '32', '910'],
      semifinals: ['32', '910'],
      finals: ['32']
    },
    championPick: '32'
  },
  {
    playerName: "Yukie",
    initials: "YK",
    id: 7,
    predictions: {
      round1: ['609', '909', '503', '856'],
      quarterfinals: ['602', '128', '32', '856'],
      semifinals: ['602', '128'],
      finals: ['602']
    },
    championPick: '602'
  },
  {
    playerName: "Sandeep",
    initials: "SD",
    id: 8,
    predictions: {
      round1: ['609', '26', '901', '99'],
      quarterfinals: ['602', '128', '901', '99'],
      semifinals: ['602', '99'],
      finals: ['602']
    },
    championPick: '602'
  },
  {
    playerName: "Natalie",
    initials: "NB",
    id: 9,
    predictions: {
      round1: ['128Jr', '909', '503', '856'],
      quarterfinals: ['128Jr', '128', '32', '910'],
      semifinals: ['32', '910'],
      finals: ['32']
    },
    championPick: '32'
  },
  {
    playerName: "Sarah",
    initials: "SS",
    id: 10,
    predictions: {
      round1: ['128Jr', '909', '901', '856'],
      quarterfinals: ['602', '128', '32', '910'],
      semifinals: ['602', '128'],
      finals: ['602']
    },
    championPick: '602'
  },
  {
    playerName: "Pratik",
    initials: "PP",
    id: 11,
    predictions: {
      round1: ['609', '909', '901', '99'],
      quarterfinals: ['602', '128', '32', '99'],
      semifinals: ['602', '128'],
      finals: ['602']
    },
    championPick: '602'
  },
  {
    playerName: "Mike",
    initials: "MS",
    id: 12,
    predictions: {
      round1: ['128Jr', '26', '503', '99'],
      quarterfinals: ['128Jr', '128', '32', '99'],
      semifinals: ['128Jr', '128'],
      finals: ['128Jr']
    },
    championPick: '128Jr'
  },
  {
    playerName: "Paula",
    initials: "PN",
    id: 13,
    predictions: {
      round1: ['609', '909', '503', '99'],
      quarterfinals: ['602', '909', '32', '99'],
      semifinals: ['602', '99'],
      finals: ['602']
    },
    championPick: '602'
  },
  {
    playerName: "Hannah",
    initials: "HC",
    id: 14,
    predictions: {
      round1: ['128Jr', '909', '901', '99'],
      quarterfinals: ['602', '128', '32', '99'],
      semifinals: ['602', '128'],
      finals: ['602']
    },
    championPick: '602'
  },
  {
    playerName: "Chris",
    initials: "CJ",
    id: 15,
    predictions: {
      round1: ['609', '909', '503', '99'],
      quarterfinals: ['602', '128', '32', '856'],
      semifinals: ['32', '128'],
      finals: ['32']
    },
    championPick: '32'
  }
];

// Helper function to get player by ID
export function getPlayer(playerId: number): PlayerPredictions | null {
  return players.find(p => p.id === playerId) || null;
}

// Helper function to get player by name
export function getPlayerByName(name: string): PlayerPredictions | null {
  return players.find(p => p.playerName === name) || null;
}
