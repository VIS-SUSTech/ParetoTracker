<template>
	<div class="w-full h-full relative z-10">
		<VueFlow
			v-if="elementReady"
			class="basicflow"
			:min-zoom="0.2"
			:max-zoom="10"
			:node-types="nodeTypes"
			:edge-types="edgeTypes"
			:nodes="nodes"
			:edges="edges">
			<Background
				pattern-color="#aaa"
				:gap="16" />
			<Controls :position="'bottom-right'"></Controls>

			<!-- overview node -->
			<template #node-overview="props">
				<OverviewNode v-bind="props" />
			</template>

			<!-- line between two generations -->
			<template #edge-process="props">
				<ProcessContainer v-bind="props" />
			</template>
		</VueFlow>
	</div>
</template>

<script setup>
import { VueFlow, Background, Controls } from '#imports';
import overview from './OverviewNode.vue';
import process from './ProcessContainer.vue';
const nodeTypes = {
	overview: markRaw(overview),
};
const edgeTypes = {
	process: markRaw(process),
};
const { nodes, edges, elementReady } = storeToRefs(useFlow());

onBeforeMount(async () => {
	await useFlow().updateElements();
});

useFlow().onPaneReady(() => {
	let marker = document.getElementById('arrowclosed');
	marker.setAttribute('refX', 1);
	marker.setAttribute('markerWidth', 25);
	marker.setAttribute('markerHeight', 25);
	useFlow().fit();
});
</script>
