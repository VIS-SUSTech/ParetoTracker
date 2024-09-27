const colorArr = ['#6366f1', '#6366f1', '#6366f1', '#6366f1'];
export default function (arr, i) {
	return {
		grid: {
			top: '19%',
			bottom: '15%',
			left: '8%',
			right: '5.5%',
		},
		tooltip: {
			trigger: 'axis',
		},
		xAxis: { type: 'category' },
		yAxis: {
			type: 'value',
			axisLine: { show: true },
			axisTick: { show: true },
		},
		dataZoom: [
			{
				type: 'slider',
				show: true,
				xAxisIndex: [0],
				start: 0,
				end: 100,
				height: 20,
				top: '1%',
				showDetail: true,
				fillerColor: 'rgba(0,0,0,0)',
				selectedDataBackground: {
					lineStyle: { shadowColor: colorArr[i] },
					areaStyle: { color: colorArr[i] },
				},
			},
			{
				type: 'slider',
				show: true,
				yAxisIndex: [0],
				filterMode: 'empty',
				showDataShadow: false,
				brushSelect: false,
				start: 0,
				end: 100,
				width: 16,
				right: '1.5%',
			},
			{
				type: 'inside',
				xAxisIndex: [0],
				start: 0,
				end: 100,
			},
			{
				type: 'inside',
				yAxisIndex: 0,
				start: 0,
				end: 100,
			},
		],
		brush: {
			type: ['lineX', 'clear'],
			xAxisIndex: 'all',
			throttleType: 'debounce',
			throttleDelay: 300,
		},
		toolbox: {
			right: '-100%',
			feature: {
				brush: {
					type: ['lineX', 'clear'],
					xAxisIndex: 'all',
				},
			},
		},
		series: [
			{
				data: arr,
				type: 'line',
				lineStyle: { color: colorArr[i] },
				itemStyle: { color: colorArr[i] },
			},
		],
	};
}
