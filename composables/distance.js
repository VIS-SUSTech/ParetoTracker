const getDist = (ind1, ind2) => {
	const sumOfSquares = ind1.reduce((sum, curr, index) => {
		const difference = curr - ind2[index];
		return sum + difference * difference;
	}, 0);

	return Math.sqrt(sumOfSquares);
};

const getVector = (ind1, ind2) => {
	return ind1.map((val, index) => val - ind2[index]);
};

const getVectorLength = (vec) => {
	return Math.sqrt(vec.reduce((sum, curr) => sum + curr * curr, 0));
};

const multiVector = (vec1, vec2) => {
	return vec1.reduce((sum, curr, index) => sum + curr * vec2[index], 0);
};

const getPosition = (P, A, B) => {
	if (getDist(P, A) === 0) return { x: 0, y: 0 };
	if (getDist(P, B) === 0) return { x: getDist(A, B), y: 0 };
	const AB = getVector(B, A);
	const AP = getVector(P, A);
	const ABLength = getVectorLength(AB);
	const unitAB = AB.map((val) => val / ABLength);
	const ProjLength = multiVector(AP, unitAB);
	const P_prime = A.map((val, index) => val + ProjLength * unitAB[index]);
	const PP_primeLength = getDist(P, P_prime);
	return { x: ProjLength, y: PP_primeLength };
};

function euclideanDistance(vec1, vec2) {
	if (vec1.length !== vec2.length) {
		throw new Error('Vectors must have the same length');
	}

	let sum = 0;
	for (let i = 0; i < vec1.length; i++) {
		sum += Math.pow(vec1[i] - vec2[i], 2);
	}

	return Math.sqrt(sum);
}

export {
	getDist,
	getVector,
	getVectorLength,
	multiVector,
	getPosition,
	euclideanDistance,
};
