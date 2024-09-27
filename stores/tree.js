export const useTree = defineStore('tree', () => {
	const { dataDictionary, individuals } = storeToRefs(useData());
	const { nodes } = storeToRefs(useFlow());
	const trees = ref(new Map());
	const roots = computed(() => new Set(trees.value.keys()));
	const { range } = storeToRefs(useEvent());
	const minGenNum = computed(() => range.value[0]);
	const minGenCross = ref(new Map());

	async function addTree(uid) {
		if (trees.value.size >= 9) {
			window.$message.error(`reach max tree size`);
			return;
		}

		window.$message.success(`Add family tree of ${uid}`);
		trees.value.set(uid, getTree(uid));

		if (trees.value.size >= 2) {
			let uids = [...trees.value.keys()];

			uids.forEach((uid) => {
				minGenCross.value.set(uid, new Map());
			});

			uids.forEach((uid1) => {
				uids.forEach((uid2) => {
					minGenCross.value.get(uid1).set(uid2, getCrossGen(uid1, uid2));
				});
			});
		}
	}
	async function clearTree() {
		window.$message.info('Clear family tree');
		trees.value = new Map();
		minGenCross.value = new Map();
	}
	async function delTree(uid) {
		window.$message.info(`Delete family tree of ${uid}`);
		trees.value.delete(uid);
		minGenCross.value.delete(uid);
	}
	async function getTreePath() {
		trees.value.forEach((treeObject, rootUid) => {
			treeObject.edges.forEach((treeEdge) => {
				let xOffset = 2;
				let yOffset = 32 + 6;
				let u1 = treeEdge.source;
				let u2 = treeEdge.target;
				let c1 = d3.select(`#obj_${u1}`);
				let c2 = d3.select(`#obj_${u2}`);
				let x1 = getXY(c1, true, true);
				let x2 = getXY(c2, true, true);
				let y1 = getXY(c1, false, true);
				let y2 = getXY(c2, false, true);
				let node1 = nodes.value.filter((node) => {
					return node.id === u1.split('_')[0];
				})[0];
				let node2 = nodes.value.filter((node) => {
					return node.id === u2.split('_')[0];
				})[0];
				x1 = x1 + node1.position.x + xOffset;
				y1 = y1 + node1.position.y + yOffset;
				x2 = x2 + node2.position.x + xOffset;
				y2 = y2 + node2.position.y + yOffset;
				treeEdge['obj'] = getPairPath(x1, y1, x2, y2);
			});
		});
		trees.value.forEach((treeObject, rootUid) => {
			treeObject.edges.forEach((treeEdge) => {
				let xOffset = 2;
				let yOffset = 32 + 328;
				let u1 = treeEdge.source;
				let u2 = treeEdge.target;
				let c1 = d3.select(`#dec_${u1}`);
				let c2 = d3.select(`#dec_${u2}`);
				let x1 = getXY(c1, true, true);
				let x2 = getXY(c2, true, true);
				let y1 = getXY(c1, false, true);
				let y2 = getXY(c2, false, true);
				let node1 = nodes.value.filter((node) => {
					return node.id === u1.split('_')[0];
				})[0];
				let node2 = nodes.value.filter((node) => {
					return node.id === u2.split('_')[0];
				})[0];
				x1 = x1 + node1.position.x + xOffset;
				y1 = y1 + node1.position.y + yOffset;
				x2 = x2 + node2.position.x + xOffset;
				y2 = y2 + node2.position.y + yOffset;
				treeEdge['dec'] = getPairPath(x1, y1, x2, y2);
			});
		});
	}

	function getLife(uid) {
		let ind = individuals.value.get(uid);
		let start, end;
		start = end = ind.Gen;
		[...individuals.value.keys()].forEach((e) => {
			let gen = +e.split('_')[0];
			let iid = +e.split('_')[1];
			if (iid === ind.IID) {
				gen >= end ? (end = gen) : {};
				gen <= start ? (start = gen) : {};
			}
		});
		return [start, end];
	}

	function getTree(uid) {
		let rootGen = +uid.split('_')[0];
		let rootIID = +uid.split('_')[1];
		let tree = new Map();
		tree.set(rootGen, new Set([rootIID]));
		for (let currGen = rootGen - 1; currGen >= 1; currGen--) {
			let lastGen = currGen + 1;
			let currGenNodes = new Set();
			tree.get(lastGen).forEach((iid) => {
				let ind = dataDictionary.value[lastGen][iid];
				if (dataDictionary.value[currGen][iid] || ind.Parents.length === 0) {
					currGenNodes.add(iid);
				}
				else {
					currGenNodes.add(ind.Parents[0]);
					currGenNodes.add(ind.Parents[1]);
				}
			});
			tree.set(currGen, currGenNodes);
		}
		let edges = [];
		for (let currGen = rootGen; currGen >= minGenNum.value + 1; currGen--) {
			let beforeGen = currGen - 1;

			let currGenNodes = tree.get(currGen);
			let beforeGenNodes = tree.get(beforeGen);

			currGenNodes.forEach((iid) => {
				let currInd = dataDictionary.value[currGen][iid];
				if (beforeGenNodes.has(iid) || currInd.Parents.length === 0) {
					let beforeInd = dataDictionary.value[beforeGen][iid];
					edges.push({
						id: `${beforeGen}_${iid}-${currGen}_${iid}`,
						source: `${beforeGen}_${iid}`,
						target: `${currGen}_${iid}`,
						xDistance: euclideanDistance(beforeInd.X, currInd.X),
						yDistance: euclideanDistance(beforeInd.F, currInd.F),
						type: currInd.Type,
					});
				} else {
					let p1 = dataDictionary.value[beforeGen][currInd.Parents[0]];
					let p2 = dataDictionary.value[beforeGen][currInd.Parents[1]];
					edges.push({
						id: `${beforeGen}_${p1.IID}-${currGen}_${iid}`,
						source: `${beforeGen}_${p1.IID}`,
						target: `${currGen}_${iid}`,
						xDistance: euclideanDistance(p1.X, currInd.X),
						yDistance: euclideanDistance(p1.F, currInd.F),
						type: currInd.Type,
					});
					edges.push({
						id: `${beforeGen}_${p2.IID}-${currGen}_${iid}`,
						source: `${beforeGen}_${p2.IID}`,
						target: `${currGen}_${iid}`,
						xDistance: euclideanDistance(p2.X, currInd.X),
						yDistance: euclideanDistance(p2.F, currInd.F),
						type: currInd.Type,
					});
				}
			});
		}
		return { treeNodes: tree, edges: edges };
	}

	const intersection = (setA, setB) =>
		new Set([...setA].filter((x) => setB.has(x)));

	function getCrossGen(u1, u2) {
		let tree1 = trees.value.get(u1).treeNodes;
		let tree2 = trees.value.get(u2).treeNodes;
		let currGen = d3.min([d3.max([...tree1.keys()]), d3.max([...tree2.keys()])]);
		for (; currGen >= 1; currGen--) {
			let cross = intersection(tree1.get(currGen), tree2.get(currGen));
			if (cross.size !== 0) return currGen;
		}
	}

	return {
		trees,
		roots,
		addTree,
		delTree,
		clearTree,
		getTreePath,
		getLife,
		minGenCross,
	};
});
