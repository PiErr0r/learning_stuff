
class Point extends Array {
	constructor(...coords) {
		switch (coords.length) {
		case 0:
			super();
			break;
		case 1:
			super(1).fill(coords[0]);
			break;
		case 2:
			super(...coords);
			this.x = coords[0];
			this.y = coords[1];
			break;
		case 3:
			super(...coords);
			this.x = coords[0];
			this.y = coords[1];
			this.z = coords[2];
			break;
		default:
			super(...coords);
			break;
		}
	}

	static checkSize(pt1, pt2) {
		if (pt1 instanceof Point && pt2 instanceof Point) {
			if (pt1.length !== pt2.length)
				throw new Error(`Provided points of different sizes ${pt1} and ${pt2}`);
		} else {
			throw new Error(`Wrong type provided to Point: ${pt1} and ${pt2}`);
		}
	}

	static copy(pt) {
		return new Point(...pt);
	}

	eq(pt) {
		Point.checkSize(this, pt);
		for (let i = 0; i < pt.length; ++i)
			if (pt[i] !== this[i])
				return false;
		return true;
	}

	ne(pt) {
		return !this.eq(pt);
	}

	lt(pt) {
		Point.checkSize(this, pt);
		for (let i = 0; i < this.length; ++i)
			if (this[i] > pt[i])
				return false;
		return !this.eq(pt);
	}
	
	le(pt) {
		Point.checkSize(this, pt);
		for (let i = 0; i < this.length; ++i)
			if (this[i] > pt[i])
				return false;
		return true;
	}

	gt(pt) {
		Point.checkSize(this, pt);
		for (let i = 0; i < this.length; ++i)
			if (this[i] < pt[i])
				return false;
		return !this.eq(pt);
	}

	ge(pt) {
		Point.checkSize(this, pt);
		for (let i = 0; i < this.length; ++i)
			if (this[i] < pt[i])
				return false;
		return true;
	}

	toString() {
		return `Point: ${this.join(',')}`
	}

	distance(pt) {
		Point.checkSize(this, pt);
		let sum = 0;
		for (let i = 0; i < this.length; ++i)
			sum += (this[i] - pt[i]) * (this[i] - pt[i]);
		return Math.sqrt(sum);
	}

	manhattan(pt) {
		Point.checkSize(this, pt);
		let sum = 0;
		for (let i = 0; i < this.length; ++i)
			sum += Math.abs(this[i] - pt[i]) ;
		return sum;
	}
}

module.exports = {
	Point,
}