// New scoring system - works with generic tournament structure

import { tournamentStructure } from './tournament.js';
import { players, type PlayerPredictions } from './players-new.js';

export interface PlayerScore {
  playerId: number;
  playerName: string;
  initials: string;
  roundScores: Record<string, number>;    // score for each round by round ID
  totalScore: number;
  correctPredictions: Record<string, number>; // count of correct predictions per round
  totalCorrect: number;
  totalPossible: number;
  championCorrect: boolean;
  // Legacy properties for backward compatibility
  round1Score: number;
  round2Score: number;
  round3Score: number;
  round4Score: number;
}

/**
 * Calculate the score for a single player based on their predictions vs actual results
 */
export function calculatePlayerScore(player: PlayerPredictions): PlayerScore {
  const roundScores: Record<string, number> = {};
  const correctPredictions: Record<string, number> = {};
  let totalScore = 0;
  let totalCorrect = 0;
  let totalPossible = 0;

  // Calculate scores for each round
  for (const round of tournamentStructure.rounds) {
    const roundId = round.id;
    const roundMatches = tournamentStructure.matches[roundId] || [];
    const playerPredictionsForRound = player.predictions[roundId] || [];
    
    let roundScore = 0;
    let roundCorrect = 0;
    
    // Check each match in this round
    roundMatches.forEach((match, matchIndex) => {
      totalPossible++;
      
      // Get player's prediction for this match
      const playerPrediction = playerPredictionsForRound[matchIndex];
      
      // Check if prediction matches actual winner
      if (playerPrediction && match.winner && playerPrediction === match.winner) {
        roundScore += round.pointValue;
        roundCorrect++;
        totalCorrect++;
      }
    });
    
    roundScores[roundId] = roundScore;
    correctPredictions[roundId] = roundCorrect;
    totalScore += roundScore;
  }

  // Check champion prediction
  const championCorrect = player.championPick === tournamentStructure.champion;
  if (tournamentStructure.champion) {
    totalPossible++; // Only add to possible if champion has been determined
    if (championCorrect) {
      totalCorrect++;
    }
  }

  // Legacy properties for backward compatibility
  const round1Score = roundScores['round1'] || 0;
  const round2Score = roundScores['quarterfinals'] || 0;
  const round3Score = roundScores['semifinals'] || 0;
  const round4Score = roundScores['finals'] || 0;

  return {
    playerId: player.id,
    playerName: player.playerName,
    initials: player.initials,
    roundScores,
    totalScore,
    correctPredictions,
    totalCorrect,
    totalPossible,
    championCorrect,
    round1Score,
    round2Score,
    round3Score,
    round4Score
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
 * Get detailed breakdown of correct predictions for display (backward compatibility)
 */
export function getPredictionBreakdown(playerScore: PlayerScore) {
  const rounds = tournamentStructure.rounds;
  
  // Create breakdown object with round-specific data
  const breakdown: Record<string, string | number> & { 
    totalCorrect: number; 
    totalPossible: number;
    championStatus?: string;
  } = {
    totalCorrect: playerScore.totalCorrect,
    totalPossible: playerScore.totalPossible
  };

  // Add breakdown for each round
  rounds.forEach(round => {
    const roundId = round.id;
    const roundMatches = tournamentStructure.matches[roundId] || [];
    const correctCount = playerScore.correctPredictions[roundId] || 0;
    const totalMatches = roundMatches.length;
    
    breakdown[roundId] = `${correctCount}/${totalMatches}`;
  });

  // Add champion status if determined
  if (tournamentStructure.champion) {
    breakdown.championStatus = playerScore.championCorrect ? '1/1' : '0/1';
  }

  return breakdown;
}

/**
 * Get the legacy round breakdown format for backward compatibility with existing UI
 */
export function getLegacyRoundBreakdown(playerScore: PlayerScore) {
  const rounds = tournamentStructure.rounds;
  
  // Map new round structure to legacy naming
  const legacyMapping: Record<string, string> = {
    'round1': 'round1',
    'quarterfinals': 'round2', 
    'semifinals': 'round3',
    'finals': 'round4'
  };

  const legacy: Record<string, string | number> & {
    totalCorrect: number;
    totalPossible: number;
  } = {
    totalCorrect: playerScore.totalCorrect,
    totalPossible: playerScore.totalPossible
  };

  rounds.forEach(round => {
    const legacyKey = legacyMapping[round.id];
    if (legacyKey) {
      const roundMatches = tournamentStructure.matches[round.id] || [];
      const correctCount = playerScore.correctPredictions[round.id] || 0;
      const totalMatches = roundMatches.length;
      
      legacy[legacyKey] = `${correctCount}/${totalMatches}`;
    }
  });

  return legacy;
}

/**
 * Get players who correctly predicted a specific match outcome
 */
export function getPlayersWithCorrectPrediction(roundId: string, matchIndex: number, winnerId: string): PlayerPredictions[] {
  return players.filter(player => {
    const roundPredictions = player.predictions[roundId];
    return roundPredictions && roundPredictions[matchIndex] === winnerId;
  });
}

/**
 * Get players who correctly predicted the champion
 */
export function getPlayersWithCorrectChampionPrediction(): PlayerPredictions[] {
  if (!tournamentStructure.champion) return [];
  
  return players.filter(player => player.championPick === tournamentStructure.champion);
}