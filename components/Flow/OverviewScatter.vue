<style>
@import url('assets/main.css');

@keyframes blink {
	0% {
		opacity: 0;
	}

	50% {
		opacity: 1;
	}

	100% {
		opacity: 0;
	}
}

.overview-blink {
	animation: blink 1.5s infinite;
}
</style>
<template>
	<div ref="scatter" class="w-full h-full cursor-default">
		<svg @mouseover="hover = true" @mouseleave="hover = false" :id="`${ifObj ? 'obj' : 'dec'}-gen-${genNum}`"
			:width="width" :height="height" :view-box="`0 0 ${width} ${height}`" preserve-aspect-ratio="xMidYMid"
			class="bg-slate-50 relative top-[2px] left-[2px]">
			<g v-if="dataReady && functionsReady"
				:transform="`translate(${transform.x},${transform.y}) scale(${transform.k})`">
				<g>
					<!-- pf contour -->
					<g v-if="ifObj && showPF" class="pf">
						<path v-for="contour in pfContour" :d="d3.geoPath()(contour)"
							:fill="colorScale(contour.value).toString()" />
					</g>
					<!-- generation points -->
					<g v-for="(ind, i) in oneGenData.filter((ind) => ind.Alive)">
						<circle @mouseover="useEvent().mouseOver('ind', ind)" @mousemove="useEvent().mouseMove()"
							@mouseout="useEvent().mouseOut()" class="ind"
							:class="{ 'overview-blink': roots.has(getUid(ind)) }" v-if="typeFilter[ind.Type]"
							:id="`${ifObj ? 'obj' : 'dec'}_${genNum}_${ind.IID}`"
							:r="_rScale(r, { GD: ind.GD, NN: ind.NN })"
							:stroke="roots.has(getUid(ind)) ? colorArr()[getIndex(ind)] : 'gray'"
							:stroke-width="rScale(1)" :fill="colorMap()[ind.Type]"
							:cx="ifObj ? xScaleObj(ind.F_proj[0]) : xScaleDec(ind.X_proj[0])"
							:cy="ifObj ? yScaleObj(ind.F_proj[1]) : yScaleDec(ind.X_proj[1])" opacity="0.8"
							@click="clickInd(`${ind.Gen}_${ind.IID}`)" />
					</g>
					<g v-for="(ind, i) in oneGenData.filter((ind) => !ind.Alive)">
						<path @mouseover="useEvent().mouseOver('ind', ind)" @mousemove="useEvent().mouseMove()"
							@mouseout="useEvent().mouseOut()" class="cursor-pointer ind"
							:class="{ 'overview-blink': roots.has(getUid(ind)) }"
							:id="`${ifObj ? 'obj' : 'dec'}_${genNum}_${ind.IID}`"
							v-if="typeFilter['dead'] && typeFilter[ind.Type]" :transform="`translate(${ifObj ? xScaleObj(ind.F_proj[0]) : xScaleDec(ind.X_proj[0])
								}, ${ifObj ? yScaleObj(ind.F_proj[1]) : yScaleDec(ind.X_proj[1])}) rotate(45)`" :d="d3
									.symbol()
									.type(d3.symbolCross)
									.size(
										rSclalePath(20, { GD: ind.GD, NN: ind.NN }),
									)()
								" :stroke="roots.has(getUid(ind)) ? colorArr()[getIndex(ind)] : 'grey'" :stroke-width="rScale(1)"
							:fill="colorMap()[ind.Type]" opacity="0.8" @click="clickInd(`${ind.Gen}_${ind.IID}`)" />
					</g>
				</g>
			</g>
		</svg>
	</div>
</template>

<script setup>
const { r, rMethod, typeFilter, showPF } = storeToRefs(useEvent());
const scatter = ref();
const oneGenData = ref();
const dataReady = ref(false);
const props = defineProps(['id', 'genNum', 'ifObj', 'showAllSolutions']);
const {
	functionsReady,
	zooming,
	zoomVal,
	width,
	height,
	rScale,
	rScaleByGD,
	rScaleByNND,
	rScaleByNNXD,
	xScaleObj,
	yScaleObj,
	xScaleDec,
	yScaleDec,
	colorScale,
	pfContour,
	dataDictionary,
} = storeToRefs(useData());
const { trees, roots } = storeToRefs(useTree());
const { addTree, delTree } = useTree();

const zoomFunction = ref();
const transform = ref(d3.zoomIdentity);

const _rScale = ref();
const rSclalePath = computed(
	() => (r, extra) => Math.pow(_rScale.value(r, extra) / r, 2) * r,
);

async function initZoom() {
	let magnification = 3;
	oneGenData.value = Object.values(dataDictionary.value[props.genNum]);
	dataReady.value = true;
	zoomFunction.value = d3
		.zoom()
		.translateExtent([
			[-width.value * magnification, -height.value * magnification],
			[width.value * magnification * 2, height.value * magnification * 2],
		])
		.scaleExtent([1, 1])
		.on('start', () => (zooming.value = !zooming.value))
		.on('zoom', (event) => {
			transform.value = event.transform;
		})
		.on('end', () => (zooming.value = !zooming.value));
	d3.select(scatter.value).select('svg').call(zoomFunction.value);

	if (rMethod.value === 'F') {
		_rScale.value = rScale.value;
	} else if (rMethod.value === 'GD') {
		_rScale.value = rScaleByGD.value;
	} else if (rMethod.value === 'NND') {
		_rScale.value = rScaleByNND.value;
	} else {
		_rScale.value = rScaleByNNXD.value;
	}
}

function clickInd(uid) {
	if (trees.value.has(uid)) delTree(uid);
	else addTree(uid);
}

function getIndex(ind) {
	return [...trees.value.keys()].indexOf(`${ind.Gen}_${ind.IID}`);
}

onMounted(async () => {
	await initZoom();
});

watch(rMethod, async () => {
	await initZoom();
});

const { panOnDrag } = storeToRefs(useFlow());

const hover = ref(false);

watch(hover, () => {
	panOnDrag.value = hover.value ? false : true;
});
</script>