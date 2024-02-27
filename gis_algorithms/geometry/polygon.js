const { Point } = require('./point');

class Polygon extends Array {
	constructor(...pts) {
		if (pts.length < 3)
			throw new Error("Polygon must have st least 3 points");
		for (let i = 0; i < pts.length; ++i)
			if (!(pts[i] instanceof Point))
				throw new Error(`Argument ${i} is not a point: ${pts[i]}`)
		super(...pts);
		this.push(Point.copy(pts[0]));
	}

	centroid() {
		let ymean = 0;
		let xmean = 0;
		let A = 0;
		for (let i = 0; i < this.length - 1; ++i) {
			const ai = this[i+1].x * this[i].y - this[i].x * this[i+1].y;
			A += ai;
			xmean += (this[i].x + this[i+1].x) * ai;
			ymean += (this[i].y + this[i+1].y) * ai
		}

		A /= 2;
		return [new Point(xmean / (6*A), ymean / (6*A)), Math.abs(A)];
	}

	area() {
		const [C, A] = this.centroid();
		return A;
	}
}

module.exports = {
	Polygon,
}