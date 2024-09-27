<script setup>
const { showLine, showBar } = storeToRefs(useEvent());
function act(type) {
	if (type === 0) {
		if (showLine.value && showBar.value) {
			showLine.value = showBar.value = false;
		} else showLine.value = showBar.value = true;
	} else if (type === 1) {
		showLine.value = !showLine.value;
	} else if (type === 2) {
		showBar.value = !showBar.value;
	}
}
</script>
<template>
	<div
		class="bg-slate-200 border-zinc-400 absolute top-1 left-1 rounded border-2 flex flex-col items-start w-1/4 z-20">
		<!-- title -->
		<DrawerTitle
			@act="act"
			:showLine="showLine"
			:showBar="showBar"></DrawerTitle>

		<DrawerInfo></DrawerInfo>

		<!-- line charts -->
		<DrawerLineCharts
			@act="act"
			:showLine="showLine"></DrawerLineCharts>
		<!-- bar charts -->
		<DrawerBarCharts
			@act="act"
			:showBar="showBar"></DrawerBarCharts>
	</div>
</template>
