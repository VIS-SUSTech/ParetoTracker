<script setup>
const { dataDictionary, rScaleByGDInside } = storeToRefs(useData());
const props = defineProps(['position']);
const ready = ref(false);
const genNum = ref(1);
const genData = ref([]);
const inds = ref([]);
const width = ref();
const xScale = ref();
const rScale = ref();
const mutationBox = ref();
const maxMutationArr = ref([]);

function getMutationValue(ind) {
	return ind.X.map((x, i) => {
		let res = 0;
		let pre = ind.X_premut[i];
		if (pre !== 0) res = Math.abs(pre - x);
		return res;
	});
}

function initData() {
	width.value = (mutationBox.value.clientWidth - 48) / 2;
	genNum.value = props.position[1];
	genData.value = Object.values(dataDictionary.value[genNum.value]);
	inds.value = genData.value
		.filter((ind) => ind.Type === 'mutation')
		.map((ind, i) => {
			return {
				key: i,
				ind: ind,
				diff: getMutationValue(ind),
				mutationDist: getDist(ind.X, ind.X_premut),
			};
		});

	genData.value[0].X.forEach((x, i) => {
		let maxDiff = 0;
		inds.value.forEach((ind) => {
			if (ind.diff[i] >= maxDiff) maxDiff = ind.diff[i];
		});
		maxMutationArr.value.push(maxDiff);
	});

	inds.value.forEach((e) => {
		e.diff = e.diff.map((diff, i) => {
			let pointNum = (diff / maxMutationArr.value[i]).toFixed(6) * 100;
			return pointNum;
		});
	});

	xScale.value = d3
		.scaleLinear()
		.domain([0, d3.max(inds.value.map((e) => e.mutationDist))])
		.range([0, width.value - 20 - 4 - 36]);

	rScale.value = (gd) => d3
		.scaleLinear()
		.domain(
			d3.extent(
				genData.value.flatMap((d) => [d.GD, d.GD_premut].map((d) => Math.pow(d > 30 ? 30 : d, 0.3))),
			),
		)
		.range([6.5, 16])(Math.pow(gd > 30 ? 30 : gd, 0.3));

	ready.value = true;
}

function sortByDistance(index) {
	if (index == null) {
		inds.value.sort((a, b) => -a.mutationDist + b.mutationDist);
	} else {
		inds.value.sort((a, b) => -a.diff[index] + b.diff[index]);
	}
}

onMounted(() => {
	setTimeout(initData, 500);
});

const { showAllMutation } = storeToRefs(useProcess());

watch(showAllMutation, () => {});
</script>
<style scoped></style>
<template>
	<div class="border-zinc-400 rounded-md border-2 h-full flex flex-col">
		<!-- title bar -->
		<div
			class="bg-slate-200 border-zinc-400 border-b-2 h-8 flex-shrink-0 pl-2 pr-3 flex justify-start items-center gap-1 w-[720px]">
			<!-- title txt -->
			<div class="text-xl flex-shrink-0">Mutation</div>
			<!-- btns -->
			<div
				class="flex items-center flex-shrink-0 flex-grow overflow-hidden h-full justify-end gap-1">
				<n-switch
					class="ml-auto"
					v-model:value="showAllMutation"
					size="small">
				</n-switch>
				<n-button
					@click="sortByDistance(null)"
					size="tiny"
					type="tertiary"
					tertiary
					strong>
					sort by mutation distance
				</n-button>

				<n-button
					class="pointer-none"
					size="tiny"
					type="tertiary"
					tertiary
					strong>
					Sort by Decision Variables:
				</n-button>

				<n-button
					v-if="ready"
					v-for="(e, i) in genData[0].X"
					@click="sortByDistance(i)"
					size="tiny"
					type="tertiary"
					tertiary
					strong>
					{{ i + 1 }}
				</n-button>
			</div>
		</div>
		<!-- body -->
		<div class="w-[720px] bg-slate-50 flex-grow overflow-hidden flex">
			<!-- left list -->
			<div class="flex-grow h-full border-zinc-400 border-r-2 border-dashed">
				<n-scrollbar class="w-full h-full">
					<div
						ref="mutationBox"
						class="w-full flex flex-col p-1 pr-3 gap-1">
						<MutationBar
							v-if="ready"
							v-for="ind in inds"
							:data="ind"
							:width="width"
							:xScale="xScale"
							:rScale="rScale">
						</MutationBar>
					</div>
				</n-scrollbar>
			</div>
			<!-- right scatter -->
			<div
				class="w-[340px] h-full flex-shink-0 flex flex-col justify-evenly items-center flex-shrink-0">
				<div class="w-[320px] h-[320px] bg-white border-zinc-400 rounded-md border-2">
					<MutationScatter
						v-if="ready"
						:if-obj="true"
						:gen-num="genNum"></MutationScatter>
				</div>
				<div class="w-[320px] h-[320px] bg-white border-zinc-400 rounded-md border-2">
					<MutationScatter
						v-if="ready"
						:if-obj="false"
						:gen-num="genNum"></MutationScatter>
				</div>
			</div>
		</div>
	</div>
</template>
