<script setup>
const bar = ref();
const props = defineProps(['group', 'maxLength']);
const width = ref();
const barData = ref();
const barDataReady = ref(false);
const typeColor = {
	initialization: '#fbb4ae',
	reserved: '#b3cde3',
	mating: '#ccebc5',
	crossover: '#decbe4',
	mutation: '#fed9a6',
};
const getLen = (data, type) => {
	return {
		['alive']:
			(data.filter((ind) => ind.Type === type && ind.Alive).length / data.length) *
			width.value,
		['dead']:
			(data.filter((ind) => ind.Type === type && !ind.Alive).length / data.length) *
			width.value,
	};
};
function getRowData(data) {
	let rowRectData = [];
	let x = 0;
	Object.keys(typeColor).forEach((type) => {
		const lenDict = getLen(data, type);
		rowRectData.push({
			type: type,
			x: x,
			width: lenDict.alive,
			fill: typeColor[type],
			alive: true,
		});
		x += lenDict.alive;
		rowRectData.push({
			type: type,
			x: x,
			width: lenDict.dead,
			fill: typeColor[type],
			alive: false,
		});
		x += lenDict.dead;
	});
	return rowRectData;
}
onMounted(() => {
	width.value = bar.value.clientWidth * (props.group.length / props.maxLength);
	barData.value = getRowData(props.group);
	barDataReady.value = true;
});
</script>
<style scoped></style>
<template>
	<div
		class="w-full h-full"
		ref="bar">
		<svg
			v-if="barDataReady"
			:width="width"
			height="100%"
			class="bg-indigo-200">
			<defs>
				<pattern
					id="rectPattern"
					view-box="0 0 10 10"
					width="10"
					height="10"
					patternUnits="userSpaceOnUse">
					<g
						stroke-width="1"
						stroke="grey">
						<line
							x1="4"
							y1="0"
							x2="0"
							y2="4" />
						<line
							x1="8"
							y1="0"
							x2="0"
							y2="8" />
						<line
							x1="10"
							y1="4"
							x2="4"
							y2="10" />
						<line
							x1="10"
							y1="8"
							x2="8"
							y2="10" />
					</g>
				</pattern>
			</defs>
			<!-- alive  -->
			<rect
				v-for="r in barData"
				:x="r.x"
				:width="r.width"
				height="100%"
				:fill="r.fill"></rect>
			<!-- dead -->
			<rect
				v-for="r in barData.filter((rect) => !rect.alive)"
				:x="r.x"
				:width="r.width"
				height="100%"
				fill="url(#rectPattern)" />
		</svg>
	</div>
</template>
