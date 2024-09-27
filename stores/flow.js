import { MarkerType } from '#imports';
export const useFlow = defineStore('flow', () => {
	// container attr
	const { viewport } = storeToRefs(useVueFlow());
	const {
		nodesDraggable,
		nodesConnectable,
		onPaneReady,
		fitView,
		zoomOnScroll,
		panOnDrag,
	} = useVueFlow();
	nodesDraggable.value = nodesConnectable.value = false;
	// flow elements
	const elementReady = ref(true);
	const nodes = ref([]);
	const edges = ref([]);
	const processId = ref('');
	const { range } = storeToRefs(useEvent());
	async function updateElements() {
		elementReady.value = false;
		let startX = 200;
		let nodeY = 200;
		let nodeWidth = 450;

		nodes.value = [];
		edges.value = [];
		for (let i = range.value[0]; i <= range.value[1]; i++) {
			// add nodes
			let node = {
				id: `${i}`,
				type: 'overview',
				label: 'Generation ' + i,
				position: { x: nodeWidth * (i - range.value[0]) + startX, y: nodeY },
				data: {
					connect: [i === range.value[0] ? 0 : 1, i === range.value[1] ? 0 : 1],
				},
			};
			nodes.value.push(node);
			// add edges
			if (i !== range.value[0]) {
				edges.value.push({
					id: `e${i - 1}-${i}`,
					source: `${i - 1}`,
					target: `${i}`,
					type: 'process',
					animated: true,
					markerEnd: MarkerType.ArrowClosed,
				});
			}
		}
		elementReady.value = true;
	}

	function fit(nodes = [], padding = 0.35, delay = 100, duration = 300) {
		setTimeout(() => {
			fitView({
				nodes: nodes,
				padding: padding,
				delay: delay,
				duration: duration,
			});
		}, 400);
	}

	async function moveElements() {
		await updateElements();
		if (processId.value !== '') {
			nodes.value.forEach((node) => {
				if (processId.value !== '') {
					if (node.id >= +processId.value.split('-')[1]) {
						const startX = ref(node.position.x);
						const posX = useTransition(startX, {
							delay: 100,
							duration: 300,
							transition: TransitionPresets.easeInOutQuad,
						});
						startX.value += 2100;
						watch(posX, () => {
							node.position.x = posX.value;
						});
					}
				}
			});
			let nodeArr = processId.value.replaceAll('e', '').split('-');
			fit(nodeArr);
		} else {
			fit();
		}
	}

	async function clearProcess() {
		let nodeArr = processId.value.replaceAll('e', '').split('-');
		window.$message.info(`Collapse process: ${nodeArr[0]} => ${nodeArr[1]}`);
		processId.value = '';
		await moveElements();
	}
	return {
		updateElements,
		moveElements,
		nodes,
		edges,
		elementReady,
		viewport,
		onPaneReady,
		processId,
		clearProcess,
		zoomOnScroll,
		panOnDrag,
		fit,
	};
});
