<template>
	<div class="w-full h-full">
		<n-loading-bar-provider :loading-bar-style="{ loading: { height: '5px' } }">
			<n-message-provider :placement="'top'">
				<Main></Main>
			</n-message-provider>
		</n-loading-bar-provider>
	</div>
</template>

<style>
@import url('assets/flow.css');
@import url('assets/main.css');
</style>