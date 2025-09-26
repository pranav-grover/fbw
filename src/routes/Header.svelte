<script lang="ts">
	import { page } from '$app/state';
</script>

<header class="bg-orange-600 shadow-lg">
	<div class="container mx-auto px-4 py-3">
		<div class="flex items-center justify-between">
			<!-- Logo and Title -->
			<div class="flex items-center gap-3">
				<img src="/icon.png" alt="Fat Bear Week" class="w-12 h-12" />
				<div class="flex flex-col">
					<h1 class="text-xl font-bold text-white">Fat Bear Week</h1>
					<span class="text-xs text-amber-100 font-medium">Tournament Bracket</span>
				</div>
			</div>

			<!-- Navigation -->
			<nav class="flex items-center gap-6">
				<div class="flex gap-4">
					<a 
						href="/" 
						class="px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 {page.url.pathname === '/' ? 'bg-white/30' : 'hover:bg-white/20'}"
					>
						🏆 Bracket
					</a>
					<a 
						href="/results" 
						class="px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 {page.url.pathname === '/results' ? 'bg-white/30' : 'hover:bg-white/20'}"
					>
						📊 Results
					</a>
				</div>
				
				<!-- External Link -->
				<div class="border-l border-amber-400/40 pl-4">
					<a 
						href="https://www.explore.org/fat-bear-week" 
						target="_blank" 
						rel="noopener noreferrer"
						class="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-all duration-200"
					>
						🐻 Vote Official
						<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
							<path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
							<path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
						</svg>
					</a>
				</div>
			</nav>
		</div>
	</div>
</header>


