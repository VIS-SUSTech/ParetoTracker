import * as d3 from 'd3';
function getUid(ind) {
	return `${ind.Gen}_${ind.IID}`;
}

function getXY(d3sel, isX, hasOffset) {
	let res;
	let svgTransformString = d3
		.select(d3sel.node().parentNode.parentNode.parentNode)
		.attr('transform');
	let translateMatch = svgTransformString.match(/translate\(([^,]+),([^)]+)\)/);
	let offsetX = parseFloat(translateMatch[1]);
	let offsetY = parseFloat(translateMatch[2]);
	if (d3sel.node().tagName === 'circle') {
		res = +d3sel.attr(isX ? 'cx' : 'cy');
	} else {
		const innerTrans = d3sel.attr('transform');
		const innerMatch = /translate\(([^,]+),([^)]+)\)/.exec(innerTrans);
		res = parseFloat(isX ? innerMatch[1] : innerMatch[2]);
	}
	if (hasOffset) res += isX ? offsetX : offsetY;
	return res;
}

function getPairPath(x1, y1, x2, y2) {
	function getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	}

	const side = Math.random() > 0.5 ? 1 : -1;
	const distance = getRandomArbitrary(3, 5);

	// 计算控制点1和控制点2
	const midX = (x1 + x2) / 2;
	const midY = (y1 + y2) / 2;
	const angle = Math.atan2(y2 - y1, x2 - x1);
	const controlX1 = midX + side * distance * Math.cos(angle + Math.PI / 2);
	const controlY1 = midY + side * distance * Math.sin(angle + Math.PI / 2);
	const controlX2 = midX + side * distance * Math.cos(angle + Math.PI / 2);
	const controlY2 = midY + side * distance * Math.sin(angle + Math.PI / 2);

	const pathStr = `M${x1},${y1} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2}`;

	return pathStr;
}

function getCrossPath(x1, y1, x2, y2, distance) {
	const side = -1;

	// 计算控制点1和控制点2
	const midX = (x1 + x2) / 2;
	const midY = (y1 + y2) / 2;
	const angle = Math.atan2(y2 - y1, x2 - x1);
	const controlX1 = midX + side * distance * Math.cos(angle + Math.PI / 2) * 4;
	const controlY1 = midY + side * distance * Math.sin(angle + Math.PI / 2) * 4;
	const controlX2 = midX + side * distance * Math.cos(angle + Math.PI / 2) * 4;
	const controlY2 = midY + side * distance * Math.sin(angle + Math.PI / 2) * 4;

	const pathStr = `M${x1},${y1} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2}`;

	return pathStr;
}

function getLine(id1, id2) {
	let u1 = d3.select(id1);
	let u2 = d3.select(id2);

	let x1 = getXY(u1, true, false);
	let x2 = getXY(u2, true, false);
	let y1 = getXY(u1, false, false);
	let y2 = getXY(u2, false, false);

	return [x1, y1, x2, y2];
}

export { getXY, getUid, getPairPath, getLine, getCrossPath };
