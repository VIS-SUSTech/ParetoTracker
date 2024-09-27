<script>
export default {
	inheritAttrs: false,
};
</script>

<template>
	<BaseEdge :id="id" :style="style" :path="path[0]" :marker-end="markerEnd" />

	<EdgeLabelRenderer>
		<div ref="process" :style="{ transform: translate }" class="absolute pointer-events-auto">
			<!-- expand button -->
			<div v-if="!expand" @click="act" class="process-btn" :class="{ 'process-btn-hover': hover }">
				<n-icon size="26">
					<svg viewBox="0 0 24 24">
						<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
							stroke-linejoin="round">
							<path d="M12 5v14"></path>
							<path d="M5 12h14"></path>
						</g>
					</svg>
				</n-icon>
			</div>
			<!-- process box -->
			<div class="transition-all delay-100 duration-300 ease-in-out overflow-hidden pointer-events-all flex justify-center items-center"
				:class="{ 'w-0 h-0': !expand, 'w-[2100px] h-[900px]': expand }">
				<div v-if="expand" class="flex flex-col gap-2 p-2 rounded-md border-zinc-400 border-2 bg-stone-50">
					<div
						class="w-full h-12 flex-shrink-0 rounded-md border-zinc-400 border-2 bg-slate-200 flex gap-2 p-2 items-center">
						<!-- title -->
						<div class="text-xl">
							Evolutionary Operations of Generation {{ position[1] }}
						</div>
						<!-- btns -->
						<div class="flex-grow ml-auto flex items-center gap-1">
							<n-button @click="useProcess().clear()" class="flex-shrink-0 ml-auto" size="tiny"
								type="tertiary" tertiary strong>
								clear selection
							</n-button>

							<n-button @click="useFlow().clearProcess()" class="flex-shrink-0" size="tiny"
								type="tertiary" tertiary strong>
								collapse process
							</n-button>
						</div>
					</div>
					<div class="w-full h-[800px] flex gap-2" @mouseover="hover = true" @mouseleave="hover = false">
						<Crossover :position="position"> </Crossover>
						<Mutation :position="position"> </Mutation>
						<Selection :position="position"></Selection>
					</div>
				</div>
			</div>
		</div>
	</EdgeLabelRenderer>
</template>

<style scoped>
.process-btn {
	@apply bg-neutral-100 w-8 h-8 text-xl flex justify-center items-center transition-all delay-100 duration-300 ease-in-out border-neutral-300 rounded-full border-4;
}

.process-btn-hover {
	box-shadow: 0 0 0 2px #10b98180, 0 0 0 4px #10b981;
}
</style>

<script setup>
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '#imports';
const expand = ref(false);
const hover = ref(false);
const process = ref();

const { processId, zoomOnScroll, panOnDrag } = storeToRefs(useFlow());

const props = defineProps([
	'id',
	'sourceX',
	'sourceY',
	'targetX',
	'targetY',
	'sourcePosition',
	'targetPosition',
	'markerEnd',
	'style',
]);
const path = computed(() => getBezierPath(props));
const translate = computed(
	() => `translate(-50%,-50%) translate(${path.value[1]}px,${path.value[2]}px)`,
);
const position = computed(() => {
	let idstr = props.id.replaceAll('e', '');
	let arr = idstr.split('-');
	return arr;
});

function act() {
	expand.value = true;
	processId.value = props.id;
	useTree().clearTree();
	window.$message.success(
		`Process: ${position.value[0]} ==> ${position.value[1]}`,
	);
	useFlow().moveElements();
}

watch(processId, () => {
	if (processId.value !== props.id) expand.value = hover.value = false;
});

watch(hover, () => {
	zoomOnScroll.value = panOnDrag.value = hover.value ? false : true;
});

onMounted(() => {
	process.value.addEventListener('wheel', function (event) {
		event.stopPropagation();
	});
});
const { selected } = storeToRefs(useProcess());
watch(selected, () => { }, { deep: true });
</script>