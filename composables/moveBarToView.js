import anime from 'animejs';
export default function (elementID, containerID) {
	const element = document.getElementById(elementID);
	const container = document
		.getElementById(containerID)
		.querySelector('.n-scrollbar-container');
	if (!element || !container) return;
	const elementRect = element.getBoundingClientRect();
	const containerRect = container.getBoundingClientRect();
	let inView =
		containerRect.top <= elementRect.y &&
		elementRect.y + elementRect.height <= containerRect.bottom;
	if (inView) {
		return;
	}
	anime({
		targets: container,
		duration: 1000,
		easing: 'easeInOutQuad',
		scrollTop: element.offsetTop - containerRect.height / 2 + elementRect.height,
	});
}
