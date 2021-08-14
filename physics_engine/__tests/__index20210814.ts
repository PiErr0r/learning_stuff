import Canvas from "Canvas/Canvas";
import Particle from "Particle/Particle";
import Vector from "Geometry/Vector";
import FGBuoyancy from "Particle/FGBuoyancy";
import FGGravity from "Particle/FGGravity";
import ParticleForceRegistry from "Particle/ParticleForceRegistry";

const t = 1000/150;
let intervalPtr: null|ReturnType<typeof setInterval> = null;
const G:Vector = (new Vector(0, -10)).mul(1);

window.onload = () => {
	setTimeout(() => {
		console.log("Start")
		const canvas = new Canvas();

		const ball = new Particle(1250, new Vector(200, 310));
		const fgB = new FGBuoyancy(30, 22, 300);
		const fgGravity = new FGGravity(G);

		const reg = new ParticleForceRegistry();
		reg.add(ball, fgGravity);
		reg.add(ball, fgB);

		intervalPtr = setInterval(() => {
			water(canvas, reg, ball);
		}, t);
	}, 2000);
}

// const someFn = (canvas:Canvas) => { intervalPtr !== null ? clearInterval(intervalPtr) : {G, Particle} };

// let cnt = 0;
const dt = t/1000;

window.onkeydown = (evt) => {
	if (evt.key === 'a' && intervalPtr !== null) {
		console.log("End");
		clearInterval(intervalPtr);
	}
}

const water = (canvas: Canvas, reg: ParticleForceRegistry, p:Particle) => {

	canvas.clear()
	canvas.drawRect({x:0, y:0}, {x:1000, y:300}, { fillStyle: "#00f" });
	const pt1 = { x: p.position.x, y: Math.max(0, p.position.y) };
	canvas.drawPoint(pt1, { radius: 30, fillStyle: "#f00"	});


	reg.updateForces(dt);
	p.integrate(dt);
	p.clearAcc();
	// cnt += t;
}

/* SPRING
import FGAnchoredSpring from "Particle/FGAnchoredSpring";
const spring = (canvas: Canvas, reg: ParticleForceRegistry, p:Particle, a:Vector[]) => {

	canvas.clear()
	const pt1 = { x: p.position.x, y: p.position.y };
	canvas.drawPoint(pt1, { radius: 10 });
	a.forEach(av => {
		const pt2 = { x: av.x, y: av.y	};
		canvas.drawPoint(pt2, { radius: 10	});
		canvas.drawLine(pt1, pt2);
	})


	reg.updateForces(dt);
	p.integrate(dt);
	p.clearAcc();
	// cnt += t;
}


window.onload = () => {
	setTimeout(() => {
		console.log("Start")
		const canvas = new Canvas();

		const anchor1 = new Vector(500, 1000);
		const anchor2 = new Vector(800, 1000);
		const anchor3 = new Vector(650, 400);
		const ball = new Particle(150, new Vector(200, 600), new Vector(50));
		const fgSpring1 = new FGAnchoredSpring(anchor1, 20, 180);
		const fgSpring2 = new FGAnchoredSpring(anchor2, 80, 100);
		const fgSpring3 = new FGAnchoredSpring(anchor3, 130, 20);
		// const fgGravity = new FGGravity(G);

		const reg = new ParticleForceRegistry();
		// reg.add(ball, fgGravity);
		reg.add(ball, fgSpring1);
		reg.add(ball, fgSpring2);
		reg.add(ball, fgSpring3);

		intervalPtr = setInterval(() => {
			spring(canvas, reg, ball, [anchor1, anchor2, anchor3]);
		}, t);
	}, 2000);
}
*/

/* BUOYANCY
window.onload = () => {
	setTimeout(() => {
		console.log("Start")
		const canvas = new Canvas();

		const ball = new Particle(1250, new Vector(200, 310));
		const fgB = new FGBuoyancy(30, 22, 300);
		const fgGravity = new FGGravity(G);

		const reg = new ParticleForceRegistry();
		reg.add(ball, fgGravity);
		reg.add(ball, fgB);

		intervalPtr = setInterval(() => {
			water(canvas, reg, ball);
		}, t);
	}, 2000);
}

const water = (canvas: Canvas, reg: ParticleForceRegistry, p:Particle) => {

	canvas.clear()
	canvas.drawRect({x:0, y:0}, {x:1000, y:300}, { fillStyle: "#00f" });
	const pt1 = { x: p.position.x, y: Math.max(0, p.position.y) };
	canvas.drawPoint(pt1, { radius: 30, fillStyle: "#f00"	});


	reg.updateForces(dt);
	p.integrate(dt);
	p.clearAcc();
	// cnt += t;
}

*/