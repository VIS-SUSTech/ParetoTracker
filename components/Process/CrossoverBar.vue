<script setup>
const props = defineProps(['data', 'xScale', 'rScale', 'GDScale', 'selected']);
const ready = ref(false);
const barRef = ref();
const width = ref();
const padding = 20;
const parentRadius = 6;
const initWidth = () => {
	width.value = barRef.value.clientWidth;
};
let p1, p2, o1, o2, offset;
const initData = () => {
	let _ = props.data;
	p1 = {
		r: parentRadius,
		_r: props.GDScale(_.p1.GD),
		cx: padding,
	};
	p2 = {
		r: parentRadius,
		_r: props.GDScale(_.p2.GD),
		cx: padding + (width.value - padding * 2) * props.xScale(_.parentsDistance),
	};
	offset = width.value / 2 - (p1.cx + p2.cx) / 2;
	o1 = {
		r: props.rScale(_.off1Position.y),
		_r: props.GDScale(_.off1.GD_premut),
		cx: padding + (width.value - padding * 2) * props.xScale(_.off1Position.x),
	};
	o2 = _.off2Position
		? {
				r: props.rScale(_.off2Position.y),
				_r: props.GDScale(_.off2.GD_premut),
				cx: padding + (width.value - padding * 2) * props.xScale(_.off2Position.x),
		  }
		: null;
};
onMounted(() => {
	initWidth();
	initData();
	ready.value = true;
});
</script>
<style scoped>
@keyframes blink {
	0% { opacity: 0; }
	50% { opacity: 1; }
	100% { opacity: 0; }
}

.crossover-blink {
	animation: blink 1.5s infinite;
}
</style>
<template>
	<div
		class="bg-indigo-50 w-full"
		ref="barRef">
		<svg
			width="100%"
			height="40px"
			class="bg-indigo-50"
			preserve-aspect-ratio="XMidYMid">
			<defs>
				<radialGradient id="halo">
					<stop
						offset="0%"
						stop-color="#decbe4"
						stop-opacity="1" />
					<stop
						offset="100%"
						stop-color="#decbe4"
						stop-opacity="0.35" />
				</radialGradient>
			</defs>
			<g v-if="ready">
				<!-- line between p1 and p2 -->
				<rect
					:width="p2.cx - p1.cx"
					fill="#31a354"
					stroke-width="0.5"
					opacity="0.35"
					stroke="none"
					height="2"
					:x="p1.cx + offset"
					y="18.5" />

				<!-- p1 -->
				<circle
					:class="selected.has(data.p1.IID) ? 'crossover-blink' : null"
					:r="p1.r"
					:cx="p1.cx + offset"
					cy="20"
					stroke="grey"
					storke-width="0.5"
					fill="#ecfccb" />
				<circle
					:r="p1._r"
					:cx="p1.cx + offset"
					cy="20"
					stroke="green"
					stroke-width="1"
					stroke-dasharray="1,1"
					fill="none" />

				<!-- p2 -->
				<circle
					:class="selected.has(data.p2.IID) ? 'crossover-blink' : null"
					:r="p2.r"
					:cx="p2.cx + offset"
					cy="20"
					stroke="grey"
					storke-width="0.5"
					fill="#ecfccb" />
				<circle
					:r="p2._r"
					:cx="p2.cx + offset"
					cy="20"
					stroke="green"
					stroke-width="1"
					stroke-dasharray="1,1"
					fill="none" />

				<!-- off1 -->
				<circle
					:class="selected.has(data.off1.IID) ? 'crossover-blink' : null"
					:r="o1.r"
					:cx="o1.cx + offset"
					cy="20"
					fill="url(#halo)" />
				<circle
					:r="1"
					:cx="o1.cx + offset"
					cy="20"
					fill="#0000007a" />
				<circle
					:r="o1._r"
					:cx="o1.cx + offset"
					cy="20"
					stroke="#e78ac3"
					stroke-width="1"
					stroke-dasharray="1,1"
					fill="none" />

				<!-- off2 -->
				<circle
					v-if="data.off2"
					:class="selected.has(data.off2.IID) ? 'crossover-blink' : null"
					:r="o2.r"
					:cx="o2.cx + offset"
					cy="20"
					fill="url(#halo)" />
				<circle
					v-if="data.off2"
					:r="1"
					:cx="o2.cx + offset"
					cy="20"
					fill="#0000007a" />
				<circle
					v-if="data.off2"
					:r="o2._r"
					:cx="o2.cx + offset"
					cy="20"
					stroke="#e78ac3"
					stroke-width="1"
					stroke-dasharray="1,1"
					fill="none" />
			</g>
		</svg>
	</div>
</template>
