export const useProcess = defineStore('process', () => {
	const showAllPair = ref(false);
	const showAllMutation = ref(false);
	const selected = ref(new Set());

	const clear = () => (selected.value = new Set());

	const sel = (iid) => {
		if (!selected.value.has(iid)) selected.value.add(iid);
		else selected.value.delete(iid);
	};

	return { showAllPair, showAllMutation, selected, clear, sel };
});
