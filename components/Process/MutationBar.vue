<script setup>
const props = defineProps(['data', 'width', 'rScale', 'xScale']);
const iid = computed(() => props.data.ind.IID);
const { selected } = storeToRefs(useProcess());

const r = ref(6);

const scaleHeight = d3.scaleLinear().domain([0, 100]).range([5, 100]);
</script>
<style scoped></style>
<template>
	<div
		class="w-full h-[44px] border-zinc-400 rounded-md border-2 bg-indigo-50 flex items-center">
		<!-- label -->
		<div
			@click="useProcess().sel(iid)"
			class="w-12 h-full border-zinc-400 border-r-2 flex justify-center items-center flex-shrink-0"
			:class="[selected.has(iid) ? 'bg-stone-400' : 'bg-stone-200']">
			{{ iid }}
		</div>
		<!-- svg -->
		<div class="flex-grow flex h-full items-center">
			<div
				class="w-1/2 h-[40px] flex justify-center items-center border-zinc-400 border-r-2">
				<svg
					:width="width"
					height="36"
					preserve-aspect-ratio="XMidYMid">
					<defs>
						<linearGradient id="line">
							<stop
								offset="0%"
								stop-color="#decbe4"
								stop-opacity="1" />
							<stop
								offset="100%"
								stop-color="#fed9a6"
								stop-opacity="1" />
						</linearGradient>
					</defs>
					<g>
						<rect
							:width="xScale(data.mutationDist)"
							fill="url(#line)"
							stroke-width="0.5"
							opacity="0.75"
							stroke="rgba(0,0,0,0.15)"
							height="2"
							x="18"
							y="17" />
						<circle
							:cx="18"
							:cy="18"
							:r="r"
							stroke="grey"
							stroke-width="1"
							stroke-dasharray="1,0"
							fill="#decbe4" />
						<circle
							:cx="18"
							:cy="18"
							:r="rScale(data.ind.GD_premut)"
							stroke="grey"
							stroke-width="1"
							stroke-dasharray="1,1"
							fill="none" />
						<circle
							:cx="xScale(data.mutationDist) + 18"
							:cy="18"
							:r="r"
							stroke="grey"
							stroke-width="1"
							fill="#fed9a6" />
						<circle
							:cx="xScale(data.mutationDist) + 18"
							:cy="18"
							:r="rScale(data.ind.GD)"
							stroke="grey"
							stroke-width="1"
							stroke-dasharray="1,1"
							fill="none" />
					</g>
				</svg>
			</div>
			<!-- bars -->
			<div class="w-1/2 h-full m-1 flex gap-[1px] items-end">
				<div
					v-for="(diff, i) in data.diff"
					class="flex-grow h-full flex flex-col justify-end"
					style="background-color: rgba(222, 203, 228, 0.25)">
					<div
						class="bg-gray-400 w-full flex items-center justify-center p-[1px]"
						:style="{
							height: `${diff < 1e-8 ? 0 : scaleHeight(diff)}%`,
							padding: diff < 1e-8 ? 0 : '1px',
							paddingTop: scaleHeight(diff).toFixed(0) == 100 || diff < 1e-8 ? 0 : '1px',
							paddingBottom: 0,
						}">
						<svg
							width="100%"
							height="100%"
							style="background-color: rgba(254, 217, 166, 0.75)"></svg>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
