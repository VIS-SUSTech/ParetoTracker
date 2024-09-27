<template>
	<div ref="scatter" class="w-full h-full">
		<svg class="bg-stone-50 relative cursor-default" :width="width" :height="height"
			:view-box="`0 0 ${width} ${height}`" preserve-aspect-ratio="xMidYMid">
			<defs>
				<marker v-for="(rootUid, i) in [...nodesMap.keys()]" :id="`${ifObj ? 'obj' : 'dec'}_arrow_${i}`"
					:refX="arr[0]" :refY="arr[1]" :markerWidth="arr[2]" :markerHeight="arr[3]" opacity="0.65"
					orient="auto-start-reverse">
					<path :d="`M0,0 L${arr[4]},${arr[5]} L0,${arr[6]}`" :fill="colorArr()[i]" />
				</marker>
			</defs>

			<g v-if="dataReady && functionsReady"
				:transform="`translate(${transform.x},${transform.y}) scale(${transform.k})`">
				<!-- pf contour -->
				<g v-if="ifObj" class="pf">
					<path v-for="contour in pfContour" :d="d3.geoPath()(contour)"
						:fill="colorScale(contour.value).toString()" />
				</g>
				<!-- tree group -->
				<g :id="rootUid" v-for="(rootUid, i) in [...nodesMap.keys()]">
					<g v-for="line in linesMap.get(rootUid)" class="line">
						<line :stroke="colorArrDiff(i, line.brightness)" :stroke-width="_rScale(2)" :x1="line.line[0]"
							:y1="line.line[1]" :x2="line.line[2]" :y2="line.line[3]"
							:marker-end="line.isSelf ? '' : `url(#${ifObj ? 'obj' : 'dec'}_arrow_${i})`" />
					</g>
					<g v-for="ind in nodesMap.get(rootUid)" @mouseover="useEvent().mouseOver('ind-board', ind)"
						@mousemove="useEvent().mouseMove()" @mouseout="useEvent().mouseOut()" class="alive">
						<circle class="ind" :id="`board_${ifObj ? 'obj' : 'dec'}_${ind.Gen}_${ind.IID}`" :r="_rScale(r)"
							:stroke-width="_rScale(1)" :fill="colorArr()[i]"
							:cx="ifObj ? xScaleObj(ind.F_proj[0]) : xScaleDec(ind.X_proj[0])"
							:cy="ifObj ? yScaleObj(ind.F_proj[1]) : yScaleDec(ind.X_proj[1])" />
					</g>
				</g>
			</g>
		</svg>
	</div>
</template>

<script setup>
const colorScales = ref([]);
const { ifObj } = defineProps(['ifObj']);
const { trees, roots } = storeToRefs(useTree());
const {
	functionsReady,
	width,
	height,
	xScaleObj,
	yScaleObj,
	xScaleDec,
	yScaleDec,
	colorScale,
	pfContour,
	dataDictionary,
} = storeToRefs(useData());

const nodesMap = ref(new Map());
const linesMap = ref(new Map());

const scatter = ref();
const dataReady = ref(false);

const zoomFunction = ref();
const transform = ref(d3.zoomIdentity);
const _rScale = ref();

const arr = computed(() => [
	4 * Math.pow(_rScale.value(r.value) * 1.25, 0.85) * 0.75,
	1 * Math.pow(_rScale.value(r.value) * 1.25, 0.85) * 0.75,
	4 * Math.pow(_rScale.value(r.value) * 1.25, 0.85) * 0.75,
	2 * Math.pow(_rScale.value(r.value) * 1.25, 0.85) * 0.75,
	4 * Math.pow(_rScale.value(r.value) * 1.25, 0.85) * 0.75,
	1 * Math.pow(_rScale.value(r.value) * 1.25, 0.85) * 0.75,
	2 * Math.pow(_rScale.value(r.value) * 1.25, 0.85) * 0.75,
]);

const { r } = storeToRefs(useEvent());

async function initZoom() {
	zoomFunction.value = useData().getZoomFunction(
		width.value,
		height.value,
		transform,
		true,
	);
	_rScale.value = (r) => r / Math.sqrt(transform.value.k);
	d3.select(scatter.value).select('svg').call(zoomFunction.value);
}

async function prepareNode() {
	dataReady.value = false;
	nodesMap.value = new Map();
	trees.value.forEach((treeObject, rootUid) => {
		let nodes = treeObject.edges
			.flatMap((edge) => [edge.source, edge.target])
			.map((uid) => dataDictionary.value[uid.split('_')[0]][uid.split('_')[1]]);
		nodesMap.value.set(rootUid, nodes);
	});

	dataReady.value = true;

	setTimeout(async () => {
		await prepareLine();
	}, 500);
}
async function prepareLine() {
	linesMap.value = new Map();
	trees.value.forEach((treeObject, rootUid) => {
		let lines = treeObject.edges.map((edge) => {
			let gen = +edge.target.split('_')[0];
			let rootGen = +rootUid.split('_')[0];
			let diff = rootGen - gen;

			let src = edge.source;
			let dst = edge.target;

			let line = getLine(
				`#board_${ifObj ? 'obj' : 'dec'}_${src}`,
				`#board_${ifObj ? 'obj' : 'dec'}_${dst}`,
			);

			let isSelf = +edge.source.split('_')[1] === +edge.target.split('_')[1];
			return { diff: diff, line: line, isSelf: isSelf };
		});

		let brightnessScale = (param) =>
			d3
				.scaleLinear()
				.domain(d3.extent(lines.map((e) => e.diff)))
				.range([80, 40])(param);

		lines.forEach(
			(line) => (line.brightness = brightnessScale(line.diff).toFixed(2)),
		);

		linesMap.value.set(rootUid, lines);
	});
}

onMounted(initZoom);

watch(roots, () => {
	prepareNode();
});
</script>