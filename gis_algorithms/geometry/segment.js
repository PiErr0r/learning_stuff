const { Point } = require('./point');
const { sideplr } = require('./lib');

let i = 0;
const ENDPOINT = 0;
const INTERIOR = 1;

class Segment {
	constructor(pt1, pt2, e = null, c = null) {
		if (!(pt1 instanceof Point) || !(pt2 instanceof Point)) {
			throw new Error(`Non point provided to Segment constructor: pt1: ${pt1}, pt2: ${pt2}`)
		}

		this.e = e ?? ++i;
		this.c = c;
		this.lp = pt1.ge(pt2) ? pt2 : pt1;
		this.lp0 = Point.copy(pt1.ge(pt2) ? pt2 : pt1);
		this.rp = pt1.ge(pt2) ? pt1 : pt2;
		this.status = ENDPOINT;
	}

	static checkInstance(seg) {
		if (!(seg instanceof Segment)) {
			throw new Error(`Invalid type provided: ${seg}`);
		}
	}

	eq(seg) {
		Segment.checkInstance(seg);
		return this.lp.eq(seg.lp) && this.rp.eq(seg.rp) 
				|| this.lp.eq(seg.rp) && this.rp.eq(seg.lp); 
	}

	ne(seg) {
		return !this.eq(seg);
	}

	lt(seg) {
		Segment.checkInstance(seg);
		lr = sideplr(this.lp, seg.lp, seg.rp);
		if (lr === 0) {
			const lrr = sideplr(this.rp, seg.lp, seg.rp);
			if (seg.lp.x < seg.rp.x)
				return lrr > 0;
			else
				return lrr < 0;
		} else {
			if (seg.lp.x > seg.rp.x)
				return lr < 0;
			else
				return lr > 0;
		}
	}

	gt(seg) {
		return !this.lt(seg);
	}

	contains(pt) {
		if (this.lp.eq(pt))
			return -1;
		else if (this.rp.eq(pt))
			return 1;
		else
			return 0;
	}

	toString() {
		return `Segment ${this.e}: [${this.lp}, ${this.rp}]`;
	}
}

module.exports = {
	Segment,
}