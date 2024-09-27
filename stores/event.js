export const useEvent = defineStore('event', () => {

	// ui control
	const floatBoardPin = ref(false);
	const floatBoardHover = ref(false);
	const showLine = ref(false);
	const showBar = ref(false);
	floatBoardPin.value =
		floatBoardHover.value =
		showLine.value =
		showBar.value =
		false;

	// range realted
	const range = ref([1, 5]);
	async function updateRange(start, end) {
		// update range
		range.value = [start, end];

		// move bar chart
		moveBarToView(`bar${range.value[0]}`, 'bar-container');
		await useTree().clearTree();
		await useFlow().clearProcess();
		await useFlow().updateElements();
		await useFlow().moveElements();
	}

	const typeFilter = ref({
		initialization: true,
		reserved: true,
		mating: true,
		crossover: true,
		mutation: true,
		dead: true,
	});

	const rMethod = ref('F');
	const r = ref(3);

	const pathOption = ref(['obj', 'dec']);
	const showPF = ref(true);

	// tooltip
	const show = ref(false);
	const x = ref(1000);
	const y = ref(1000);
	const type = ref('bar');
	const data = ref({ txt: 'this is tooltip' });

	function mouseOver(tipType, tipData) {
		show.value = true;
		type.value = tipType;
		data.value = tipData;
	}
	function mouseMove() {
		x.value = event.pageX;
		y.value = event.pageY;

		if (type.value === 'ind-board') {
			x.value -= 200;
		}
	}
	function mouseOut() {
		show.value = false;
	}

	return {
		// ui control
		floatBoardPin,
		floatBoardHover,
		showLine,
		showBar,
		// range realted
		range,
		updateRange,
		// filter
		pathOption,
		typeFilter,
		showPF,
		rMethod,
		r,
		// tooltip
		show,
		x,
		y,
		type,
		data,
		mouseOver,
		mouseMove,
		mouseOut,
	};
});
