<script setup>
const { problem, algorithm, problems, algorithms } = storeToRefs(useData());
</script>
<style scoped></style>
<template>
	<div
		class="border-zinc-400 border-t-2 pl-2 pr-2 w-full flex flex-col justify-center pb-1">
		<div class="w-full h-8 flex items-center gap-4">
			<div class="w-1/2 h-full flex items-center">
				<div>Problem:</div>
				<div class="flex-grow h-full flex justify-center items-center">
					<n-select
						size="small"
						class="h-full"
						v-model:value="problem"
						:options="problems" />
				</div>
			</div>

			<div class="w-1/2 h-full flex items-center">
				<div>Algorithm:</div>
				<div class="flex-grow h-full flex justify-center items-center">
					<n-select
						size="small"
						class="h-full"
						v-model:value="algorithm"
						:options="algorithms" />
				</div>
			</div>
		</div>
	</div>
</template>
