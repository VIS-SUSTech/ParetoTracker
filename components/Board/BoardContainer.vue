<script setup>
const { floatBoardHover, floatBoardPin } = storeToRefs(useEvent());
const { roots } = storeToRefs(useTree());

function act(type) {
	if (type === 'click') {
		floatBoardPin.value = !floatBoardPin.value;
	}
	if (floatBoardPin.value) return;
	if (type === 'in') {
		floatBoardHover.value = true;
	}
	if (type === 'out') {
		floatBoardHover.value = false;
	}
}
</script>
<style scoped></style>
<template>
	<div
		@mouseover="act('in')"
		@mouseout="act('out')"
		@click="act('click')"
		class="bg-slate-100 border-zinc-400 rounded border-2 absolute transition-all delay-200 ease-in-out flex flex-col items-center p-2 right-1 gap-2 top-1 z-30"
		:class="{
			'top-1 ': floatBoardPin || floatBoardHover,
			'top-[-660px] ': !(floatBoardPin || floatBoardHover),
		}">
		<div class="flex gap-1 justify-center">
			<!-- left -->
			<div class="w-[700px] h-[650px]">
				<div
					v-if="roots.size === 0"
					class="w-full h-[650px] border-zinc-400 rounded border-2 bg-slate-100 flex items-center justify-center text-2xl">
					No Individual Selected
				</div>

				<div
					v-else
					class="w-full h-[650px]">
					<BoardBar></BoardBar>
				</div>
			</div>
			<!-- right -->
			<div class="flex flex-col items-center justify-between">
				<div class="w-[320px] h-[320px] border-zinc-400 rounded border-2">
					<BoardScatter :if-obj="true"></BoardScatter>
				</div>
				<div class="w-[320px] h-[320px] border-zinc-400 rounded border-2">
					<BoardScatter :if-obj="false"></BoardScatter>
				</div>
			</div>
		</div>
		<!-- abr -->
		<div
			class="h-4 w-full border-zinc-400 rounded border-2"
			:class="[
				!(floatBoardPin || floatBoardHover) ? 'bg-slate-200' : 'bg-slate-300',
			]"></div>
	</div>
</template>
