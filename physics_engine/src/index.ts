import Canvas from "./Canvas";
import Point from "./Point";
import Vector from "./Vector";

const newRand:(n:number) => number = (n) => Math.floor(Math.random() * n);

window.onload = () => {
	const num = 500;
	const canvas = new Canvas();
	const pts = (new Array(20)).fill(0).map(p => new Point(newRand(num), newRand(num)));
	canvas.drawPoints(pts);

	const x = new Vector(1, 0, 0);
	const y = new Vector(0, 1, 0);
	const z = new Vector(0, 0, 1);

	Vector.add(x, y).log();
	Vector.sub(y, x).log();
	x.cross(y).log();
	y.cross(z).log();
	z.cross(x).log();
	console.log(x.dot(y))
	console.log(Vector.add(x, y).dot(y));
}