<script setup>
const props = defineProps(['showLine']);
const { range, showLine } = storeToRefs(useEvent());
const { metricsData } = storeToRefs(useData());
const { updateRange } = useEvent();
const clickSelectRange = 3;
const doms = [];
const options = [];
const charts = [];
function initChartDoms() {
	metricsData.value.forEach((arr, i) => {
		let dom = document.getElementById(`line${i}`);
		let opt = getLineOption(arr, i);
		let chart = echarts.init(dom);
		doms.push(dom);
		options.push(opt);
		charts.push(chart);
		dom.addEventListener('resize', () => {
			charts.forEach((chart) => chart.resize());
		});
	});
}
function setOptions() {
	charts.forEach((chart, i) => {
		chart.setOption(options[i]);
		chart.on('brushEnd', brushEnd);
		chart.on('click', click);
		echarts.connect(charts);
	});
	charts[1].dispatchAction({
		type: 'takeGlobalCursor',
		key: 'brush',
		brushOption: {
			brushType: false,
		},
	});
}

function brushStart() {
	window.$message.success('Start select range');
	if (!showLine.value) showLine.value = true;
	charts.forEach((chart) => {
		chart.dispatchAction({
			type: 'takeGlobalCursor',
			key: 'brush',
			brushOption: {
				brushType: 'lineX',
				xAxisIndex: 0,
			},
		});
	});
}

function brushClear() {
	window.$message.info('clear select range');
	updateRange(1, 1);
	charts[1].dispatchAction({
		type: 'brush',
		areas: [
			{
				xAxisIndex: 0,
				brushType: 'lineX',
				coordRange: [1, 1],
			},
		],
	});
	charts[1].dispatchAction({
		type: 'takeGlobalCursor',
		key: 'brush',
		brushOption: {
			brushType: false,
		},
	});
}

function brushEnd(params) {
	let coordRange = params.areas[0].coordRange;
	let start = coordRange[0];
	let end = coordRange[1];
	if (start === range.value[0] && end === range.value[1]) {
		return;
	} else if (end - start > 49) {
		window.$message.error('max range length 10');
		brushClear();
		return;
	} else {
		updateRange(start, end);
		charts[1].dispatchAction({
			type: 'brush',
			areas: [
				{
					xAxisIndex: 0,
					brushType: 'lineX',
					coordRange: coordRange,
				},
			],
		});
	}
}

function click(params) {
	let coordRange = [
		params.dataIndex - clickSelectRange,
		params.dataIndex + clickSelectRange,
	];
	let start = coordRange[0];
	let end = coordRange[1];
	updateRange(start, end);
	charts[1].dispatchAction({
		type: 'brush',
		areas: [
			{
				xAxisIndex: 0,
				brushType: 'lineX',
				coordRange: coordRange,
			},
		],
	});
}

onMounted(() => {
	initChartDoms();
	setOptions();
});

const showText = ref(false);

watch(showLine, () => {
	if (showLine.value) {
		setTimeout(() => {
			showText.value = showLine.value;
		}, 400);
	} else {
		showText.value = false;
	}
});

const titles = ['HV', 'IGD', 'SP', 'MS'];
</script>

<template>
	<div class="border-zinc-400 border-t-2 pl-2 pr-2 w-full flex flex-col justify-center pb-1">
		<div class="h-8 flex items-center">
			<div>Quality Lines Chart</div>
			<div class="ml-auto flex items-center gap-4">
				<n-button size="tiny" type="tertiary" tertiary strong @click="brushStart">
					select
				</n-button>
				<n-button size="tiny" type="tertiary" tertiary strong @click="brushClear">
					clear
				</n-button>
				<n-button size="tiny" type="tertiary" tertiary strong @click="setOptions">
					reset
				</n-button>
				<n-button size="tiny" type="tertiary" tertiary strong @click="$emit('act', 1)" class="w-14">
					{{ showLine ? 'collapse' : 'expand' }}
				</n-button>
			</div>
		</div>
		<div class="w-full rounded transition-all delay-200 ease-in-out overflow-hidden"
			:class="{ 'h-[615px]': showLine, 'h-0': !showLine }">
			<div class="w-full h-[615px] flex flex-col gap-1 relative">
				<div v-for="i in 4" class="w-full h-[150px] border-zinc-300 rounded border-2 bg-zinc-100">
					<div :id="`line${i - 1}`" class="w-full h-full"></div>

					<div
						class="z-[9999] relative -top-[55%] left-[70%] text-zinc-300 font-semibold text-[35px] w-36 flex justify-end text-right pointer-events-none opacity-60">
						{{ titles[i - 1] }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>