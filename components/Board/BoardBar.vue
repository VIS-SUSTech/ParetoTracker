<script setup>
const { individuals, dataDictionary } = storeToRefs(useData());
const { roots, trees, minGenCross } = storeToRefs(useTree());
const svg = ref();
const width = ref();
const height = ref();
const padding = 25;
const xScale = ref();
const arrLength = ref();
const lifeMap = ref(new Map());
const r = ref(7);

const lines = ref([]);
const ready = ref(false);

function updateSvg() {
	initAxis();
	setTimeout(() => {
		initLines();
	}, 300);
}

function initAxis() {
	width.value = svg.value.clientWidth;
	height.value = svg.value.clientHeight;
	arrLength.value = [...Object.keys(dataDictionary.value)].length;

	let genNums = [];

	[...trees.value.keys()].forEach((uid) => {
		let life = useTree().getLife(uid);
		lifeMap.value.set(uid, life);
		genNums.push(life);
	});

	genNums.push([...minGenCross.value.values()].flatMap((e) => [...e.values()]));

	let domain = d3.extent(genNums.flatMap((e) => e));

	xScale.value = d3
		.scaleLinear()
		.domain(domain)
		.range([padding, width.value - padding * 2]);

	let xAxis = d3.axisTop(xScale.value);
	d3.select('#svg svg').selectAll('*').remove();

	d3
		.select('#svg svg')
		.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0, 40 )')
		.call(xAxis);

	ready.value = true;
}

function initLines() {
	if (trees.value.size >= 2) {
		lines.value = [];
		let uids = [...trees.value.keys()];
		uids.forEach((uid1, i) => {
			uids.forEach((uid2, j) => {
				if (i > j) {
					let minGen = minGenCross.value.get(uid1).get(uid2);
					let x1 = xScale.value(minGen);
					let y1 = +d3.select(`.r${uid1}`).attr('y1');
					let x2 = xScale.value(minGen);
					let y2 = +d3.select(`.r${uid2}`).attr('y2');
					let distance =
						Math.abs(
							d3.select(`.r${uid1}`).attr('id').replace('r', '') -
								d3.select(`.r${uid2}`).attr('id').replace('r', '') -
								1,
						) * 2;

					lines.value.push({
						x1,
						y1,
						x2,
						y2,
						path: getCrossPath(x1, y1, x2, y2, distance),
					});
				}
			});
		});
	}
}

onMounted(() => {
	updateSvg();
});

watch(roots, () => {
	updateSvg();
});
</script>
<style scoped></style>
<template>
	<div class="w-full h-full flex gap-1">
		<div class="flex-grow h-full border-zinc-400 rounded border-2">
			<svg
				id="svg"
				ref="svg"
				width="100%"
				height="100%">
				<svg
					x="0"
					y="4"
					width="100%"
					height="64"
					fill="none"></svg>

				<g
					v-for="line in lines"
					class="lines">
					<circle
						stroke="grey"
						stroke-width="1"
						:r="2.5"
						:cx="line.x1"
						:cy="line.y1"
						:opacity="0.5"></circle>
					<path
						:d="line.path"
						fill="none"
						stroke="grey"
						stroke-width="2"
						stroke-dasharray="1,2"></path>
					<circle
						stroke="grey"
						stroke-width="1"
						:r="2.5"
						:cx="line.x2"
						:cy="line.y2"
						:opacity="0.5"></circle>
				</g>

				<g
					v-for="(uid, index) in roots"
					v-if="ready">
					<line
						:id="`r${index}`"
						:class="`r${uid}`"
						:x1="padding"
						:x2="width - padding * 2"
						:y1="64 * (index + 1) + 32"
						:y2="64 * (index + 1) + 32"
						stroke="grey"
						stroke-width="1.5"
						stroke-dasharray="6,2"></line>

					<circle
						@mouseover="
							useEvent().mouseOver(
								'ind-board',
								dataDictionary[useTree().getLife(uid)[0]][uid.split('_')[1]],
							)
						"
						@mousemove="useEvent().mouseMove()"
						@mouseout="useEvent().mouseOut()"
						stroke="grey"
						stroke-width="1"
						stroke-dasharray="1,3"
						class="start"
						:r="r"
						:cx="xScale(useTree().getLife(uid)[0])"
						:cy="64 * (index + 1) + 32"
						:opacity="0.5"
						:fill="colorArr()[index]"></circle>

					<circle
						@mouseover="
							useEvent().mouseOver(
								'ind-board',
								dataDictionary[uid.split('_')[0]][uid.split('_')[1]],
							)
						"
						@mousemove="useEvent().mouseMove()"
						@mouseout="useEvent().mouseOut()"
						stroke="grey"
						stroke-width="1"
						class="curr"
						:r="r"
						:cx="xScale(uid.split('_')[0])"
						:cy="64 * (index + 1) + 32"
						:fill="colorArr()[index]"></circle>

					<path
						@mouseover="
							useEvent().mouseOver(
								'ind-board',
								dataDictionary[useTree().getLife(uid)[1]][uid.split('_')[1]],
							)
						"
						@mousemove="useEvent().mouseMove()"
						@mouseout="useEvent().mouseOut()"
						class="end cursor-pointer"
						stroke="grey"
						stroke-width="1"
						:d="d3.symbol().type(d3.symbolCross).size(120)()"
						:transform="`translate(${xScale(useTree().getLife(uid)[1])}, ${
							64 * (index + 1) + 32
						}) rotate(45)`"
						:fill="colorArr()[index]"></path>
				</g>
			</svg>
		</div>
		<div
			class="w-44 h-full border-zinc-400 rounded border-2 flex-shrink-0 flex flex-col gap-1 p-1 items-center">
			<div
				class="h-[60px] w-40 border-zinc-400 rounded border-2 flex items-center p-1 gap-1">
				<div class="w-6 h-full border-zinc-400 rounded border-[1px]"></div>
				<div class="w-32 h-full border-zinc-400 rounded border-[1px] flex flex-col">
					<div
						class="w-full h-1/2 border-zinc-400 border-b-[1px] flex justify-center items-center text-xs bg-stone-100">
						Generation
					</div>
					<div
						class="w-full h-1/2 border-zinc-400 border-t-[1px] flex justify-center items-center text-xs">
						ID
					</div>
				</div>
			</div>
			<div
				v-for="(uid, index) in roots"
				class="h-[60px] w-40 border-zinc-400 rounded border-2 flex items-center p-1 gap-1">
				<div
					class="w-6 h-full border-zinc-400 rounded border-[1px]"
					:style="{ backgroundColor: colorArr()[index] }"></div>
				<div class="w-16 h-full border-zinc-400 rounded border-[1px] flex flex-col">
					<div
						class="w-full h-1/2 border-zinc-400 border-b-[1px] flex justify-center items-center text-xs bg-stone-100">
						{{ uid.split('_')[0] }}
					</div>
					<div
						:style="{ backgroundColor: colorMap()[individuals.get(uid).Type] }"
						class="w-full h-1/2 border-zinc-400 border-t-[1px] flex justify-center items-center text-xs">
						{{ uid.split('_')[1] }}
					</div>
				</div>

				<div class="w-16 h-full border-zinc-400 rounded border-[1px] flex flex-col">
					<div
						class="w-full h-1/2 border-zinc-400 border-b-[1px] flex justify-center items-center text-xs bg-stone-100">
						<n-button
							class="w-full"
							size="tiny"
							type="tertiary"
							tertiary
							strong>
							hide
						</n-button>
					</div>
					<div
						class="w-full h-1/2 border-zinc-400 border-t-[1px] flex justify-center items-center text-xs">
						<n-button
							class="w-full"
							@click="useTree().delTree(uid)"
							size="tiny"
							type="tertiary"
							tertiary
							strong>
							delete
						</n-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
