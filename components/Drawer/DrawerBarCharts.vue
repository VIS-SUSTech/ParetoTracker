<script setup>
const props = defineProps(['showBar']);
const { dataDictionary, dataReady } = storeToRefs(useData());
const { range } = storeToRefs(useEvent());

const bar = ref();
const width = ref();
const barDataArr = ref([]);
const ready = ref(false);

const maxLength = ref(0);
const getLen = (data, type, totalLength) => {
	return {
		['alive']:
			(data.filter((ind) => ind.Type === type && ind.Alive).length / data.length) *
			totalLength,
		['dead']:
			(data.filter((ind) => ind.Type === type && !ind.Alive).length / data.length) *
			totalLength,
	};
};
function getRowData(data) {
	let len = (width.value * data.length) / maxLength.value;
	let rowRectData = [];
	let x = 0;
	Object.keys(colorMap()).forEach((type) => {
		const lenDict = getLen(data, type, len);
		rowRectData.push({
			type: type,
			x: x,
			width: lenDict.alive,
			cnt: data.filter((ind) => ind.Type === type && ind.Alive).length,
			total: data.length,
			fill: colorMap()[type],
			alive: true,
		});
		x += lenDict.alive;
		rowRectData.push({
			type: type,
			x: x,
			width: lenDict.dead,
			cnt: data.filter((ind) => ind.Type === type && !ind.Alive).length,
			total: data.length,
			fill: colorMap()[type],
			alive: false,
		});
		x += lenDict.dead;
	});
	return rowRectData;
}
onMounted(() => {
	width.value = 517;
	Object.values(dataDictionary.value).forEach((genData) => {
		let len = Object.values(genData).length;
		if (len >= maxLength.value) maxLength.value = len;
	});
	Object.values(dataDictionary.value).forEach((genData) => {
		barDataArr.value.push(getRowData(Object.values(genData)));
	});
	ready.value = true;
});
</script>
<style scoped></style>
<template>
	<div
		class="border-zinc-400 border-t-2 pl-2 pr-2 w-full flex flex-col justify-center pb-1">
		<div class="h-8 flex items-center">
			<div>Stacked Bar of Generations</div>
			<n-button
				size="tiny"
				type="tertiary"
				tertiary
				strong
				@click="$emit('act', 2)"
				class="ml-auto w-14">
				{{ showBar ? 'collapse' : 'expand' }}
			</n-button>
		</div>
		<div
			class="w-full rounded transition-all delay-200 ease-in-out overflow-hidden"
			:class="{ 'h-[580px]': showBar, 'h-0': !showBar }">
			<n-scrollbar
				id="bar-container"
				class="w-full h-full">
				<div
					ref="bar"
					v-if="dataReady"
					class="w-full h-full pr-3 gap-1 flex flex-col">
					<div
						v-if="ready"
						v-for="(barData, i) in barDataArr"
						:id="`bar${i}`"
						class="w-full h-[44px] border-zinc-400 rounded-md border-2 flex items-center">
						<div
							@click="useEvent().updateRange(i + 1 - 3, i + 1 + 3)"
							class="w-12 h-full border-zinc-400 border-r-2 text-lg flex justify-center items-center flex-shrink-0"
							:class="[
								range[0] <= i + 1 && i + 1 <= range[1] ? ' bg-indigo-200 ' : 'bg-stone-50',
							]">
							{{ i + 1 }}
						</div>

						<div class="flex-grow h-full">
							<svg
								:width="width"
								height="100%">
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
									@mouseover="useEvent().mouseOver('bar', r)"
									@mousemove="useEvent().mouseMove()"
									@mouseout="useEvent().mouseOut()"
									:x="r.x"
									:width="r.width"
									height="100%"
									:fill="r.fill"></rect>
								<!-- dead -->
								<rect
									v-for="r in barData.filter((rect) => !rect.alive)"
									@mouseover="useEvent().mouseOver('bar', r)"
									@mousemove="useEvent().mouseMove()"
									@mouseout="useEvent().mouseOut()"
									:x="r.x"
									:width="r.width"
									height="100%"
									fill="url(#rectPattern)" />
							</svg>
						</div>

						<div
							class="w-8 h-full border-zinc-400 border-l-2 text-sm flex justify-center items-center flex-shrink-0 bg-stone-100">
							{{ Object.keys(dataDictionary[i + 1]).length }}
						</div>
					</div>
				</div>
			</n-scrollbar>
		</div>
	</div>
</template>
