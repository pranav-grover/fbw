<script lang="ts">
  import { tournamentStructure, getMatchesForRound } from '$lib/data/tournament';
  import { bears, getBear } from '$lib/data/bears';
  import { getPlayersWithCorrectPrediction } from '$lib/data/scoring';
  import { players } from '$lib/data/players';
  import Button from './ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';

  // Match dialog state
  let showMatchDialog = $state(false);
  let selectedMatch = $state({
    competitor1: null as { id: string, name: string, image: string } | null,
    competitor2: null as { id: string, name: string, image: string } | null,
    winner: null as { id: string, name: string, image: string } | null,
    roundName: '',
    matchNumber: 0
  });
  
  // Helper function to convert bear ID to full bear data
  function getBearData(bearId: string): { id: string, name: string, image: string } | null {
    if (!bearId) return null;
    try {
      const bear = getBear(bearId);
      return {
        id: bearId,
        name: bear.name,
        image: bear.image
      };
    } catch {
      return null;
    }
  }
  
  // Function to show match dialog when competitor is clicked
  function showMatchModal(roundId: string, matchIndex: number) {
    const matches = getMatchesForRound(roundId);
    const match = matches[matchIndex];
    const round = tournamentStructure.rounds.find(r => r.id === roundId);
    
    if (!match || !round) return;
    
    selectedMatch = {
      competitor1: getBearData(match.competitor1),
      competitor2: getBearData(match.competitor2),
      winner: getBearData(match.winner),
      roundName: round.name,
      matchNumber: matchIndex + 1
    };
    showMatchDialog = true;
  }
  
  // Function to get players who correctly predicted a winner
  function getCorrectPredictions(roundId: string, matchIndex: number, winnerId: string): string[] {
    const correctPlayers = getPlayersWithCorrectPrediction(roundId, matchIndex, winnerId);
    return correctPlayers.map(p => p.initials);
  }
  
  // Get champion data
  const champion = $derived.by(() => {
    if (!tournamentStructure.champion) return null;
    return getBearData(tournamentStructure.champion);
  });
  
  const championPredictors = $derived(() => {
    if (!champion) return [];
    return players.filter((p) => p.championPick === champion.id);
  });
</script>

<div class="bracket-container p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
  <h1 class="text-3xl font-bold text-center mb-2 text-slate-800">Fat Bear Week 2025</h1>
  <h6 class="text-sm text-center mb-8 text-slate-400">Click on a match to see the bears!</h6>
  
  {#each tournamentStructure.rounds as round}
    {@const matches = getMatchesForRound(round.id)}
    <div class="bracket-round mb-8">
      <h2 class="text-xl font-semibold mb-4 text-slate-700 text-center">
        {round.name}
      </h2>
      
      <div class="matches-container flex flex-wrap gap-4 justify-center">
        {#each matches as match, matchIndex}
          <button 
            class="match-card bg-white rounded-lg shadow-md p-4 border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 min-w-[210px] text-left cursor-pointer"
            onclick={() => showMatchModal(round.id, matchIndex)}
          >
            <div class="match-header text-center mb-3">
              <span class="text-sm font-medium text-slate-500 uppercase tracking-wide">Match {matchIndex + 1}</span>
            </div>
            
            <div class="competitors space-y-2">
              <!-- Competitor 1 -->
              {#if getBearData(match.competitor1)}
                {@const bear1 = getBearData(match.competitor1)}
                <div class="competitor w-full p-3 rounded-md border-2 transition-all duration-200 {match.winner === match.competitor1 ? 'border-green-500 bg-green-50 text-green-800' : 'border-slate-200 bg-slate-50'}">
                  <div class="flex items-center justify-between">
                    <span class="font-medium">{bear1?.name}</span>
                    {#if match.winner === match.competitor1}
                      {@const correctPlayers = getCorrectPredictions(round.id, matchIndex, match.competitor1)}
                      <div class="flex items-center gap-2">
                        <span class="text-green-600 text-sm font-bold">W</span>
                        {#if correctPlayers.length === 1}
                          <span class="bg-blue-500 text-white text-xs w-6 h-6 rounded-full font-medium flex items-center justify-center">
                            {correctPlayers[0]}
                          </span>
                        {:else if correctPlayers.length > 1}
                        <Tooltip.Provider>
                          <Tooltip.Root>
                            <Tooltip.Trigger>
                              <span 
                                class="bg-blue-500 text-white text-xs w-6 h-6 rounded-full font-medium flex items-center justify-center cursor-help"
                              >
                                {correctPlayers.length}
                              </span>
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                              <div class="flex flex-wrap gap-1">
                                {#each correctPlayers as initials}
                                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{initials}</span>
                                {/each}
                              </div>
                            </Tooltip.Content>
                          </Tooltip.Root>
                          </Tooltip.Provider>
                        {/if}
                      </div>
                    {/if}
                  </div>
                </div>
              {:else}
                <div class="competitor w-full p-3 text-center rounded-md border-2 border-dashed border-slate-300 bg-slate-100 text-slate-500">
                  Awaiting competitor...
                </div>
              {/if}
              
              <div class="text-center text-slate-400 font-bold">VS</div>
              
              <!-- Competitor 2 -->
              {#if getBearData(match.competitor2)}
                {@const bear2 = getBearData(match.competitor2)}
                <div class="competitor w-full p-3 rounded-md border-2 transition-all duration-200 {match.winner === match.competitor2 ? 'border-green-500 bg-green-50 text-green-800' : 'border-slate-200 bg-slate-50'}">
                  <div class="flex items-center justify-between">
                    <span class="font-medium">{bear2?.name}</span>
                    {#if match.winner === match.competitor2}
                      {@const correctPlayers = getCorrectPredictions(round.id, matchIndex, match.competitor2)}
                      <div class="flex items-center gap-2">
                        <span class="text-green-600 text-sm font-bold">W</span>
                        {#if correctPlayers.length === 1}
                          <span class="bg-blue-500 text-white text-xs w-6 h-6 rounded-full font-medium flex items-center justify-center">
                            {correctPlayers[0]}
                          </span>
                        {:else if correctPlayers.length > 1}
                          <Tooltip.Provider>
                            <Tooltip.Root>
                              <Tooltip.Trigger>
                                <span 
                                  class="bg-blue-500 text-white text-xs w-6 h-6 rounded-full font-medium flex items-center justify-center cursor-help"
                                >
                                  {correctPlayers.length}
                                </span>
                              </Tooltip.Trigger>
                              <Tooltip.Content>
                                <div class="flex flex-wrap gap-1">
                                  {#each correctPlayers as initials}
                                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{initials}</span>
                                  {/each}
                                </div>
                              </Tooltip.Content>
                            </Tooltip.Root>
                          </Tooltip.Provider>
                        {/if}
                      </div>
                    {/if}
                  </div>
                </div>
              {:else}
                <div class="competitor w-full p-3 text-center rounded-md border-2 border-dashed border-slate-300 bg-slate-100 text-slate-500">
                  Awaiting competitor...
                </div>
              {/if}
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/each}
  
  <!-- Champion Section -->
  {#if champion}
    <div class="champion-section text-center mt-12 p-8 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-white mb-4">🏆 Tournament Champion 🏆</h2>
      <div class="champion-name text-3xl font-bold text-white bg-black bg-opacity-20 rounded-lg p-4 inline-block mb-4">
        {champion.name}
      </div>
      <div class="flex justify-center gap-2 flex-wrap">
        {#each championPredictors() as player}
          <span class="bg-white text-yellow-600 text-sm px-3 py-2 rounded-full font-bold shadow-lg">
            {player.initials} ✨
          </span>
        {/each}
      </div>
    </div>
  {/if}
</div>

<!-- Match Dialog Modal -->
<Dialog.Root bind:open={showMatchDialog}>
  <Dialog.Content class="max-w-2xl">
    <Dialog.Header>
      <Dialog.Title class="text-2xl font-bold text-slate-800">
        {selectedMatch.roundName} - Match {selectedMatch.matchNumber}
      </Dialog.Title>
      <Dialog.Description class="text-slate-600">
        Tournament matchup details and competitor information
      </Dialog.Description>
    </Dialog.Header>
    
    <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mt-6">
      <!-- Competitor 1 -->
      {#if selectedMatch.competitor1}
        <div class="bg-slate-50 rounded-lg p-4 {selectedMatch.winner?.id === selectedMatch.competitor1.id ? 'ring-2 ring-green-500 bg-green-50' : ''}">
          <div class="text-center">
            <h4 class="text-lg font-bold text-slate-800 mb-1">
              {selectedMatch.competitor1.name}
            </h4>
            {#if selectedMatch.winner?.id === selectedMatch.competitor1.id}
              <span class="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                🏆 WINNER
              </span>
            {/if}
            <img 
              src={selectedMatch.competitor1.image} 
              alt={selectedMatch.competitor1.name}
              class="w-full max-w-sm mx-auto rounded-lg shadow-md mt-3"
            />
          </div>
        </div>
      {:else}
        <div class="bg-slate-100 rounded-lg p-4 flex items-center justify-center text-slate-500">
          <span>Awaiting competitor...</span>
        </div>
      {/if}
      
      <!-- VS Divider -->
      <div class="flex items-center justify-center py-2">
        <span class="text-2xl font-bold text-slate-400">VS</span>
      </div>
      
      <!-- Competitor 2 -->
      {#if selectedMatch.competitor2}
        <div class="bg-slate-50 rounded-lg p-4 {selectedMatch.winner?.id === selectedMatch.competitor2.id ? 'ring-2 ring-green-500 bg-green-50' : ''}">
          <div class="text-center">
            <img 
              src={selectedMatch.competitor2.image} 
              alt={selectedMatch.competitor2.name}
              class="w-full max-w-sm mx-auto rounded-lg shadow-md mb-3"
            />
            <h4 class="text-lg font-bold text-slate-800 mb-1">
              {selectedMatch.competitor2.name}
            </h4>
            {#if selectedMatch.winner?.id === selectedMatch.competitor2.id}
              <span class="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                🏆 WINNER
              </span>
            {/if}
          </div>
        </div>
      {:else}
        <div class="bg-slate-100 rounded-lg p-4 flex items-center justify-center text-slate-500">
          <span>Awaiting competitor...</span>
        </div>
      {/if}
    </div>
    
    <Dialog.Footer class="mt-6">
      <Dialog.Close>
        <Button variant="outline">Close</Button>
      </Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<style>
  .bracket-container {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  .competitor:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .match-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .match-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
</style>