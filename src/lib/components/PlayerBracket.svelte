<script lang="ts">
  import { tournamentWinners, bearImages, bearDisplayNames } from '$lib/data/winners';
  import { calculatePlayerScore, getPredictionBreakdown } from '$lib/data/scoring';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  
  interface Competitor {
    id: number;
    name: string;
  }
  
  interface Match {
    id: string;
    competitor1: Competitor | null;
    competitor2: Competitor | null;
    winner: Competitor | null;
    playerPick?: Competitor | null;
    isCorrect?: boolean | null;
  }

  // Get player data
  let { player } = $props<{ player: any }>();
  
  let playerScore = player ? calculatePlayerScore(player) : null;
  let breakdown = playerScore ? getPredictionBreakdown(playerScore) : null;

  // Match dialog state
  let showMatchDialog = $state(false);
  let selectedMatch = $state({
    id: '',
    competitor1: null as Competitor | null,
    competitor2: null as Competitor | null,
    winner: null as Competitor | null,
    playerPick: null as Competitor | null,
    isCorrect: null as boolean | null,
    roundName: '',
    matchNumber: 0
  });
  
  // Initial 12 competitors
  let initialCompetitors: Competitor[] = [
    { id: 0, name: '128 Jr' },
    { id: 1, name: '609' },
    { id: 2, name: '26' },
    { id: 3, name: '909' },
    { id: 4, name: '503' },
    { id: 5, name: '901' },
    { id: 6, name: '99' },
    { id: 7, name: '856' },
    { id: 8, name: '32' },
    { id: 9, name: '602' },
    { id: 10, name: '910' },
    { id: 11, name: '128' }
  ];
  
  // Helper function to get competitor by name
  const getCompetitorByName = (name: string): Competitor | null => {
    return initialCompetitors.find(comp => comp.name === name) || null;
  };
  
  // Helper function to get actual winner by round and match index
  const getActualWinner = (round: number, matchIndex: number): Competitor | null => {
    if (round === 1) {
      // Round 1 has 4 matches, but only first 4 competitors advance
      if (matchIndex < tournamentWinners.round1Winners.length) {
        const winnerId = tournamentWinners.round1Winners[matchIndex];
        return initialCompetitors.find(c => c.id === winnerId) || null;
      }
    } else if (round === 2) {
      // Round 2 (quarterfinals) - includes byes
      if (matchIndex < tournamentWinners.round2Winners.length) {
        const winnerId = tournamentWinners.round2Winners[matchIndex];
        return initialCompetitors.find(c => c.id === winnerId) || null;
      }
    } else if (round === 3) {
      // Round 3 (semifinals)
      if (matchIndex < tournamentWinners.round3Winners.length) {
        const winnerId = tournamentWinners.round3Winners[matchIndex];
        return initialCompetitors.find(c => c.id === winnerId) || null;
      }
    } else if (round === 4) {
      // Round 4 (finals)
      if (matchIndex === 0) {
        const winnerId = tournamentWinners.round4Winner;
        return initialCompetitors.find(c => c.id === winnerId) || null;
      }
    }
    return null;
  };
  
  // Helper function to get player pick by round and match index
  const getPlayerPick = (round: number, matchIndex: number): Competitor | null => {
    if (!player?.picks) return null;
    
    if (round === 1) {
      if (matchIndex < player.picks.round1Winners.length) {
        const pickId = player.picks.round1Winners[matchIndex];
        return initialCompetitors.find(c => c.id === pickId) || null;
      }
    } else if (round === 2) {
      if (matchIndex < player.picks.round2Winners.length) {
        const pickId = player.picks.round2Winners[matchIndex];
        return initialCompetitors.find(c => c.id === pickId) || null;
      }
    } else if (round === 3) {
      if (matchIndex < player.picks.round3Winners.length) {
        const pickId = player.picks.round3Winners[matchIndex];
        return initialCompetitors.find(c => c.id === pickId) || null;
      }
    } else if (round === 4) {
      if (matchIndex === 0) {
        const pickId = player.picks.round4Winner;
        return initialCompetitors.find(c => c.id === pickId) || null;
      }
    }
    return null;
  };
  
  // Helper function to check if prediction is correct
  const isPredictionCorrect = (round: number, matchIndex: number): boolean | null => {
    const actualWinner = getActualWinner(round, matchIndex);
    const playerPick = getPlayerPick(round, matchIndex);
    if (!actualWinner || !playerPick) return null;
    return actualWinner.id === playerPick.id;
  };
  
  // Create bracket structure - this represents what the player chose for each round
  const bracket = {
    round1: [
      {
        id: 'round1_match1',
        competitor1: initialCompetitors[0], // 128Jr
        competitor2: initialCompetitors[1], // 609
        winner: getActualWinner(1, 0),
        playerPick: getPlayerPick(1, 0),
        isCorrect: isPredictionCorrect(1, 0)
      },
      {
        id: 'round1_match2',
        competitor1: initialCompetitors[2], // 26
        competitor2: initialCompetitors[3], // 909
        winner: getActualWinner(1, 1),
        playerPick: getPlayerPick(1, 1),
        isCorrect: isPredictionCorrect(1, 1)
      },
      {
        id: 'round1_match3',
        competitor1: initialCompetitors[4], // 503
        competitor2: initialCompetitors[5], // 901
        winner: getActualWinner(1, 2),
        playerPick: getPlayerPick(1, 2),
        isCorrect: isPredictionCorrect(1, 2)
      },
      {
        id: 'round1_match4',
        competitor1: initialCompetitors[6], // 99
        competitor2: initialCompetitors[7], // 856
        winner: getActualWinner(1, 3),
        playerPick: getPlayerPick(1, 3),
        isCorrect: isPredictionCorrect(1, 3)
      }
    ],
    round2: [
      {
        id: 'round2_match1',
        competitor1: initialCompetitors[8], // 32 (bye from R1)
        competitor2: getActualWinner(1, 0), // Winner of 128Jr vs 609
        winner: getActualWinner(2, 0),
        playerPick: getPlayerPick(2, 0),
        isCorrect: isPredictionCorrect(2, 0)
      },
      {
        id: 'round2_match2',
        competitor1: initialCompetitors[9], // 602 (bye from R1)
        competitor2: getActualWinner(1, 1), // Winner of 26 vs 909
        winner: getActualWinner(2, 1),
        playerPick: getPlayerPick(2, 1),
        isCorrect: isPredictionCorrect(2, 1)
      },
      {
        id: 'round2_match3',
        competitor1: initialCompetitors[10], // 910 (bye from R1)
        competitor2: getActualWinner(1, 2), // Winner of 503 vs 901
        winner: getActualWinner(2, 2),
        playerPick: getPlayerPick(2, 2),
        isCorrect: isPredictionCorrect(2, 2)
      },
      {
        id: 'round2_match4',
        competitor1: initialCompetitors[11], // 128 (bye from R1)
        competitor2: getActualWinner(1, 3), // Winner of 99 vs 856
        winner: getActualWinner(2, 3),
        playerPick: getPlayerPick(2, 3),
        isCorrect: isPredictionCorrect(2, 3)
      }
    ],
    round3: [
      {
        id: 'round3_match1',
        competitor1: getActualWinner(2, 0), // Winner of round2_match1
        competitor2: getActualWinner(2, 1), // Winner of round2_match2
        winner: getActualWinner(3, 0),
        playerPick: getPlayerPick(3, 0),
        isCorrect: isPredictionCorrect(3, 0)
      },
      {
        id: 'round3_match2',
        competitor1: getActualWinner(2, 2), // Winner of round2_match3
        competitor2: getActualWinner(2, 3), // Winner of round2_match4
        winner: getActualWinner(3, 1),
        playerPick: getPlayerPick(3, 1),
        isCorrect: isPredictionCorrect(3, 1)
      }
    ],
    round4: [
      {
        id: 'round4_match1',
        competitor1: getActualWinner(3, 0), // Winner of round3_match1
        competitor2: getActualWinner(3, 1), // Winner of round3_match2
        winner: getActualWinner(4, 0),
        playerPick: getPlayerPick(4, 0),
        isCorrect: isPredictionCorrect(4, 0)
      }
    ]
  };
  
  const rounds: Record<string, string> = {
    round1: 'Round 1',
    round2: 'Quarterfinals', 
    round3: 'Semifinals',
    round4: 'Finals'
  };
  
  function showMatchModal(match: Match, roundName: string, matchNumber: number) {
    selectedMatch = {
      id: match.id,
      competitor1: match.competitor1,
      competitor2: match.competitor2,
      winner: match.winner,
      playerPick: match.playerPick || null,
      isCorrect: match.isCorrect,
      roundName,
      matchNumber: matchNumber + 1
    };
    showMatchDialog = true;
  }
</script>

<div class="p-4">
  <!-- Player Header -->
  <div class="text-center mb-6">
    {#if playerScore && breakdown}
      <div class="bg-white rounded-lg shadow-md p-4 inline-block">
        <div class="flex items-center gap-6">
          <div class="text-center">
            <span class="bg-blue-500 text-white text-lg px-4 py-2 rounded-full font-bold">
              {player.initials}
            </span>
          </div>
          <div class="text-left">
            <div class="text-2xl font-bold text-slate-800">{playerScore.totalScore} Points</div>
            <div class="text-sm text-slate-600">{breakdown.totalCorrect}/{breakdown.totalPossible} Correct Predictions</div>
          </div>
          <div class="grid grid-cols-4 gap-2 text-xs">
            <div class="text-center">
              <div class="font-medium">R1</div>
              <div class="{playerScore.round1Score > 0 ? 'text-green-600' : 'text-slate-400'}">{playerScore.round1Score}pts</div>
            </div>
            <div class="text-center">
              <div class="font-medium">R2</div>
              <div class="{playerScore.round2Score > 0 ? 'text-green-600' : 'text-slate-400'}">{playerScore.round2Score}pts</div>
            </div>
            <div class="text-center">
              <div class="font-medium">R3</div>
              <div class="{playerScore.round3Score > 0 ? 'text-green-600' : 'text-slate-400'}">{playerScore.round3Score}pts</div>
            </div>
            <div class="text-center">
              <div class="font-medium">R4</div>
              <div class="{playerScore.round4Score > 0 ? 'text-green-600' : 'text-slate-400'}">{playerScore.round4Score}pts</div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Legend -->
  <div class="bg-white rounded-lg shadow-md p-4 mb-6">
    <h3 class="font-semibold mb-2">Legend</h3>
    <div class="flex flex-wrap gap-4 text-sm">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-green-500 rounded"></div>
        <span>Correct Prediction</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-red-500 rounded"></div>
        <span>Incorrect Prediction</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-slate-300 rounded"></div>
        <span>Actual Winner</span>
      </div>
    </div>
  </div>
  
  <!-- Bracket Rounds -->
  {#each Object.entries(bracket) as [roundKey, matches]}
    <div class="bracket-round mb-8">
      <h2 class="text-xl font-semibold mb-4 text-slate-700 text-center">
        {rounds[roundKey]}
      </h2>
      
      <div class="matches-container flex flex-wrap gap-4 justify-center">
        {#each matches as match, matchIndex}
          <div class="match-card bg-white rounded-lg shadow-md p-4 border-2 border-slate-200 hover:border-slate-300 transition-colors min-w-[300px]">
            <div class="match-header text-center mb-3">
              <span class="text-sm font-medium text-slate-500 uppercase tracking-wide">Match {matchIndex + 1}</span>
              {#if match.isCorrect !== null}
                <span class="ml-2 text-xs px-2 py-1 rounded-full {match.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                  {match.isCorrect ? '✓ Correct' : '✗ Wrong'}
                </span>
              {/if}
            </div>
            
            <button 
              class="w-full text-left"
              onclick={() => showMatchModal(match, rounds[roundKey], matchIndex)}
            >
              <div class="competitors space-y-2">
                {#if match.competitor1}
                  <div class="competitor p-3 rounded-md border-2 transition-all duration-200 {match.winner?.id === match.competitor1.id ? 'border-slate-400 bg-slate-100' : 'border-slate-200 bg-slate-50'}">
                    <div class="flex items-center justify-between">
                      <span class="font-medium">{match.competitor1.name}</span>
                      <div class="flex items-center gap-2">
                        {#if match.winner?.id === match.competitor1.id}
                          <span class="text-slate-600 text-sm font-bold">WINNER</span>
                        {/if}
                        {#if match.playerPick?.id === match.competitor1.id}
                          <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">PICK</span>
                        {/if}
                      </div>
                    </div>
                  </div>
                {:else}
                  <div class="competitor p-3 rounded-md border-2 border-dashed border-slate-200 bg-slate-50">
                    <span class="text-slate-400 italic">TBD</span>
                  </div>
                {/if}

                <div class="text-center text-slate-400 text-sm font-bold">VS</div>

                {#if match.competitor2}
                  <div class="competitor p-3 rounded-md border-2 transition-all duration-200 {match.winner?.id === match.competitor2.id ? 'border-slate-400 bg-slate-100' : 'border-slate-200 bg-slate-50'}">
                    <div class="flex items-center justify-between">
                      <span class="font-medium">{match.competitor2.name}</span>
                      <div class="flex items-center gap-2">
                        {#if match.winner?.id === match.competitor2.id}
                          <span class="text-slate-600 text-sm font-bold">WINNER</span>
                        {/if}
                        {#if match.playerPick?.id === match.competitor2.id}
                          <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">PICK</span>
                        {/if}
                      </div>
                    </div>
                  </div>
                {:else}
                  <div class="competitor p-3 rounded-md border-2 border-dashed border-slate-200 bg-slate-50">
                    <span class="text-slate-400 italic">TBD</span>
                  </div>
                {/if}
              </div>
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

<!-- Match Detail Dialog -->
<Dialog.Root bind:open={showMatchDialog}>
  <Dialog.Content class="max-w-4xl">
    <Dialog.Header>
      <Dialog.Title>
        {selectedMatch.roundName} - Match {selectedMatch.matchNumber}
      </Dialog.Title>
    </Dialog.Header>
    
    <div class="space-y-6 p-4">
      <!-- Match Status -->
      {#if selectedMatch.isCorrect !== null}
        <div class="text-center p-4 rounded-lg {selectedMatch.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border">
          <div class="text-2xl mb-2">
            {selectedMatch.isCorrect ? '✅' : '❌'}
          </div>
          <div class="font-semibold text-lg {selectedMatch.isCorrect ? 'text-green-800' : 'text-red-800'}">
            {selectedMatch.isCorrect ? 'Correct Prediction!' : 'Incorrect Prediction'}
          </div>
        </div>
      {/if}
      
      <!-- Competitors -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Competitor 1 -->
        {#if selectedMatch.competitor1}
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-center">{selectedMatch.competitor1.name}</h3>
            
            <!-- Bear Image -->
            <div class="w-full flex justify-center">
              {#if bearImages[selectedMatch.competitor1.id]}
                <img 
                  src="{bearImages[selectedMatch.competitor1.id]}" 
                  alt="{bearDisplayNames[selectedMatch.competitor1.id] || selectedMatch.competitor1.name}"
                  class="w-full max-w-sm rounded-lg shadow-md object-cover"
                />
              {:else}
                <div class="w-full max-w-sm h-48 bg-slate-200 rounded-lg flex items-center justify-center">
                  <span class="text-slate-500">No image available</span>
                </div>
              {/if}
            </div>
            
            <!-- Status Badges -->
            <div class="flex flex-col gap-2 items-center">
              {#if selectedMatch.winner?.id === selectedMatch.competitor1.id}
                <span class="bg-yellow-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                  🏆 ACTUAL CHAMPION
                </span>
              {/if}
              {#if selectedMatch.playerPick?.id === selectedMatch.competitor1.id}
                <span class="bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                  👆 YOUR PICK
                </span>
              {/if}
            </div>
          </div>
        {/if}
        
        <!-- Competitor 2 -->
        {#if selectedMatch.competitor2}
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-center">{selectedMatch.competitor2.name}</h3>
            
            <!-- Bear Image -->
            <div class="w-full flex justify-center">
              {#if bearImages[selectedMatch.competitor2.id]}
                <img 
                  src="{bearImages[selectedMatch.competitor2.id]}" 
                  alt="{bearDisplayNames[selectedMatch.competitor2.id] || selectedMatch.competitor2.name}"
                  class="w-full max-w-sm rounded-lg shadow-md object-cover"
                />
              {:else}
                <div class="w-full max-w-sm h-48 bg-slate-200 rounded-lg flex items-center justify-center">
                  <span class="text-slate-500">No image available</span>
                </div>
              {/if}
            </div>
            
            <!-- Status Badges -->
            <div class="flex flex-col gap-2 items-center">
              {#if selectedMatch.winner?.id === selectedMatch.competitor2.id}
                <span class="bg-yellow-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                  🏆 ACTUAL CHAMPION
                </span>
              {/if}
              {#if selectedMatch.playerPick?.id === selectedMatch.competitor2.id}
                <span class="bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                  👆 YOUR PICK
                </span>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>
