<script setup>
const { r, rMethod, typeFilter, pathOption, showPF } = storeToRefs(useEvent());

function act(type) {
	typeFilter.value[type] = !typeFilter.value[type];
}
</script>
<style scoped>
.item {
	@apply border-zinc-400 rounded border-[1px] flex items-center p-1 gap-2;
}
</style>
<template>
	<div class="absolute bottom-1 left-1 border-zinc-400 rounded border-2 z-20">
		<div class="bg-slate-100 h-10 flex items-center p-2 gap-2">
			<div
				class="item"
				v-for="(val, key) in typeFilter"
				@click="act(key)"
				:class="[val ? 'bg-slate-100' : 'bg-gray-300']">
				<div
					v-if="key !== 'dead'"
					:style="{ backgroundColor: colorMap()[key] }"
					class="w-5 h-5 rounded border-neutral-500 border-[1px]"></div>
				<div
					v-else
					class="w-5 h-5 rounded border-neutral-500 border-[1px] flex justify-center items-center">
					<svg
						width="20"
						height="20"
						viewBox="0 0 100 100">
						<circle
							cx="50"
							cy="50"
							r="50"
							fill="none" />
						<path
							d="M 20 20 L 80 80 M 20 80 L 80 20"
							stroke-width="15"
							stroke="grey" />
					</svg>
				</div>
				<div class="flex-grow h-full flex justify-center items-center">{{ key }}</div>
			</div>

			<div class="item">
				<div>Dot Radius Mapping:</div>
				<n-radio-group
					size="small"
					v-model:value="rMethod"
					name="radiogroup">
					<n-space>
						<n-radio
							key="F"
							value="F">
							Fixed
						</n-radio>
						<n-radio
							key="GD"
							value="GD">
							Nearest Reference Point Distance
						</n-radio>
						<n-radio
							key="NND"
							value="NND">
							NN (Objective Space)
						</n-radio>
						<n-radio
							key="NNDX"
							value="NNDX">
							NN (Decision Space)
						</n-radio>
					</n-space>
				</n-radio-group>
			</div>

			<div class="item">
				<div>Evo Path Option:</div>
				<n-checkbox-group v-model:value="pathOption">
					<n-space item-style="display: flex;">
						<n-checkbox
							value="obj"
							label="Objective Space" />
						<n-checkbox
							value="dec"
							label="Decision Space" />
					</n-space>
				</n-checkbox-group>
			</div>

			<div class="item">
				<n-checkbox v-model:checked="showPF">Pareto Front</n-checkbox>
			</div>
		</div>
	</div>
</template>
