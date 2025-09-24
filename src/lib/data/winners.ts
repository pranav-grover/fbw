// Tournament winners data - hardcoded results
import { p } from './players.js';

export interface TournamentResults {
  round1Winners: number[]; // competitor IDs that win first round matches
  round2Winners: number[]; // competitor IDs that win quarterfinal matches  
  round3Winners: number[]; // competitor IDs that win semifinal matches
  round4Winner: number;    // competitor ID that wins finals
  champion: number;        // overall tournament champion ID
}

// Predefined tournament results based on the 12-competitor bracket
export const tournamentWinners: TournamentResults = {
  // First Round winners (4 matches)
  round1Winners: [p(-1), -1, p(901), -1], // 128 Jr, 909, 901, 856
  
  // Quarterfinals winners (4 matches) - includes byes from round 2
  round2Winners: [-1, -1, -1, -1], // 128 Jr, 602, 909, 32
  
  // Semifinals winners (2 matches)
  round3Winners: [-1, -1], // 602, 32
  
  // Finals winner (1 match)
  round4Winner: -1, // 602
  
  // Overall champion
  champion: -1 // 602
};

// Bear images mapping - each competitor gets a bear image based on their name prefix
export const bearImages: Record<number, string> = {
  0: '/src/lib/images/bears/128grazer-1758560774361.png', // 128 Jr
  1: '/src/lib/images/bears/609-1758562237210.png',       // 609
  2: '/src/lib/images/bears/26-1758557305581.png',        // 26
  3: '/src/lib/images/bears/909-1758562402990.png',       // 909
  4: '/src/lib/images/bears/503-1758560839893.png',       // 503
  5: '/src/lib/images/bears/901-1758562371329.png',       // 901
  6: '/src/lib/images/bears/99-1758560720167.png',        // 99
  7: '/src/lib/images/bears/856-1758562333630.png',       // 856
  8: '/src/lib/images/bears/602-1758562266438.png',       // 602
  9: '/src/lib/images/bears/128grazer-1758560774361.png', // 128 (using same as 128 Jr)
  10: '/src/lib/images/bears/32chunk-1758560671158.png',  // 32
  11: '/src/lib/images/bears/910-1758562455268.png'       // 910
};

// Bear display names for the popup
export const bearDisplayNames: Record<number, string> = {
  0: '128 Grazer Jr',
  1: 'Bear 609', 
  2: 'Bear 26',
  3: 'Bear 909',
  4: 'Bear 503',
  5: 'Bear 901',
  6: 'Bear 99', 
  7: 'Bear 856',
  8: 'Bear 602',
  9: '128 Grazer',
  10: '32 Chunk',
  11: 'Bear 910'
};