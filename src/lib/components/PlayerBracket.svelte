<script lang="ts">
  import { tournamentStructure } from '$lib/data/tournament';
  import { bears, getBear, findBear } from '$lib/data/bears';
  import { calculatePlayerScore, getLegacyRoundBreakdown } from '$lib/data/scoring';
  import type { PlayerPredictions } from '$lib/data/players';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  
  interface MatchDisplay {
    id: string;
    competitor1: { id: string, name: string } | null;
    competitor2: { id: string, name: string } | null;
    winner: { id: string, name: string } | null;
    playerPick: { id: string, name: string } | null;
    isCorrect: boolean | null;
  }

  // Get player data
  let { player } = $props<{ player: PlayerPredictions }>();
  
  let playerScore = calculatePlayerScore(player);
  let breakdown = getLegacyRoundBreakdown(playerScore);
  
  // Match dialog state
  let showMatchDialog = $state(false);
  let selectedMatch = $state({
    id: '',
    competitor1: null as { id: string, name: string } | null,
    competitor2: null as { id: string, name: string } | null,
    winner: null as { id: string, name: string } | null,
    playerPick: null as { id: string, name: string } | null,
    isCorrect: null as boolean | null,
    roundName: '',
    matchNumber: 0
  });

  // Helper function to convert bear ID to display format
  function bearToCompetitor(bearId: string): { id: string, name: string } | null {
    if (!bearId || bearId === '') return null;
    try {
      const bear = getBear(bearId);
      return { id: bearId, name: bear.shortName };
    } catch (error) {
      console.warn(`Bear not found for ID: ${bearId}`);
      return null;
    }
  }
  
  // Helper function to get player pick for a specific match
  function getPlayerPick(roundId: string, matchIndex: number): { id: string, name: string } | null {
    const predictions = player.predictions[roundId];
    if (!predictions || !predictions[matchIndex] || predictions[matchIndex] === '') return null;
    
    return bearToCompetitor(predictions[matchIndex]);
  }
  
  // Helper function to check if prediction is correct
  function isPredictionCorrect(roundId: string, matchIndex: number): boolean | null {
    const matches = tournamentStructure.matches[roundId];
    if (!matches || !matches[matchIndex]) return null;
    
    const actualWinner = matches[matchIndex].winner;
    const playerPrediction = player.predictions[roundId]?.[matchIndex];
    
    if (!actualWinner || actualWinner === '' || !playerPrediction || playerPrediction === '') return null;
    return actualWinner === playerPrediction;
  }
  
  // Create bracket structure for display
  let bracket = $state<Record<string, MatchDisplay[]>>({});
  
  // Initialize bracket when component mounts
  function initializeBracket() {
    const result: Record<string, MatchDisplay[]> = {};
    
    tournamentStructure.rounds.forEach(round => {
      const matches = tournamentStructure.matches[round.id] || [];
      
      result[round.id] = matches.map((match, index) => ({
        id: match.id,
        competitor1: bearToCompetitor(match.competitor1),
        competitor2: bearToCompetitor(match.competitor2),
        winner: bearToCompetitor(match.winner),
        playerPick: getPlayerPick(round.id, index),
        isCorrect: isPredictionCorrect(round.id, index)
      }));
    });
    
    bracket = result;
  }
  
  // Initialize on component mount
  initializeBracket();
  
  // Round names mapping
  const roundNames: Record<string, string> = {};
  tournamentStructure.rounds.forEach(round => {
    roundNames[round.id] = round.name;
  });
  
  function showMatchModal(match: MatchDisplay, roundName: string, matchNumber: number) {
    selectedMatch = {
      id: match.id,
      competitor1: match.competitor1,
      competitor2: match.competitor2,
      winner: match.winner,
      playerPick: match.playerPick,
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
        {roundNames[roundKey]}
      </h2>
      
      <div class="matches-container flex flex-wrap gap-4 justify-center">
        {#each matches as match, matchIndex}
          <div class="match-card bg-white rounded-lg shadow-md p-4 border-2 border-slate-200 hover:border-slate-300 transition-colors w-full max-w-md">
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
              onclick={() => showMatchModal(match, roundNames[roundKey], matchIndex)}
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
  <Dialog.Content class="max-w-5xl">
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
          {@const bear1 = findBear(selectedMatch.competitor1.id)}
          {#if bear1}
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-center">{bear1.name}</h3>
            
            <!-- Bear Image -->
            <div class="w-full flex justify-center">
              <img 
                src="{bear1.image}" 
                alt="{bear1.name}"
                class="w-full max-w-sm rounded-lg shadow-md object-cover"
              />
            </div>
            
            <!-- Status Badges -->
            <div class="flex flex-col gap-2 items-center">
              {#if selectedMatch.winner?.id === selectedMatch.competitor1.id}
                <span class="bg-yellow-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                  🏆 ACTUAL WINNER
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
        {/if}
        
        <!-- Competitor 2 -->
        {#if selectedMatch.competitor2}
          {@const bear2 = findBear(selectedMatch.competitor2.id)}
          {#if bear2}
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-center">{bear2.name}</h3>
            
            <!-- Bear Image -->
            <div class="w-full flex justify-center">
              <img 
                src="{bear2.image}" 
                alt="{bear2.name}"
                class="w-full max-w-sm rounded-lg shadow-md object-cover"
              />
            </div>
            
            <!-- Status Badges -->
            <div class="flex flex-col gap-2 items-center">
              {#if selectedMatch.winner?.id === selectedMatch.competitor2.id}
                <span class="bg-yellow-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                  🏆 ACTUAL WINNER
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
        {/if}
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>