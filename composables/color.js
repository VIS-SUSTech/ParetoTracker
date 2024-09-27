function colorArr() {
	return [
		'hsl(162, 71%, 36%)',
		'hsl(26, 98%, 43%)',
		'hsl(244, 31%, 57%)',
		'hsl(329, 80%, 53%)',
		'hsl(88, 69%, 38%)',
		'hsl(44, 98%, 45%)',
		'hsl(39, 70%, 38%)',
		'hsl(0, 0%, 40%)',
		'hsl(359, 79%, 50%)',
	];
}

function colorArrDiff(index, last) {
	const arr = [
		'hsl(162, 71%,',
		'hsl(26, 98%,',
		'hsl(244, 31%,',
		'hsl(329, 80%,',
		'hsl(88, 69%,',
		'hsl(44, 98%,',
		'hsl(39, 70%,',
		'hsl(0, 0%,',
		'hsl(359, 79%,',
	];
	return `${arr[index]} ${last}%)`;
}

function colorMap() {
	return {
		initialization: '#d4d4d4',
		reserved: '#b3cde3',
		mating: '#ccebc5',
		crossover: '#decbe4',
		mutation: '#fed9a6',
		dead: 'black',
	};
}

function groupColorArr(i) {
	return `rgba(120,198,121,0.7)`;
}

export { colorArr, colorMap, groupColorArr, colorArrDiff };
