import Canvas from "Canvas/Canvas";
import Particle from "Particle/Particle";
import Vector from "Geometry/Vector";

const t = 1000/150;
let intervalPtr: null|ReturnType<typeof setInterval> = null;
const G:Vector = (new Vector(0, -1000)).mul(10);

window.onload = () => {
	setTimeout(() => {
		console.log("Start")
		const canvas = new Canvas();

		intervalPtr = setInterval(() => {
			someFn(canvas/*, parts*/);
		}, t);
	}, 2000);
}

const someFn = (canvas:Canvas) => { intervalPtr !== null ? clearInterval(intervalPtr) : {G, Particle} };
