<script lang="ts">
  import { calculateAllPlayerScores, getPredictionBreakdown } from '$lib/data/scoring';
  import { players } from '$lib/data/players';
  import PlayerBracket from '$lib/components/PlayerBracket.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Button from '$lib/components/ui/button/button.svelte';
  
  let playerScores = $state(calculateAllPlayerScores());
  let showPlayerBracketDialog = $state(false);
  let selectedPlayer = $state(null as any);
  
  function showPlayerBracket(playerName: string) {
    selectedPlayer = players.find(p => p.name === playerName);
    showPlayerBracketDialog = true;
  }
</script>

<svelte:head>
	<title>Player Results</title>
	<meta name="description" content="Tournament player predictions and scores" />
</svelte:head>

<div class="container mx-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
	<h1 class="text-4xl font-bold text-center mb-8 text-slate-800">🏆 Fat Bear Week Results</h1>
	
	<div class="bg-white rounded-lg shadow-lg overflow-hidden">
		<!-- Scoring Legend -->
		<div class="bg-slate-100 p-4 border-b">
			<h2 class="text-lg font-semibold mb-2">Scoring System</h2>
			<div class="flex flex-wrap gap-4 text-sm">
				<span class="bg-blue-100 px-3 py-1 rounded-full">Round 1: 1 point each</span>
				<span class="bg-green-100 px-3 py-1 rounded-full">Quarterfinals: 2 points each</span>
				<span class="bg-yellow-100 px-3 py-1 rounded-full">Semifinals: 4 points each</span>
				<span class="bg-red-100 px-3 py-1 rounded-full">Finals Winner: 8 points</span>
			</div>
		</div>

		<!-- Results Table -->
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-slate-50">
					<tr>
						<th class="text-left p-4 font-semibold text-slate-700">Rank</th>
						<th class="text-left p-4 font-semibold text-slate-700">Player</th>
						<th class="text-center p-4 font-semibold text-slate-700">Round 1<br><span class="text-xs text-slate-500">(1pt each)</span></th>
						<th class="text-center p-4 font-semibold text-slate-700">Quarterfinals<br><span class="text-xs text-slate-500">(2pts each)</span></th>
						<th class="text-center p-4 font-semibold text-slate-700">Semifinals<br><span class="text-xs text-slate-500">(4pts each)</span></th>
						<th class="text-center p-4 font-semibold text-slate-700">Finals<br><span class="text-xs text-slate-500">(8pts)</span></th>
						<th class="text-center p-4 font-semibold text-slate-700 bg-yellow-50">Total Score</th>
					</tr>
				</thead>
				<tbody>
					{#each playerScores as player, index}
						{@const breakdown = getPredictionBreakdown(player)}
						<tr 
							class="border-t hover:bg-blue-50 cursor-pointer transition-colors {index === 0 ? 'bg-yellow-50 hover:bg-yellow-100' : ''}"
							onclick={() => showPlayerBracket(player.playerName)}
						>
							<td class="p-4">
								{#if index === 0}
									<span class="text-2xl">🥇</span>
								{:else if index === 1}
									<span class="text-2xl">🥈</span>
								{:else if index === 2}
									<span class="text-2xl">🥉</span>
								{:else}
									<span class="text-slate-500 font-medium">#{index + 1}</span>
								{/if}
							</td>
							<td class="p-4">
								<div class="flex items-center gap-3">
									<span class="bg-blue-500 text-white text-sm px-3 py-1 rounded-full font-medium">
										{player.initials}
									</span>
									<span class="font-medium text-slate-800">
										{player.playerName}
									</span>
								</div>
							</td>
							<td class="p-4 text-center">
								<div class="flex flex-col items-center">
									<span class="text-sm text-slate-600">{breakdown.round1}</span>
									<span class="font-bold {player.round1Score > 0 ? 'text-green-600' : 'text-slate-400'}">
										{player.round1Score} pts
									</span>
								</div>
							</td>
							<td class="p-4 text-center">
								<div class="flex flex-col items-center">
									<span class="text-sm text-slate-600">{breakdown.round2}</span>
									<span class="font-bold {player.round2Score > 0 ? 'text-green-600' : 'text-slate-400'}">
										{player.round2Score} pts
									</span>
								</div>
							</td>
							<td class="p-4 text-center">
								<div class="flex flex-col items-center">
									<span class="text-sm text-slate-600">{breakdown.round3}</span>
									<span class="font-bold {player.round3Score > 0 ? 'text-green-600' : 'text-slate-400'}">
										{player.round3Score} pts
									</span>
								</div>
							</td>
							<td class="p-4 text-center">
								<div class="flex flex-col items-center">
									<span class="text-sm text-slate-600">{breakdown.round4}</span>
									<span class="font-bold {player.round4Score > 0 ? 'text-green-600' : 'text-slate-400'}">
										{player.round4Score} pts
									</span>
								</div>
							</td>
							<td class="p-4 text-center bg-yellow-50">
								<div class="flex flex-col items-center">
									<span class="text-2xl font-bold text-slate-800">{player.totalScore}</span>
									<span class="text-xs text-slate-500">{breakdown.totalCorrect}/{breakdown.totalPossible} correct</span>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Summary Stats -->
		<div class="bg-slate-50 p-4 border-t">
			<div class="flex flex-wrap gap-6 text-sm text-slate-600">
				<div>
					<span class="font-medium">Highest Score:</span> 
					{playerScores[0]?.totalScore || 0} points
				</div>
				<div>
					<span class="font-medium">Average Score:</span> 
					{Math.round((playerScores.reduce((sum, p) => sum + p.totalScore, 0) / playerScores.length) * 10) / 10} points
				</div>
				<div>
					<span class="font-medium">Total Players:</span> 
					{playerScores.length}
				</div>
			</div>
		</div>
	</div>

	<div class="text-center mt-8">
		<a href="/fbw/bracket" class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
			View Tournament Bracket
		</a>
	</div>
</div>

<!-- Player Bracket Dialog -->
<Dialog.Root bind:open={showPlayerBracketDialog}>
	<Dialog.Content class="max-w-6xl max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>
				{#if selectedPlayer}
					{selectedPlayer.name}'s Bracket
				{/if}
			</Dialog.Title>
		</Dialog.Header>
		{#if selectedPlayer}
			<PlayerBracket player={selectedPlayer} />
		{/if}
	</Dialog.Content>
</Dialog.Root>
