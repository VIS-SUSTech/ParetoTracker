<script setup>
const props = defineProps(['ifObj', 'genNum', 'pairs']);
const { showAllPair, selected } = storeToRefs(useProcess());
const dataReady = ref(false);
const crossover = ref();
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
const _rScale = ref();

async function initZoom() {
	oneGenData.value = Object.values(dataDictionary.value[props.genNum]);
	zoomFunction.value = useData().getZoomFunction(
		width.value,
		height.value,
		transform,
		true,
	);
	d3.select(crossover.value).select('svg').call(zoomFunction.value);
	_rScale.value = (r) => rScale.value(r) / Math.sqrt(transform.value.k);
	dataReady.value = true;
}

const pathReady = ref(false);
async function initPairPath() {
	props.pairs.forEach((pair) => {
		let space = props.ifObj ? 'obj' : 'dec';

		let p1uid = getUid(pair.p1);
		let p2uid = getUid(pair.p2);
		let off1uid = getUid(pair.off1);

		if (pair.off2) {
			let off2uid = getUid(pair.off2);
			pair[`${space}offspringLine`] = getLine(
				`#mating_${space}_${off1uid}`,
				`#mating_${space}_${off2uid}`,
			);
		}

		pair[`${space}parentLine`] = getLine(
			`#mating_${space}_${p1uid}`,
			`#mating_${space}_${p2uid}`,
		);

		pair.show = showAllPair.value;
	});
	pathReady.value = true;
}

watch(showAllPair, () => {
	props.pairs.map((pair) => {
		pair.show = showAllPair.value;
		return pair;
	});
});

watch(
	selected,
	() => {
		props.pairs.map((pair) => {
			if (pair.off2) {
				pair.show =
					selected.value.has(pair.p1.IID) ||
					selected.value.has(pair.p2.IID) ||
					selected.value.has(pair.off1.IID) ||
					selected.value.has(pair.off2.IID);
				return pair;
			}
			if (
				selected.value.has(pair.p1.IID) ||
				selected.value.has(pair.p2.IID) ||
				selected.value.has(pair.off1.IID)
			) {
				pair.show = true;
			} else {
				pair.show = false;
			}
			return pair;
		});
	},
	{ deep: true },
);

onMounted(async () => {
	await initZoom();
	await initPairPath();
});
</script>
<style scoped></style>
<template>
	<div
		ref="crossover"
		class="w-full h-full bg-indigo-200">
		<svg
			class="bg-stone-50 relative"
			:width="width"
			:height="height"
			:view-box="`0 0 ${width} ${height}`"
			preserve-aspect-ratio="xMidYMid">
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

				<g
					class="lines"
					v-if="pathReady"
					v-for="pair in pairs">
					<g v-if="pair.show">
						<line
							class="parent"
							stroke="#31a354"
							:stroke-width="_rScale(1)"
							:x1="pair[`${ifObj ? 'obj' : 'dec'}parentLine`][0]"
							:y1="pair[`${ifObj ? 'obj' : 'dec'}parentLine`][1]"
							:x2="pair[`${ifObj ? 'obj' : 'dec'}parentLine`][2]"
							:y2="pair[`${ifObj ? 'obj' : 'dec'}parentLine`][3]"></line>
						<line
							v-if="pair.off2"
							class="offspring"
							stroke="#decbe4"
							:stroke-width="_rScale(1)"
							:x1="pair[`${ifObj ? 'obj' : 'dec'}offspringLine`][0]"
							:y1="pair[`${ifObj ? 'obj' : 'dec'}offspringLine`][1]"
							:x2="pair[`${ifObj ? 'obj' : 'dec'}offspringLine`][2]"
							:y2="pair[`${ifObj ? 'obj' : 'dec'}offspringLine`][3]"></line>
					</g>
				</g>

				<g class="inds">
					<g
						class="offsprings"
						v-for="(ind, i) in oneGenData.filter(
							(ind) => ind.Type === 'mutation' || ind.Type === 'crossover',
						)">
						<circle
							class="ind"
							@click="useProcess().sel(ind.IID)"
							@mouseover="useEvent().mouseOver('ind-crossover', ind)"
							@mousemove="useEvent().mouseMove()"
							@mouseout="useEvent().mouseOut()"
							:id="`mating_${ifObj ? 'obj' : 'dec'}_${genNum}_${ind.IID}`"
							:r="_rScale(r) * (selected.has(ind.IID) ? 1.25 : 1)"
							:stroke-width="_rScale(1) * (selected.has(ind.IID) ? 1.25 : 1)"
							:stroke="selected.has(ind.IID) ? '#ef4444' : 'grey'"
							:fill="colorMap()[ind.Type === 'mutation' ? 'crossover' : ind.Type]"
							:cx="ifObj ? xScaleObj(ind.F_premut_proj[0]) : xScaleDec(ind.X_premut_proj[0])"
							:cy="ifObj ? yScaleObj(ind.F_premut_proj[1]) : yScaleDec(ind.X_premut_proj[1])"
							opacity="0.8" />
					</g>
					<g
						class="parents"
						v-for="(ind, i) in oneGenData.filter(
							(ind) => ind.Type === 'mating' || ind.Type === 'reserved',
						)">
						<circle
							class="ind"
							@click="useProcess().sel(ind.IID)"
							@mouseover="useEvent().mouseOver('ind-board', ind)"
							@mousemove="useEvent().mouseMove()"
							@mouseout="useEvent().mouseOut()"
							:id="`mating_${ifObj ? 'obj' : 'dec'}_${genNum}_${ind.IID}`"
							:r="_rScale(r) * (selected.has(ind.IID) ? 1.25 : 1)"
							:stroke-width="_rScale(1) * (selected.has(ind.IID) ? 1.25 : 1)"
							:stroke="selected.has(ind.IID) ? '#ef4444' : 'grey'"
							:fill="colorMap()[ind.Type]"
							:cx="ifObj ? xScaleObj(ind.F_proj[0]) : xScaleDec(ind.X_proj[0])"
							:cy="ifObj ? yScaleObj(ind.F_proj[1]) : yScaleDec(ind.X_proj[1])"
							opacity="0.8" />
					</g>
				</g>
			</g>
		</svg>
	</div>
</template>
