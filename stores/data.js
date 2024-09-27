export const useData = defineStore('data', () => {
	const problem = ref('DDMOP2');
	const algorithm = ref('SMS-EMOA');
	const problems = ref([
		{
			label: 'DTLZ3',
			value: 'DTLZ3',
		},
		{
			label: 'DDMOP2',
			value: 'DDMOP2',
		},
	]);
	const algorithms = ref([
		{
			label: 'NSGA-II',
			value: 'NSGA-II',
		},

		{
			label: 'RVEA',
			value: 'RVEA',
		},

		{
			label: 'SMS-EMOA',
			value: 'SMS-EMOA',
		},
	]);

	// scale functions
	const { viewport } = storeToRefs(useFlow());
	const functionsReady = ref(false);
	const width = ref(0);
	const height = ref(0);
	const padding = ref(0);
	const zoomVal = computed(() => viewport.value.zoom);
	const rScale = ref();
	const rScaleByGD = ref();
	const rScaleByNND = ref();
	const rScaleByNNXD = ref();
	const rScaleByGDInside = ref();
	const xScaleObj = ref();
	const yScaleObj = ref();
	const xScaleDec = ref();
	const yScaleDec = ref();
	const colorScale = ref();
	const pfContour = ref();
	const zooming = ref(false);
	const dataReady = ref(false);
	const dataDictionary = ref({});
	const metricsData = ref([]);
	const pfData = ref([]);
	const individuals = ref(new Map());

	const maxIndCnt = computed(() =>
		d3.max(Object.values(dataDictionary.value).map((e) => Object.values(e).length)),
	);

	async function load() {
		dataReady.value = false;
		// const fileName = 'DTLZ3_NSGA2';
		const fileName = 'DDMOP2_SMSEMOA';
		// data
		let dataArr = await $fetch(`/api/data/${fileName}`);
		dataArr.forEach((generationArr, generationIndex) => {
			dataDictionary.value[generationIndex + 1] = {};
			generationArr.forEach((individual) => {
				dataDictionary.value[generationIndex + 1][individual.IID] = individual;
				individuals.value.set(`${generationIndex + 1}_${individual.IID}`, individual);
			});
		});

		// metrics
		let metric = await $fetch(`/api/metric/${fileName}`);
		Object.keys(metric[0]).forEach((key) => {
			metricsData.value.push([undefined, ...metric.map((e) => e[key])]);
		});

		// pf
		pfData.value = await $fetch(`/api/pf/${fileName}`);
		// ready
		dataReady.value = true;
	}

	function getScale(isObj, isX) {
		let domain;
		if (isObj) {
			domain = pfData.value.map((e) => (isX ? e[0] : e[1]));
		} else {
			domain = [...individuals.value.values()]
				.map((e) => e.X_proj)
				.map((e) => (isX ? e[0] : e[1]));
		}
		return d3
			.scaleLinear()
			.domain(d3.extent(domain))
			.range(
				isX
					? [width.value / 4, (width.value / 4) * 3]
					: [(height.value / 4) * 3, height.value / 4],
			);
	}

	async function initFunctions(w, h, p) {
		width.value = w;
		height.value = h;
		padding.value = p;
		xScaleObj.value = getScale(true, true);
		yScaleObj.value = getScale(true, false);
		xScaleDec.value = getScale(false, true);
		yScaleDec.value = getScale(false, false);

		rScale.value = (r, _) => r / Math.pow(zoomVal.value, 0.66);
		let domain = [...individuals.value.values()].flatMap((d) =>
			[d.GD, d.GD_premut].map((d) => Math.pow(d > 3 ? 3 : d, 2)),
		);
		const rSGD = d3.scaleLinear().domain(d3.extent(domain));
		domain = [...individuals.value.values()].flatMap((d) =>
			Math.pow(d.NN > 3 ? 3 : d.NN, 2),
		);
		const rSNN = d3.scaleLinear().domain(d3.extent(domain));
		domain = [...individuals.value.values()].flatMap((d) =>
			Math.pow(d.NN_X > 3 ? 3 : d.NN_X, 2),
		);
		const rSNNX = d3.scaleLinear().domain(d3.extent(domain));
		rScaleByNND.value = (r, extra) =>
			(extra?.NN
				? rSNN.range([r, 4 * r])(Math.pow(extra.NN > 3 ? 3 : extra.NN, 2))
				: r) / Math.pow(zoomVal.value, 0.66);
		rScaleByGD.value = (r, extra) =>
			(extra?.GD
				? rSGD.range([r, 4 * r])(Math.pow(extra.GD > 3 ? 3 : extra.GD, 2))
				: r) / Math.pow(zoomVal.value, 0.66);
		rScaleByNNXD.value = (r, extra) =>
			(extra?.NN_X
				? rSNNX.range([r, 4 * r])(Math.pow(extra.NN_X > 3 ? 3 : extra.NN_X, 2))
				: r) / Math.pow(zoomVal.value, 0.66);
		rScaleByGDInside.value = (gd) =>
			rSGD.range([6.5, 16])(Math.pow(gd > 3 ? 3 : gd, 2));

		pfContour.value = d3
			.contourDensity()
			.x((d) => xScaleObj.value(d[0]))
			.y((d) => yScaleObj.value(d[1]))
			.size([width.value, height.value])
			.cellSize(4)
			.bandwidth(10)
			.thresholds(30)(pfData.value);
		colorScale.value = function (param) {
			return d3
				.scaleLinear()
				.domain([0, 1])
				.range([d3.interpolateBlues(0.2), d3.interpolateBlues(0.8)])
				.interpolate(d3.interpolateHcl)(
					d3
						.scaleLinear()
						.domain(d3.extent(pfContour.value, (d) => d.value))
						.range([0, 1])(param),
				);
		};

		functionsReady.value = true;
	}

	function getZoomFunction(width, height, transform, allowZoom) {
		let magnification = 2;
		return d3
			.zoom()
			.translateExtent([
				[-width * magnification, -height * magnification],
				[width * magnification * 2, height * magnification * 2],
			])
			.scaleExtent(allowZoom ? [0.1, 10] : [1, 1])
			.on('start', () => { })
			.on('zoom', (event) => {
				transform.value = event.transform;
			})
			.on('end', () => { });
	}

	return {
		load,
		pfData,
		zooming,
		zoomVal,
		dataReady,
		metricsData,
		dataDictionary,
		individuals,
		initFunctions,
		getZoomFunction,
		functionsReady,
		zooming,
		width,
		height,
		padding,
		rScale,
		rScaleByGD,
		rScaleByGDInside,
		rScaleByNND,
		rScaleByNNXD,
		xScaleObj,
		yScaleObj,
		xScaleDec,
		yScaleDec,
		colorScale,
		pfContour,
		maxIndCnt,

		problem,
		algorithm,
		problems,
		algorithms,
	};
});
