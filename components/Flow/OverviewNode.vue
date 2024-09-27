<script setup>
import { Position, Handle } from '#imports';
const props = defineProps(['id', 'data', 'label', 'position']);
const showAllSolutions = ref(false);
</script>
<style scoped></style>
<template>
	<div
		class="bg-white border-zinc-400 rounded border-2 w-80 flex flex-col items-center">
		<div class="w-full h-8 flex justify-center items-center text-lg bg-slate-200">
			{{ label }}
		</div>
		<!-- divider -->
		<div class="bg-zinc-400 h-[2px] w-full"></div>
		<!-- obj space -->
		<div class="w-80 h-80">
			<OverviewScatter
				:id="`obj-${id}`"
				:genNum="id"
				:ifObj="true"
				:showAllSolutions="showAllSolutions"></OverviewScatter>
		</div>
		<!-- divider -->
		<div class="bg-zinc-400 h-[2px] w-full"></div>
		<!-- dec space -->
		<div class="w-80 h-80">
			<OverviewScatter
				:id="`dec-${id}`"
				:genNum="id"
				:ifObj="false"
				:showAllSolutions="showAllSolutions"></OverviewScatter>
		</div>

		<Handle
			v-if="data.connect[0]"
			style="transform: translate(-5px, 10px); width: 12px; height: 12px"
			:position="Position.Left"
			type="target" />
		<Handle
			v-if="data.connect[1]"
			style="transform: translate(5px, 10px); width: 12px; height: 12px"
			:position="Position.Right"
			type="source" />
	</div>
</template>
