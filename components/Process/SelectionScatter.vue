<script setup>
const props = defineProps(['ifObj', 'genNum', 'id_rank', 'id_arr', 'id_show']);
const { selected } = storeToRefs(useProcess());
const selection = ref();
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
} = storeToRefs(useData());
const dataReady = ref(false);
const r = ref(3.5);
const zoomFunction = ref();
const transform = ref(d3.zoomIdentity);
const _rScale = ref();
const rScalePath = (r) => rScale.value(r) / transform.value.k;
async function initZoom() {
	zoomFunction.value = useData().getZoomFunction(
		width.value,
		height.value,
		transform,
		true,
	);
	d3.select(selection.value).select('svg').call(zoomFunction.value);
	_rScale.value = (r) => rScale.value(r) / Math.pow(transform.value.k, 0.66);
}
onMounted(async () => {
	await initZoom();
	dataReady.value = true;
});
</script>
<style scoped></style>
<template>
	<div
		ref="selection"
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
					v-for="id in [...id_rank.keys()].sort()"
					:id="`selection-group-${id}`">
					<g v-if="id_show[id]">
						<circle
							class="ind"
							@click="useProcess().sel(ind.IID)"
							@mouseover="useEvent().mouseOver('ind', ind)"
							@mousemove="useEvent().mouseMove()"
							@mouseout="useEvent().mouseOut()"
							v-for="ind in id_arr.get(id).filter((ind) => ind.Alive)"
							:id="`selection_${ifObj ? 'obj' : 'dec'}_${genNum}_${ind.IID}`"
							:r="_rScale(r) * (selected.has(ind.IID) ? 1.25 : 1)"
							:stroke-width="_rScale(1) * (selected.has(ind.IID) ? 1.25 : 1)"
							:stroke="selected.has(ind.IID) ? '#ef4444' : 'grey'"
							:fill="colorMap()[ind.Type]"
							:cx="ifObj ? xScaleObj(ind.F_proj[0]) : xScaleDec(ind.X_proj[0])"
							:cy="ifObj ? yScaleObj(ind.F_proj[1]) : yScaleDec(ind.X_proj[1])"
							opacity="0.8" />
						<path
							class="cursor-pointer ind"
							@click="useProcess().sel(ind.IID)"
							@mouseover="useEvent().mouseOver('ind', ind)"
							@mousemove="useEvent().mouseMove()"
							@mouseout="useEvent().mouseOut()"
							:id="`selection_${ifObj ? 'obj' : 'dec'}_${genNum}_${ind.IID}`"
							v-for="ind in id_arr.get(id).filter((ind) => !ind.Alive)"
							:transform="`translate(${
								ifObj ? xScaleObj(ind.F_proj[0]) : xScaleDec(ind.X_proj[0])
							}, ${ifObj ? yScaleObj(ind.F_proj[1]) : yScaleDec(ind.X_proj[1])}) rotate(45)`"
							:d="
								d3
									.symbol()
									.type(d3.symbolCross)
									.size(rScalePath(20) * (selected.has(ind.IID) ? 1.6 : 1))()
							"
							:stroke="selected.has(ind.IID) ? '#ef4444' : 'grey'"
							:stroke-width="selected.has(ind.IID) ? _rScale(1) : _rScale(1) * 0.5"
							:fill="colorMap()[ind.Type]"
							opacity="0.8" />
					</g>
				</g>
			</g>
		</svg>
	</div>
</template>
