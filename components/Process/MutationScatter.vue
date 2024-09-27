<script setup>
const props = defineProps(['ifObj', 'genNum']);
const dataReady = ref(false);
const mutation = ref();
const r = ref(3.5);
const {
	functionsReady,
	width,
	height,
	rScale,
	xScaleObj,
	yScaleObj,
	xScaleDec,
	yScaleDec,
	colorScale,
	pfContour,
	dataDictionary,
} = storeToRefs(useData());
const zoomFunction = ref();
const transform = ref(d3.zoomIdentity);
const oneGenData = ref();
const _rScale = ref(() => {});
const arr = ref([0, 0, 0, 0, 0, 0, 0]);

async function initZoom() {
	oneGenData.value = Object.values(dataDictionary.value[props.genNum]).filter(
		(e) => e.Type === 'mutation',
	);
	zoomFunction.value = useData().getZoomFunction(
		width.value,
		height.value,
		transform,
		true,
	);
	d3.select(mutation.value).select('svg').call(zoomFunction.value);
	_rScale.value = (r) => rScale.value(r) / Math.sqrt(transform.value.k);
	arr.value = [
		4 * Math.pow(_rScale.value(r.value) * 1.25, 0.85) * 0.75,
		1 * Math.pow(_rScale.value(r.value) * 1.25, 0.85) * 0.75,
		4 * Math.pow(_rScale.value(r.value) * 1.25, 0.85) * 0.75,
		2 * Math.pow(_rScale.value(r.value) * 1.25, 0.85) * 0.75,
		4 * Math.pow(_rScale.value(r.value) * 1.25, 0.85) * 0.75,
		1 * Math.pow(_rScale.value(r.value) * 1.25, 0.85) * 0.75,
		2 * Math.pow(_rScale.value(r.value) * 1.25, 0.85) * 0.75,
	];
	dataReady.value = true;
}

const indMutationMap = ref(new Map());

async function initMutationLines() {
	oneGenData.value.forEach((ind) => {
		const pre = `#premut_${props.ifObj ? 'obj' : 'dec'}_${props.genNum}_${ind.IID}`;
		const after = `#mutation_${props.ifObj ? 'obj' : 'dec'}_${props.genNum}_${
			ind.IID
		}`;
		const line = getLine(pre, after);
		indMutationMap.value.set(ind.IID, { show: showAllMutation.value, line: line });
	});
}

onMounted(async () => {
	await initZoom();
	setTimeout(async () => {
		await initMutationLines();
	}, 500);
});

const { showAllMutation } = storeToRefs(useProcess());
const { selected } = storeToRefs(useProcess());

watch(showAllMutation, () => {
	[...indMutationMap.value.values()].forEach((ind) => {
		ind.show = showAllMutation.value;
	});
});

watch(
	selected,
	() => {
		[...indMutationMap.value.keys()].forEach((iid) => {
			indMutationMap.value.get(iid)['show'] = selected.value.has(iid);
		});
	},
	{ deep: true },
);
</script>
<style scoped></style>
<template>
	<div
		ref="mutation"
		class="w-full h-full bg-indigo-200">
		<svg
			class="bg-stone-50 relative"
			:width="width"
			:height="height"
			:view-box="`0 0 ${width} ${height}`"
			preserve-aspect-ratio="xMidYMid">
			<defs>
				<marker
					:id="`${ifObj ? 'obj' : 'dec'}_arrow`"
					:refX="arr[0]"
					:refY="arr[1]"
					:markerWidth="arr[2]"
					:markerHeight="arr[3]"
					opacity="0.65"
					orient="auto-start-reverse">
					<path
						:d="`M0,0 L${arr[4]},${arr[5]} L0,${arr[6]}`"
						:fill="`#decbe4`" />
				</marker>
			</defs>
			<g
				v-if="dataReady && functionsReady"
				:transform="`translate(${transform.x},${transform.y}) scale(${transform.k})`">
				<!-- pf contour -->
				<g
					v-if="ifObj"
					class="pf">
					<path
						v-for="contour in pfContour"
						:d="d3.geoPath()(contour)"
						:fill="colorScale(contour.value).toString()" />
				</g>
				<!-- generation points -->
				<g
					class="lines"
					v-for="line in indMutationMap.values()">
					<line
						stroke="#decbe4"
						:stroke-width="_rScale(2)"
						:marker-end="`url(#${ifObj ? 'obj' : 'dec'}_arrow)`"
						v-if="line.show && dataReady"
						:x1="line.line[0]"
						:y1="line.line[1]"
						:x2="line.line[2]"
						:y2="line.line[3]" />
				</g>
				<g class="inds">
					<g v-for="(ind, i) in oneGenData">
						<!-- pre mutation -->
						<circle
							class="ind"
							@click="useProcess().sel(ind.IID)"
							@mouseover="useEvent().mouseOver('ind-crossover', ind)"
							@mousemove="useEvent().mouseMove()"
							@mouseout="useEvent().mouseOut()"
							:id="`premut_${ifObj ? 'obj' : 'dec'}_${genNum}_${ind.IID}`"
							:r="_rScale(r) * (selected.has(ind.IID) ? 1.25 : 1)"
							:stroke-width="_rScale(1) * (selected.has(ind.IID) ? 1.25 : 1)"
							:stroke="selected.has(ind.IID) ? '#ef4444' : 'grey'"
							:fill="colorMap()['crossover']"
							:cx="ifObj ? xScaleObj(ind.F_premut_proj[0]) : xScaleDec(ind.X_premut_proj[0])"
							:cy="ifObj ? yScaleObj(ind.F_premut_proj[1]) : yScaleDec(ind.X_premut_proj[1])"
							opacity="0.8" />
						<!-- after mutation -->
						<circle
							class="ind"
							@click="useProcess().sel(ind.IID)"
							@mouseover="useEvent().mouseOver('ind', ind)"
							@mousemove="useEvent().mouseMove()"
							@mouseout="useEvent().mouseOut()"
							:id="`mutation_${ifObj ? 'obj' : 'dec'}_${genNum}_${ind.IID}`"
							:r="_rScale(r) * (selected.has(ind.IID) ? 1.25 : 1)"
							:stroke-width="_rScale(1) * (selected.has(ind.IID) ? 1.25 : 1)"
							:stroke="selected.has(ind.IID) ? '#ef4444' : 'grey'"
							:fill="colorMap()['mutation']"
							:cx="ifObj ? xScaleObj(ind.F_proj[0]) : xScaleDec(ind.X_proj[0])"
							:cy="ifObj ? yScaleObj(ind.F_proj[1]) : yScaleDec(ind.X_proj[1])"
							opacity="0.8" />
					</g>
				</g>
			</g>
		</svg>
	</div>
</template>
