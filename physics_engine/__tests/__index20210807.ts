/*
import Canvas from "Canvas/Canvas";
import Particle from "Particle/Particle";
import Vector from "Geometry/Vector";

const t = 1000/150;
let intervalPtr1: null|ReturnType<typeof setInterval> = null;
let intervalPtr2: null|ReturnType<typeof setInterval> = null;

const getX = (i:number, n:number, r: number, x:number) => {
	return x + r * Math.cos(2 * Math.PI * i / n);
}
const getY = (i:number, n:number, r: number, y:number) => {
	return y + r * Math.sin(2 * Math.PI * i / n);
}

const getRandomColor = () => {
	const tmp = Math.random();
	if (tmp < 0.2) {
		return "#f00";
	} else if (tmp < 0.4) {
		return "#0f0";
	} else if (tmp < 0.6) {
		return "#00f";
	} else if (tmp < 0.8) {
		return "#f0f";
	} else {
		return "#ff0";
	}
}
const midX = Math.floor(1000);
const n = 300;
const r = 2;
const y = 120;
let cnt = 0;
window.onload = () => {
	setTimeout(() => {
		console.log("Start")
		const canvas = new Canvas();

		let i = 400;
		const parts1 = (new Array(n)).fill(0).map((p, i) => 
			new Particle(10, new Vector(getX(i, n, r, midX), getY(i, n, r, y)), new Vector(0, 1000), new Vector(0, 1100))
		);
		const parts2 = (new Array(n)).fill(0).map(p => 
			new Particle(10, new Vector(i, 1000 + i), new Vector(220 - (i-=10), 1))
		);
		intervalPtr1 = setInterval(() => {
			game(canvas, parts2);
			fireWorks(canvas, parts1);
		}, t);
	}, 2000);
}

let explode = false;
let didExplode = false;
const applyEx = (p:Particle, midY: number) => {
	const phi = Math.atan2(p.position.y - midY, p.position.x - midX);
	p.velocity.x = 100 * Math.cos(phi) + Math.random() * 100 + Number(Math.random() > 0.6) * 100;
	p.velocity.y = 100 * Math.sin(phi) + Math.random() * 100 + Number(Math.random() > 0.6) * 100;
	p.acceleration.x = 0;
	p.acceleration.y /= 1.3;
}

const G:Vector = (new Vector(0, -1000)).mul(10);
const fireWorks = (canvas:Canvas, particles: Particle[]) => {
	++cnt;
	// canvas.clear();
	const mid = particles.reduce((acc, curr) => {
		return acc + curr.position.y
	}, 0) / n;
	for (let i = 0; i < particles.length; ++i) {
		if (intervalPtr1 !== null && particles[i].position.y <= 100) {
			console.log("End", cnt)
			clearInterval(intervalPtr1);			
		}
		if (!didExplode && particles[i].position.y >= 1000) {
			explode = true;
			didExplode = true;
		}
		if (explode) {
			applyEx(particles[i], mid);
		}
		particles[i].integrate(t/1000, G);
		canvas.drawPoint({
			x: particles[i].position.x,
			y: particles[i].position.y
		}, {
			fillStyle: didExplode ? getRandomColor() : undefined,
			radius: 2
		});
	}
	if (explode) {
		explode = false;
	}
}




const game = (canvas:Canvas, particles: Particle[]) => {
	canvas.clear();
	canvas.drawPoint({ x: 500, y: 500 }, { radius: 10, fillStyle: "#f00" })
	for (let i = 0; i < particles.length; ++i) {
		particles[i].integrate(t / 1000, G);
		canvas.drawPoint({
			x: particles[i].position.x,
			y: particles[i].position.y
		});
		// console.log({
		// 	x: particles[i].velocity.x,
		// 	y: particles[i].velocity.y
		// })
		if (particles[i].position.x >= canvas.canvas.width - 100 && intervalPtr2 !== null) {
			console.log("End")
			clearInterval(intervalPtr2);
		}
	}
}
*/