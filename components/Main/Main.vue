<template>
	<div class="w-full h-full border-zinc-400 rounded border-2 bg-white relative overflow-hidden"
		@contextmenu="(e) => (e.preventDefault(), console.log(e.target))">
		<ToolTip></ToolTip>
		<FlowContainer></FlowContainer>
		<OverviewTreeMask></OverviewTreeMask>
		<DrawerContainer></DrawerContainer>
		<BoardContainer></BoardContainer>
		<ControlBar></ControlBar>
	</div>
</template>

<script setup>
import { useMessage } from 'naive-ui'
window.$message = useMessage()
await useData().load();
await useData().initFunctions(316, 316, 10);
</script>