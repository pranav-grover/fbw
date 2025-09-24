import { tournamentWinners } from './winners.js';
import { players, type PlayerResults } from './players.js';

export interface PlayerScore {
  playerId: number;
  playerName: string;
  initials: string;
  round1Score: number;
  round2Score: number;
  round3Score: number;
  round4Score: number;
  totalScore: number;
  correctPredictions: {
    round1: number[];
    round2: number[];
    round3: number[];
    round4: boolean;
  };
}

/**
 * Calculate the score for a single player based on their predictions vs actual results
 */
export function calculatePlayerScore(player: PlayerResults): PlayerScore {
  let round1Score = 0;
  let round2Score = 0;
  let round3Score = 0;
  let round4Score = 0;
  
  const correctPredictions = {
    round1: [] as number[],
    round2: [] as number[],
    round3: [] as number[],
    round4: false
  };

  // Round 1: 1 point each (4 matches)
  player.picks.round1Winners.forEach((pick, index) => {
    if (pick === tournamentWinners.round1Winners[index]) {
      round1Score += 1;
      correctPredictions.round1.push(index);
    }
  });

  // Round 2: 2 points each (4 matches) 
  player.picks.round2Winners.forEach((pick, index) => {
    if (pick === tournamentWinners.round2Winners[index]) {
      round2Score += 2;
      correctPredictions.round2.push(index);
    }
  });

  // Round 3: 4 points each (2 matches)
  player.picks.round3Winners.forEach((pick, index) => {
    if (pick === tournamentWinners.round3Winners[index]) {
      round3Score += 4;
      correctPredictions.round3.push(index);
    }
  });

  // Round 4: 8 points (1 match - finals winner)
  if (player.picks.round4Winner === tournamentWinners.round4Winner) {
    round4Score += 8;
    correctPredictions.round4 = true;
  }

  const totalScore = round1Score + round2Score + round3Score + round4Score;

  return {
    playerId: player.id,
    playerName: player.name,
    initials: player.initials,
    round1Score,
    round2Score,
    round3Score,
    round4Score,
    totalScore,
    correctPredictions
  };
}

/**
 * Calculate scores for all players and sort by total score (highest first)
 */
export function calculateAllPlayerScores(): PlayerScore[] {
  return players
    .map(calculatePlayerScore)
    .sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Get detailed breakdown of correct predictions for display
 */
export function getPredictionBreakdown(playerScore: PlayerScore) {
  const breakdown = {
    round1: `${playerScore.correctPredictions.round1.length}/4`,
    round2: `${playerScore.correctPredictions.round2.length}/4`, 
    round3: `${playerScore.correctPredictions.round3.length}/2`,
    round4: playerScore.correctPredictions.round4 ? '1/1' : '0/1',
    totalCorrect: playerScore.correctPredictions.round1.length + 
                  playerScore.correctPredictions.round2.length + 
                  playerScore.correctPredictions.round3.length + 
                  (playerScore.correctPredictions.round4 ? 1 : 0),
    totalPossible: 11 // 4 + 4 + 2 + 1
  };
  
  return breakdown;
}