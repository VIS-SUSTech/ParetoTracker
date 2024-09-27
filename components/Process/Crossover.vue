<script setup>
const { selected } = storeToRefs(useProcess());
const { dataDictionary, rScaleByGDInside } = storeToRefs(useData());
const props = defineProps(['position']);
const genNum = ref(1);
const genData = ref([]);
const pairs = ref([]);
const GDScale = ref();
function initData() {
	genNum.value = props.position[1];
	genData.value = Object.values(dataDictionary.value[props.position[1]]);
	GDScale.value = (gd) => d3
		.scaleLinear()
		.domain(
			d3.extent(
				genData.value.flatMap((d) =>
					[d.GD, d.GD_premut].map((d) => Math.pow(d > 30 ? 30 : d, 0.3)),
				),
			),
		)
		.range([6.5, 16])(Math.pow(gd > 30 ? 30 : gd, 0.3));
}

function initPairs() {
	let parentMap = new Map();
	let offspringMap = new Map();
	genData.value.forEach((ind) => {
		if (ind.Type === 'mating') {
			parentMap.set(ind.IID, ind);
		} else if (ind.Type === 'crossover' || ind.Type === 'mutation') {
			offspringMap.set(ind.IID, ind);
		}
	});
	const resultArr = [];
	const findParentMap = new Map();
	offspringMap.forEach((ind, i) => {
		const parentsStr = ind.Parents.toString();
		// first child
		if (!findParentMap.has(parentsStr)) {
			findParentMap.set(parentsStr, ind);
		}
		// second child
		else {
			const brother = findParentMap.get(parentsStr);
			const p1 = parentMap.get(+parentsStr.split(',')[0]);
			const p2 = parentMap.get(+parentsStr.split(',')[1]);
			resultArr.push({
				p1: p1,
				p2: p2,
				off1: brother,
				off2: ind,
			});
			findParentMap.delete(parentsStr);
		}
	});
	findParentMap.forEach((ind, i) => {
		const parentsStr = ind.Parents.toString();
		const p1 = parentMap.get(+parentsStr.split(',')[0]);
		const p2 = parentMap.get(+parentsStr.split(',')[1]);
		resultArr.push({
			key: i,
			p1: p1,
			p2: p2,
			off1: ind,
		});
	});
	pairs.value = resultArr;
}

function getPairsAttr() {
	pairs.value.forEach((pair) => {
		pair.parentsDistance = getDist(pair.p1.X, pair.p2.X);
		pair.offspringDistance = Math.min(
			getDist(pair.off1.X_premut, pair.p1.X),
			getDist(pair.off1.X_premut, pair.p2.X),
		);
		pair.off1Position = getPosition(pair.off1.X_premut, pair.p1.X, pair.p2.X);
		if (pair.off2) {
			const offDistToP1 = Math.min(
				getDist(pair.off1.X_premut, pair.p1.X),
				getDist(pair.off2.X_premut, pair.p1.X),
			);
			const offDistToP2 = Math.min(
				getDist(pair.off1.X_premut, pair.p2.X),
				getDist(pair.off2.X_premut, pair.p2.X),
			);
			pair.offspringDistance = (offDistToP1 + offDistToP2) / 2;
			pair.off2Position = getPosition(pair.off2.X_premut, pair.p1.X, pair.p2.X);
		}
	});
}
const flag = ref(false);
async function sort(mode) {
	flag.value = false;
	if (mode == 0) {
		pairs.value.sort((a, b) => b.parentsDistance - a.parentsDistance);
	} else {
		pairs.value.sort((a, b) => b.offspringDistance - a.offspringDistance);
	}
	await nextTick();
	flag.value = true;
}

const xScale = ref();
const rScale = ref();
function getScales() {
	const allX = [];
	pairs.value.forEach((pair) => {
		const parentDist = pair.parentsDistance;
		let max = parentDist;
		let x1 = pair.off1Position.x;
		let x2 = pair.off2Position?.x;
		if (x1 > parentDist && x1 - parentDist / 2 > max / 2) {
			max = 2 * x1 - parentDist;
		} else if (x2 && x2 > parentDist && x2 - parentDist / 2 > max / 2) {
			max = 2 * x2 - parentDist;
		}
		allX.push(max);
	});
	xScale.value = d3
		.scaleLinear()
		.domain([0, d3.max(allX)])
		.range([0, 1]);
	const allY = pairs.value.flatMap((pair) =>
		pair.off2 ? [pair.off1Position.y, pair.off2Position.y] : [pair.off1Position.y],
	);
	rScale.value = d3
		.scaleLinear()
		.domain([0, d3.max(allY)])
		.range([4, 20]);
}

onMounted(() => {
	initData();
	initPairs();
	getPairsAttr();
	getScales();
	flag.value = true;
});

const { showAllPair } = storeToRefs(useProcess());
</script>
<style scoped></style>
<template>
	<div class="border-zinc-400 rounded-md border-2 h-full flex flex-col">
		<!-- title bar -->
		<div
			class="bg-slate-200 border-zinc-400 border-b-2 w-full h-8 flex-shrink-0 p-2 pr-3 flex justify-start items-center">
			<!-- title txt -->
			<div class="text-xl flex-shrink-0">Mating & Crossover</div>
			<!-- btns -->
			<div class="flex-grow flex items-center gap-1">
				<n-switch
					class="ml-auto"
					v-model:value="showAllPair"
					size="small">
				</n-switch>
				<n-button
					class=""
					@click="sort(0)"
					size="tiny"
					type="tertiary"
					tertiary
					strong>
					sort by parent distance
				</n-button>
				<n-button
					@click="sort(1)"
					size="tiny"
					type="tertiary"
					tertiary
					strong>
					sort by crossover distance
				</n-button>
			</div>
		</div>
		<!-- body -->
		<div class="w-[720px] bg-slate-50 flex-grow overflow-hidden flex">
			<!-- left scatter -->
			<div
				class="w-[340px] h-full flex flex-col justify-evenly items-center flex-shrink-0 border-zinc-400 border-r-2 border-dashed">
				<div class="w-[320px] h-[320px] bg-white border-zinc-400 rounded-md border-2">
					<CrossoverScatter
						v-if="pairs.length > 0"
						:if-obj="true"
						:gen-num="genNum"
						:pairs="pairs"></CrossoverScatter>
				</div>
				<div class="w-[320px] h-[320px] bg-white border-zinc-400 rounded-md border-2">
					<CrossoverScatter
						v-if="pairs.length > 0"
						:if-obj="false"
						:gen-num="genNum"
						:pairs="pairs"></CrossoverScatter>
				</div>
			</div>
			<!-- right list -->
			<div class="flex-grow h-full">
				<n-scrollbar class="w-full h-full">
					<div
						ref="crossoverBox"
						class="w-full p-1 pr-3 gap-1 flex flex-col">
						<div
							v-for="pair in pairs"
							:key="pair.key"
							class="w-full h-[44px] border-zinc-400 rounded-md border-2 bg-indigo-50 flex items-center flex-shrink-0">
							<div class="w-16 h-full border-zinc-400 border-r-2 flex-shrink-0 flex flex-col">
								<div
									@click="useProcess().sel(pair.p1.IID)"
									class="h-1/2 w-full border-zinc-400 border-b-[1px] flex justify-center items-center text-xs"
									:class="[selected.has(pair.p1.IID) ? 'bg-[#78c966]' : 'bg-[#ccebc5]']">
									{{ pair.p1.IID }}
								</div>
								<div
									@click="useProcess().sel(pair.p2.IID)"
									class="h-1/2 w-full border-zinc-400 border-t-[1px] flex justify-center items-center text-xs"
									:class="[selected.has(pair.p2.IID) ? 'bg-[#78c966]' : 'bg-[#ccebc5]']">
									{{ pair.p2.IID }}
								</div>
							</div>
							<div
								class="h-full flex-grow"
								:key="pair.key"
								:class="[pair.key]">
								<CrossoverBar
									v-if="flag"
									:id="`${pair.p1.IID}_${pair.p2.IID}_${pair.off1.IID}${
										pair.off2 ? '_' + pair.off2.IID : ''
									}`"
									:data="pair"
									:x-scale="xScale"
									:r-scale="GDScale"
									:selected="selected"
									:-g-d-scale="rScaleByGDInside">
								</CrossoverBar>
							</div>
							<div class="w-16 h-full border-zinc-400 border-l-2 flex-shrink-0 flex flex-col">
								<div
									@click="useProcess().sel(pair.off1.IID)"
									class="h-1/2 w-full border-zinc-400 border-b-[1px] flex justify-center items-center text-xs"
									:class="[selected.has(pair.off1.IID) ? 'bg-[#d194e4]' : 'bg-[#decbe4]']">
									{{ pair.off1.IID }}
								</div>
								<div
									v-if="pair.off2"
									@click="useProcess().sel(pair.off2.IID)"
									class="h-1/2 w-full border-zinc-400 border-t-[1px] flex justify-center items-center text-xs"
									:class="[selected.has(pair.off2.IID) ? 'bg-[#d194e4]' : 'bg-[#decbe4]']">
									{{ pair.off2.IID }}
								</div>
							</div>
						</div>
					</div>
				</n-scrollbar>
			</div>
		</div>
	</div>
</template>
