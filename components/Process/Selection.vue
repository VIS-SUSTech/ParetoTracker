<script setup>
const props = defineProps(['position']);
const { dataDictionary } = storeToRefs(useData());
const { selected } = storeToRefs(useProcess());
const id_rank = ref(new Map());
const id_arr = ref(new Map());
const id_show = ref({});
const id_collapse = ref({});
const genData = ref([]);
const genNum = ref();
const ready = ref(false);
const maxPopulationCnt = ref(0);
async function initGroups() {
	genNum.value = props.position[1];
	genData.value = Object.values(dataDictionary.value[genNum.value]);

	// initialization
	genData.value.forEach((ind) => {
		id_rank.value.set(ind.Group, ind.GroupRank);
		id_arr.value.set(ind.Group, []);
		id_collapse.value[ind.Group] = true;
		id_show.value[ind.Group] = true;
	});

	// add ind to arr
	genData.value.forEach((ind) => {
		id_arr.value.get(ind.Group).push(ind);
	});

	// sort by fitness in group
	id_arr.value.forEach((arr, key) => {
		if (key !== null)
			arr.sort((a, b) => {
				if (a.Fitness === 'Inf' && b.Fitness === 'Inf') return 0;
				else if (a.Fitness === 'Inf') return -1;
				else if (b.Fitness === 'Inf') return 1;
				else return -a.Fitness + b.Fitness;
			});
	});

	maxPopulationCnt.value = d3.max(
		[...id_arr.value.values()].map((e) => e.length),
	);
}
onMounted(async () => {
	await initGroups();
	ready.value = true;
});

function compare(a, b) {
	if (a === b) {
		return 0;
	} else if (a === null) {
		return 1;
	} else if (b === null) {
		return -1;
	} else {
		return -id_rank.value.get(b) + id_rank.value.get(a);
	}
}
</script>
<style scoped></style>
<template>
	<div class="border-zinc-400 rounded-md border-2 h-full flex flex-col">
		<!-- title bar -->
		<div
			class="bg-slate-200 border-zinc-400 border-b-2 w-full h-8 flex-shrink-0 p-2 pr-3 flex justify-start items-center gap-2">
			<!-- title txt -->
			<div class="text-xl flex-shrink-0">Environmental Selection</div>
			<!-- btns -->
			<div class="flex-grow flex items-center gap-1">
				<div
					class="h-full flex-shrink-0 border-[#a1a1aac7] border-[0px] flex justify-center items-center text-xs rounded p-[1px]">
					(Survived / Total)
				</div>

				<div
					class="ml-auto h-full flex-shrink-0 flex justify-center items-center text-xs rounded p-[2px] bg-[rgba(120,198,121,0.7)] border-zinc-400 border-[1px]">
					Ranked Groups
				</div>
			</div>
		</div>
		<!-- body -->
		<div class="w-[570px] bg-slate-50 flex-grow overflow-hidden flex">
			<!-- left list -->
			<div class="flex-grow h-full border-zinc-400 border-r-2 border-dashed">
				<n-scrollbar class="w-full h-full">
					<div
						v-if="ready"
						ref="selectionBox"
						class="w-full flex flex-col p-1 pr-3 gap-1">
						<div
							v-for="(id, index) in [...id_rank.keys()].sort(compare)"
							class="border-zinc-400 border-2 rounded-md bg-indigo-50 w-full transition-all delay-200 ease-in-out order-1 flex items-center flex-wrap">
							<div
								class="w-full h-6 flex p-1 border-zinc-400 border-b-[1px] items-center"
								:style="{
									backgroundColor: id !== null ? groupColorArr(id_rank.get(id)) : 'lightgrey',
								}">
								<div @click="id_collapse[id] = !id_collapse[id]">Group {{ index + 1 }}</div>
								<div class="flex-grow flex items-center gap-1">
									<div
										class="ml-auto h-full flex-shrink-0 border-[#a1a1aac7] border-[1px] flex justify-center items-center text-xs rounded p-[1px]">
										{{ id_arr.get(id).filter((ind) => ind.Alive).length }} /
										{{ id_arr.get(id).length }}
									</div>
									<n-switch
										class=""
										v-model:value="id_show[id]"
										size="small">
									</n-switch>
								</div>
							</div>
							<!-- bar -->
							<div class="w-full h-6 flex">
								<SelectionBar
									class="flex-grow"
									:maxLength="maxPopulationCnt"
									:group="id_arr.get(id)"></SelectionBar>
							</div>
							<div
								class="w-full border-zinc-400 transition-all overflow-hidden"
								:class="[
									id_collapse[id] ? 'h-0 border-0 overflow-hidden' : 'h-72 border-t-[1px]',
								]">
								<n-scrollbar class="w-full h-full">
									<div class="w-full flex p-1 pr-3 gap-1 flex-wrap bg-slate-200">
										<div
											v-for="ind in id_arr.get(id)"
											@click="useProcess().sel(ind.IID)"
											class="border-2 rounded-md w-[44px] flex flex-col justify-center items-center relative"
											:style="{
												backgroundColor: colorMap()[ind.Type],
												opacity: selected.has(ind.IID) ? 1 : 0.75,
												boxShadow: selected.has(ind.IID) ? '0 0 1px 1px #94a3b8' : 'none',
											}"
											:class="[selected.has(ind.IID) ? 'border-zinc-600' : 'border-zinc-400']">
											<svg
												v-if="!ind.Alive"
												opacity="0.75"
												width="40px"
												height="100%"
												class="absolute top-0 left-0 z-1088">
												<defs>
													<pattern
														id="rectPattern"
														view-box="0 0 10 10"
														width="10"
														height="10"
														patternUnits="userSpaceOnUse">
														<g
															stroke-width="1"
															stroke="black">
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
												<rect
													x="0"
													y="0"
													width="100%"
													height="100%"
													fill="url(#rectPattern)" />
											</svg>
											<div
												class="w-full h-4 z-1099 relative flex justify-center items-center text-xs flex-shrink-0 opacity-100">
												{{ ind.IID }}
											</div>
											<div
												v-if="ind.Fitness"
												class="w-full z-1099 relative flex justify-center items-center border-zinc-400 border-t-[1px] border-dashed text-[8px]">
												{{ ind.Fitness === 'Inf' ? 'Inf' : ind.Fitness.toFixed(4) }}
											</div>
										</div>
									</div>
								</n-scrollbar>
							</div>
						</div>
					</div>
				</n-scrollbar>
			</div>
			<!-- right scatter -->
			<div
				class="w-[340px] h-full flex-shink-0 flex flex-col justify-evenly items-center flex-shrink-0">
				<div class="w-[320px] h-[320px] bg-white border-zinc-400 rounded-md border-2">
					<SelectionScatter
						v-if="ready"
						:if-obj="true"
						:gen-num="genNum"
						:id_arr="id_arr"
						:id_rank="id_rank"
						:id_show="id_show"></SelectionScatter>
				</div>
				<div class="w-[320px] h-[320px] bg-white border-zinc-400 rounded-md border-2">
					<SelectionScatter
						v-if="ready"
						:if-obj="false"
						:gen-num="genNum"
						:id_arr="id_arr"
						:id_rank="id_rank"
						:id_show="id_show"></SelectionScatter>
				</div>
			</div>
		</div>
	</div>
</template>
