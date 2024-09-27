<script setup>
const { show, x, y, type, data } = storeToRefs(useEvent());
</script>
<style scoped>
.row {
	@apply flex items-center gap-2  rounded  border-zinc-400 border-[0.5px] bg-neutral-100 pr-2;
}
.label {
	@apply rounded  border-zinc-400 border-[0.5px] w-20 flex-shrink-0 flex justify-center items-center bg-neutral-200;
}
.val {
	@apply flex-grow;
}
</style>
<template>
	<div
		id="tooltip"
		v-show="show"
		class="absolute z-[9999] rounded border-2 border-zinc-400 p-1 bg-white text-sm"
		:style="{ left: `${x}px`, top: `${y}px` }">
		<div
			v-if="type === 'bar'"
			class="flex flex-col gap-1">
			<div class="row">
				<div class="label">Type</div>
				<div class="val">{{ data.type }} ({{ data.alive ? 'survived' : 'dead' }})</div>
			</div>

			<div class="row">
				<div class="label">Count</div>
				<div class="val">{{ data.cnt }} / {{ data.total }}</div>
			</div>
		</div>
		<div
			v-if="type === 'ind' || type === 'ind-board' || type === 'ind-crossover'"
			class="flex flex-col gap-1">
			<div class="row">
				<div class="label">Generation</div>
				<div class="val">{{ data.Gen }}</div>
			</div>
			<div class="row">
				<div class="label">ID</div>
				<div class="val">{{ data.IID }}</div>
			</div>
			<div class="row">
				<div class="label">Type</div>
				<div class="val">{{ data.Type }}</div>
			</div>
			<div class="row">
				<div class="label">NRPD</div>
				<div class="val">
					{{ type === 'ind-crossover' ? data.GD_premut.toFixed(6) : data.GD.toFixed(6) }}
				</div>
			</div>

			<div class="row">
				<div class="label">Alive ?</div>
				<div class="val">{{ data.Alive ? 'Yes' : 'No' }}</div>
			</div>

			<div class="w-full h-[1px] border-zinc-400 border-b-[1px] border-dashed"></div>

			<div
				class="row"
				v-for="i in data.F.length">
				<div class="label">Objective{{ i }}</div>
				<div class="val">
					{{
						type === 'ind-crossover'
							? data.F_premut[i - 1].toFixed(6)
							: data.F[i - 1].toFixed(6)
					}}
				</div>
			</div>
		</div>
	</div>
</template>
