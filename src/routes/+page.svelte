<script lang="ts">
	import Calendar from '$lib/components/Calendar.svelte';
	import { calendarOpen } from '$lib/store';

	export let data;

	console.log({data});
</script>

<div class="flex flex-col items-center justify-center space-y-6 h-1/3">
	<h1 class="font-sans text-center text-7xl"><b>ADHD</b> coaching</h1>
	<p class="text-lg">Personalized attention strategies</p>
</div>

<Calendar />
