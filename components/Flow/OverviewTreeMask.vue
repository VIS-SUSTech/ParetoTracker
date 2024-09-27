<template>
	<div></div>
</template>

<script setup>
const { pathOption } = storeToRefs(useEvent());
const { roots, trees } = storeToRefs(useTree());
const { viewport } = storeToRefs(useFlow());
const { zooming } = storeToRefs(useData());
const { getTreePath } = useTree();

async function updateTreeModal() {
	let dom = d3.select('.vue-flow__transformationpane.vue-flow__container');
	dom.select('#tree-svg').remove();
	if (zooming.value) return;

	let svg = dom
		.append('svg')
		.attr('id', 'tree-svg')
		.attr('width', 100000)
		.attr('height', 100000)
		.style('position', 'absolute')
		.style('z-index', 9999)
		.style('pointer-events', 'none');

	let edges = [...trees.value.values()].flatMap((treeObject) => treeObject.edges);

	let half = edges.length;

	if (pathOption.value.includes('obj') && pathOption.value.includes('dec')) {
		edges = [...edges, ...edges].map((e, i) => {
			return i < half ? { ...e, d: e.obj } : { ...e, d: e.dec };
		});
	} else if (pathOption.value.includes('obj')) {
		edges = [...edges].map((e) => {
			return { ...e, d: e.obj };
		});
	} else if (pathOption.value.includes('dec')) {
		edges = [...edges].map((e) => {
			return { ...e, d: e.dec };
		});
	}

	let strokeWidthScale = d3
		.scaleLinear()
		.domain(d3.extent(edges.flatMap((e) => e.yDistance)))
		.range([1, 7]);

	svg
		.selectAll('path')
		.data(edges)
		.join('path')
		.attr('fill', 'none')
		.attr('d', (d) => d.d)
		.attr('class', (d) => `edge-${d.type}`)
		.attr('stroke', (d) => colorMap()[d.type])
		.attr(
			'stroke-width',
			(d) => strokeWidthScale(d.yDistance) / viewport.value.zoom,
		);
}

watch(roots, async () => {
	await getTreePath();
	await updateTreeModal();
});
watch(zooming, async () => {
	await getTreePath();
	await updateTreeModal();
});
watch(viewport, async () => {
	await updateTreeModal();
});
watch(pathOption, async () => {
	await updateTreeModal();
});
</script>
