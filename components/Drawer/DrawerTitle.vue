<script setup>
const { range } = storeToRefs(useEvent());
const props = defineProps(['showBar', 'showLine']);
const msg = computed(() => {
	if (props.showLine && props.showBar) return 'collapse';
	else return 'expand';
});
</script>
<style scoped></style>
<template>
	<div class="w-full pl-2 pr-2 pb-1 flex justify-start items-center">
		<div class="text-3xl font-black">ParetoTracker</div>

		<div class="ml-auto mt-auto flex gap-4">
			<div class="text-neutral-400">Selected Generation Range: {{ range }}</div>
			<n-button
				size="tiny"
				type="tertiary"
				tertiary
				strong
				@click="$emit('act', 0)"
				class="ml-auto mt-auto w-14">
				{{ msg }}
			</n-button>
		</div>
	</div>
</template>
