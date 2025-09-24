<script lang="ts">
  import { tournamentWinners, bearImages, bearDisplayNames } from '$lib/data/winners.js';
  import { players } from '$lib/data/players.js';
	import Button from './ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';

  interface Competitor {
    id: number;
    name: string;
  }
  
  interface Match {
    id: string;
    competitor1: Competitor | null;
    competitor2: Competitor | null;
    winner: Competitor | null;
  }

  // Match dialog state using Svelte 5 runes
  let showMatchDialog = $state(false);
  let selectedMatch = $state({
    competitor1: null as Competitor | null,
    competitor2: null as Competitor | null,
    winner: null as Competitor | null,
    roundName: '',
    matchNumber: 0
  });
  
  // Initial 12 competitors
  let initialCompetitors: Competitor[] = $state([
    { id: 0, name: '128 Jr' },
    { id: 1, name: '609' },
    { id: 2, name: '26' },
    { id: 3, name: '909' },
    { id: 4, name: '503' },
    { id: 5, name: '901' },
    { id: 6, name: '99' },
    { id: 7, name: '856' },
    { id: 8, name: '602' },
    { id: 9, name: '128' },
    { id: 10, name: '32' },
    { id: 11, name: '910' }
  ]);
  
  // Create reactive bracket structure
  const bracket = $state({
    // Round 1 - First Round
    round1: [
      { id: 'q1', competitor1: initialCompetitors[0], competitor2: initialCompetitors[1], winner: null },
      { id: 'q2', competitor1: initialCompetitors[2], competitor2: initialCompetitors[3], winner: null },
      { id: 'q3', competitor1: initialCompetitors[4], competitor2: initialCompetitors[5], winner: null },
      { id: 'q4', competitor1: initialCompetitors[6], competitor2: initialCompetitors[7], winner: null },
    ] as Match[],
    // Round 2 - Quarterfinals
    round2: [
      { id: 's1', competitor1: initialCompetitors[8], competitor2: null, winner: null },
      { id: 's2', competitor1: initialCompetitors[9], competitor2: null, winner: null },
      { id: 's3', competitor1: initialCompetitors[10], competitor2: null, winner: null },
      { id: 's4', competitor1: initialCompetitors[11], competitor2: null, winner: null }
    ] as Match[],
    // Round 3 - Semifinals
    round3: [
      { id: 's1', competitor1: null, competitor2: null, winner: null },
      { id: 's2', competitor1: null, competitor2: null, winner: null },
    ] as Match[],
    // Round 4 - Finals
    round4: [
      { id: 'f1', competitor1: null, competitor2: null, winner: null }
    ] as Match[]
  });

  const rounds: Record<string, string> = {
    round1: 'Round 1',
    round2: 'Quarterfinals',
    round3: 'Semifinals',
    round4: 'Finals'
  }

  let champion = $state<Competitor | null>(null);
  
  // Initialize bracket with hardcoded winners
  function initializeBracketWithWinners() {
    // Set first round winners
    bracket.round1.forEach((match, index) => {
      const winnerId = tournamentWinners.round1Winners[index];
      match.winner = initialCompetitors.find(c => c.id === winnerId) || null;
    });
    
    // Set quarterfinals competitors and winners
    bracket.round2.forEach((match, index) => {
      const winnerId = tournamentWinners.round2Winners[index];
      match.winner = initialCompetitors.find(c => c.id === winnerId) || null;
      
      // Set competitor2 for round2 matches from round1 winners
      if (index < 4 && bracket.round1[index]?.winner) {
        match.competitor2 = bracket.round1[index].winner;
      }
    });
    
    // Set semifinals competitors and winners
    bracket.round3.forEach((match, index) => {
      const winnerId = tournamentWinners.round3Winners[index];
      match.winner = initialCompetitors.find(c => c.id === winnerId) || null;
      
      // Set competitors from round2 winners
      match.competitor1 = bracket.round2[index * 2]?.winner || null;
      match.competitor2 = bracket.round2[index * 2 + 1]?.winner || null;
    });
    
    // Set finals competitors and winner
    bracket.round4[0].competitor1 = bracket.round3[0]?.winner || null;
    bracket.round4[0].competitor2 = bracket.round3[1]?.winner || null;
    bracket.round4[0].winner = initialCompetitors.find(c => c.id === tournamentWinners.round4Winner) || null;
    
    // Set champion
    champion = initialCompetitors.find(c => c.id === tournamentWinners.champion) || null;
  }
  
  // Function to show match dialog when competitor is clicked
  function showMatchModal(match: Match, roundName: string, matchNumber: number) {
    selectedMatch = {
      competitor1: match.competitor1,
      competitor2: match.competitor2,
      winner: match.winner,
      roundName,
      matchNumber: matchNumber + 1
    };
    showMatchDialog = true;
  }
  
  // Function to close match dialog
  function closeMatchModal() {
    showMatchDialog = false;
  }
  
  // Function to get players who correctly predicted a winner
  function getCorrectPredictions(roundKey: string, matchIndex: number, winnerId: number): string[] {
    const correctPlayers: string[] = [];
    
    players.forEach(player => {
      let isCorrect = false;
      
      if (roundKey === 'round1' && player.picks.round1Winners[matchIndex] === winnerId) {
        isCorrect = true;
      } else if (roundKey === 'round2' && player.picks.round2Winners[matchIndex] === winnerId) {
        isCorrect = true;
      } else if (roundKey === 'round3' && player.picks.round3Winners[matchIndex] === winnerId) {
        isCorrect = true;
      } else if (roundKey === 'round4' && player.picks.round4Winner === winnerId) {
        isCorrect = true;
      }
      
      if (isCorrect) {
        correctPlayers.push(player.initials);
      }
    });
    
    return correctPlayers;
  }
  
  // Component for displaying winner badges
  function WinnerBadge(props: { correctPlayers: string[] }) {
    if (props.correctPlayers.length === 0) return null;
    
    if (props.correctPlayers.length === 1) {
      return props.correctPlayers[0];
    }
    
    return `${props.correctPlayers.length}+`;
  }
  
  // Initialize bracket on component load
  initializeBracketWithWinners();
</script>

<div class="bracket-container p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
  <h1 class="text-3xl font-bold text-center mb-8 text-slate-800">Tournament Bracket</h1>
  
  {#each Object.entries(bracket) as [roundKey, matches]}
    {#if roundKey !== 'champion'}
      <div class="bracket-round mb-8">
        <h2 class="text-xl font-semibold mb-4 text-slate-700 text-center">
          {rounds[roundKey]}
        </h2>
        
        <div class="matches-container flex flex-wrap gap-4 justify-center">
          {#each matches as match, matchIndex}
            <div class="match-card bg-white rounded-lg shadow-md p-4 border-2 border-slate-200 hover:border-slate-300 transition-colors min-w-[210px]">
              <div class="match-header text-center mb-3">
                <span class="text-sm font-medium text-slate-500 uppercase tracking-wide">Match {matchIndex + 1}</span>
              </div>
              
              <div class="competitors space-y-2">
                {#if match.competitor1}
                  <button 
                    class="competitor w-full p-3 text-left rounded-md border-2 transition-all duration-200 {match.winner?.id === match.competitor1.id ? 'border-green-500 bg-green-50 text-green-800' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'}"
                    onclick={() => showMatchModal(match, rounds[roundKey], matchIndex)}
                  >
                    <div class="flex items-center justify-between">
                      <span class="font-medium">{match.competitor1.name}</span>
                      {#if match.winner?.id === match.competitor1.id}
                        {@const correctPlayers = getCorrectPredictions(roundKey, matchIndex, match.competitor1.id)}
                        <div class="flex items-center gap-2">
                          <span class="text-green-600 text-sm font-bold">WINNER</span>
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
                  </button>
                {:else}
                  <div class="competitor w-full p-3 text-center rounded-md border-2 border-dashed border-slate-300 bg-slate-100 text-slate-500">
                    Awaiting competitor...
                  </div>
                {/if}
                
                <div class="text-center text-slate-400 font-bold">VS</div>
                
                {#if match.competitor2}
                  <button 
                    class="competitor w-full p-3 text-left rounded-md border-2 transition-all duration-200 {match.winner?.id === match.competitor2.id ? 'border-green-500 bg-green-50 text-green-800' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'}"
                    onclick={() => showMatchModal(match, rounds[roundKey], matchIndex)}
                  >
                    <div class="flex items-center justify-between">
                      <span class="font-medium">{match.competitor2.name}</span>
                      {#if match.winner?.id === match.competitor2.id}
                        {@const correctPlayers = getCorrectPredictions(roundKey, matchIndex, match.competitor2.id)}
                        <div class="flex items-center gap-2">
                          <span class="text-green-600 text-sm font-bold">WINNER</span>
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
                  </button>
                {:else}
                  <div class="competitor w-full p-3 text-center rounded-md border-2 border-dashed border-slate-300 bg-slate-100 text-slate-500">
                    Awaiting competitor...
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/each}
  
  <!-- Champion Section -->
  {#if champion}
    <div class="champion-section text-center mt-12 p-8 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-white mb-4">🏆 Tournament Champion 🏆</h2>
      <div class="champion-name text-3xl font-bold text-white bg-black bg-opacity-20 rounded-lg p-4 inline-block mb-4">
        {champion.name}
      </div>
      <div class="flex justify-center gap-2 flex-wrap">
        {#each players.filter(p => champion && p.picks.champion === champion.id) as player}
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
              {bearDisplayNames[selectedMatch.competitor1.id]}
            </h4>
            {#if selectedMatch.winner?.id === selectedMatch.competitor1.id}
              <span class="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                🏆 WINNER
              </span>
            {/if}
            <img 
              src={bearImages[selectedMatch.competitor1.id]} 
              alt={bearDisplayNames[selectedMatch.competitor1.id]}
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

    
    <!-- VS Divider for desktop -->
    <!-- <div class="hidden md:flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-4 border-slate-200 rounded-full w-16 h-16 items-center justify-center z-10">
      <span class="text-xl font-bold text-slate-600">VS</span>
    </div> -->
      
      <!-- Competitor 2 -->
      {#if selectedMatch.competitor2}
        <div class="bg-slate-50 rounded-lg p-4 {selectedMatch.winner?.id === selectedMatch.competitor2.id ? 'ring-2 ring-green-500 bg-green-50' : ''}">
          <div class="text-center">
            <img 
              src={bearImages[selectedMatch.competitor2.id]} 
              alt={bearDisplayNames[selectedMatch.competitor2.id]}
              class="w-full max-w-sm mx-auto rounded-lg shadow-md mb-3"
            />
            <h4 class="text-lg font-bold text-slate-800 mb-1">
              {bearDisplayNames[selectedMatch.competitor2.id]}
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