<script lang="ts">
	import { createDatePicker, createToggleGroup, melt } from '@melt-ui/svelte';
	import { ChevronRight, ChevronLeft, CalendarDays, Clock10 } from 'lucide-svelte';
	import { fade, blur } from 'svelte/transition';
	import {
		CalendarDateTime,
		CalendarDate,
		today,
		getLocalTimeZone,
		getDayOfWeek
	} from '@internationalized/date';

	let dateSelected: boolean = false;
	let selectedTime: string = 'Please select a time';

	const {
		elements: { root, item }
	} = createToggleGroup({
		type: 'single',
		onValueChange: ({ curr, next }) => {
			selectedTime = next ?? 'Please select a time';
			return next;
		}
	});

	const todaysDate: CalendarDate = today(getLocalTimeZone());

	const {
		elements: {
			calendar,
			cell,
			content,
			grid,
			heading,
			label,
			nextButton,
			prevButton,
			segment,
			trigger
		},
		states: { months, headingValue, daysOfWeek, segmentContents, open },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createDatePicker({
		forceVisible: true,
		fixedWeeks: true,
		minValue: new CalendarDate(todaysDate.year, todaysDate.month, todaysDate.day),
		maxValue: new CalendarDate(todaysDate.year + 1, todaysDate.month, todaysDate.day),
		defaultPlaceholder: todaysDate,
		isDateDisabled: (date) => {
			return !(getDayOfWeek(date, 'en') === 1 || getDayOfWeek(date, 'en') === 2);
		},
		onValueChange: ({ curr, next }) => {
			next ? dateSelected = true : dateSelected = false;
			return next;
		}
	});
</script>

<div class="fixed flex flex-col items-center w-full gap-3 bottom-1/4">
	<div>
		{#if !dateSelected}
			<span use:melt={$label}>Click to select a time to meet</span>
		{/if}
		<div class="button-container">
			<button use:melt={$trigger}>
				<CalendarDays size={32} />
			</button>
		</div>
	</div>
	{#if $open}
		<div transition:fade={{ duration: 400 }} use:melt={$content} class="scale-125">
			<div use:melt={$calendar}>
				<header>
					<button use:melt={$prevButton}>
						<ChevronLeft size={24} />
					</button>
					<div use:melt={$heading}>
						{$headingValue}
					</div>
					<button use:melt={$nextButton}>
						<ChevronRight size={24} />
					</button>
				</header>
				<div>
					{#each $months as month}
						<table use:melt={$grid}>
							<thead aria-hidden="true">
								<tr>
									{#each $daysOfWeek as day}
										<th>
											<div>
												{day}
											</div>
										</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each month.weeks as weekDates}
									<tr>
										{#each weekDates as date}
											<td
												role="gridcell"
												aria-disabled={$isDateDisabled(date) || $isDateUnavailable(date)}
											>
												<div use:melt={$cell(date, month.value)}>
													{date.day}
												</div>
											</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					{/each}
				</div>
			</div>
			<div
				use:melt={$root}
				class="flex items-center justify-center data-[orientation='vertical']:flex-col"
				aria-label="Text alignment"
			>
				<Clock10 />
				<button class="toggle-item" use:melt={$item('10 a.m.')} aria-label="10 a.m.">
					10 a.m.
				</button>
				<button class="toggle-item" use:melt={$item('11 a.m.')} aria-label="11 a.m.">
					11 a.m.
				</button>
				<button class="toggle-item" use:melt={$item('12 p.m.')} aria-label="12 p.m.">
					12 p.m.
				</button>
				<button class="toggle-item" use:melt={$item('1 p.m.')} aria-label="1 p.m.'">
					1 p.m.
				</button>
			</div>
		</div>
	{/if}
</div>

{#if !dateSelected && $open && selectedTime !== 'Please select a time'}
	<div class="flex justify-center m-8 text-2xl text-center">
		<div in:blur={{ duration: 500 }}>Please select a date</div>
	</div>
{/if}

{#if dateSelected}
	<div class="flex justify-center m-8 text-2xl text-center">
		<div transition:blur={{ duration: 500 }}>
			{#each $segmentContents as seg}
				{seg.value}
			{/each}
			<br />
			{selectedTime}
		</div>
	</div>
{/if}

{#if selectedTime !== 'Please select a time' && dateSelected}
	<div class="flex justify-center m-8 text-2xl text-center" transition:blur={{ duration: 500 }}>
		<button class="px-4 py-2 font-bold text-gray-200 border border-teal-400 hover:bg-teal-100/10">
			Book
		</button>
	</div>
{/if}

<style lang="postcss">
	.button-container {
		@apply mt-4 flex w-full items-center justify-center;
	}

	[data-melt-popover-content] {
		@apply z-10 rounded-lg bg-neutral-900 shadow-sm;
		@apply md:min-w-[320px]; /* Apply styles only for medium screens and larger */
	}

	[data-melt-popover-trigger] {
		@apply rounded-md bg-teal-400/80 p-1 text-neutral-950 transition-all hover:bg-teal-400/90;
	}

	[data-melt-datefield-label] {
		@apply select-none font-medium text-white;
	}

	[data-melt-datefield-label][data-invalid] {
		@apply text-red-500;
	}

	[data-melt-datefield-field] {
		@apply mt-1.5 flex w-full min-w-[200px] items-center rounded-lg border border-magnum-400/60 bg-neutral-800/80 p-1.5 text-magnum-400;
	}

	[data-melt-datefield-field][data-invalid] {
		@apply border-red-400;
	}

	[data-melt-datefield-segment][data-invalid] {
		@apply text-red-500;
	}

	[data-melt-datefield-segment]:not([data-segment='literal']) {
		@apply px-0.5;
	}

	[data-melt-datefield-validation] {
		@apply self-start text-red-500;
	}

	[data-melt-calendar] {
		@apply w-full rounded-lg bg-neutral-800/10 p-3 text-white shadow-sm;
	}

	header {
		@apply flex items-center justify-between pb-2;
	}

	header + div {
		@apply flex items-center gap-6;
	}

	[data-melt-calendar-prevbutton] {
		@apply rounded-lg p-1 transition-all hover:bg-teal-500/20;
	}

	[data-melt-calendar-nextbutton] {
		@apply rounded-lg p-1 transition-all hover:bg-teal-500/20;
	}

	[data-melt-calendar-prevbutton][data-disabled] {
		@apply pointer-events-none rounded-lg p-1 opacity-40;
	}

	[data-melt-calendar-nextbutton][data-disabled] {
		@apply pointer-events-none rounded-lg p-1 opacity-40;
	}

	[data-melt-calendar-heading] {
		@apply font-semibold;
	}

	th {
		@apply text-sm font-semibold;

		& div {
			@apply flex h-6 w-6 items-center justify-center p-4;
		}
	}

	[data-melt-calendar-grid] {
		@apply w-full;
	}

	[data-melt-calendar-cell] {
		@apply flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded-lg p-4 hover:bg-teal-500/20  focus:ring focus:ring-teal-400;
	}

	[data-melt-calendar-cell][data-disabled] {
		@apply pointer-events-none opacity-40;
	}

	[data-melt-calendar-cell][data-unavailable] {
		@apply pointer-events-none text-red-400 line-through;
	}

	[data-melt-calendar-cell][data-selected] {
		@apply bg-teal-400 text-neutral-950;
	}

	[data-melt-calendar-cell][data-outside-visible-months] {
		@apply pointer-events-none cursor-default opacity-40 hover:bg-transparent;
	}

	[data-melt-calendar-cell][data-outside-month] {
		@apply pointer-events-none cursor-default opacity-0 hover:bg-transparent;
	}

	.toggle-item {
		display: grid;
		place-items: center;
		align-items: center;

		background-color: theme('colors.black');
		color: theme('colors.teal.500');
		font-size: theme('fontSize.base');
		line-height: theme('lineHeight.4');
		outline: none;

		height: theme('height.9');
		padding: 8px;
		&:hover {
			background-color: theme('colors.teal.800/10');
		}

		&:focus {
			z-index: 10;
		}
	}

	.toggle-item[data-disabled] {
		@apply cursor-not-allowed;
	}

	.toggle-item[data-orientation='horizontal'] {
		@apply border-x border-l-transparent border-r-teal-200;

		&:first-child {
			@apply rounded-l-md;
		}

		&:last-child {
			@apply rounded-r-md border-r-transparent;
		}
	}

	.toggle-item[data-orientation='horizontal']:dir(rtl) {
		@apply border-x border-l-teal-200 border-r-transparent;

		&:first-child {
			@apply rounded-r-md;
		}

		&:last-child {
			@apply rounded-l-md border-l-transparent;
		}
	}

	.toggle-item[data-orientation='vertical'] {
		@apply border-y border-b-teal-200 border-t-transparent;

		&:first-child {
			@apply rounded-t-md;
		}

		&:last-child {
			@apply rounded-b-md border-b-transparent;
		}
	}

	.toggle-item[data-state='on'] {
		@apply bg-teal-300/90 text-teal-900;
	}
</style>
