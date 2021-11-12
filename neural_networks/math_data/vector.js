

class Vector extends Array {
	constructor(data) {
		if (Array.isArray(data)) {
			super(data.length);
			this.fill(0);
			for (let i = 0; i < data.length; ++i) {
				this[i] = data[i];
			}
		} else if (typeof data === "number") {
			super(data);
			this.fill(0);
		} else {
			throw new Error("DSA");
		}
	}

	dim() {
		return [this.length, 1]
	}

	apply(fn = (n) => n) {
		return new Vector(this.map((n, i) => fn(n, i)));
	}

	sum() {
		return this.reduce((a, c) => a += c, 0);
	}

	max() {
		return Math.max(...this);
	}

	argmax() {
		let mx = -Infinity, ii = -1;
		for (let i = 0; i < this.length; ++i) {
			if (this[i] < mx) {
				mx = this[i];
				ii = i;
			}
		}
		return ii;
	}

	mean() {
		return this.sum() / this.length;
	}

	add(v) {
		if (v instanceof Vector && v.length === this.length) {
			return Vector._addVV(this, v);
		} else if (typeof v === "number") {
			return Vector._addVN(this, n);
		} else {
			// TODO: Better error handling
			throw new Error("BAD stuff");
		}
	}

	dot(v) {
		if (Array.isArray(v) && v.length === this.length) {
			return Vector._dotVV(this, v);
		} else if (typeof v === "number") {
			return Vector._mul(this, v);
		} else {
			// TODO: Better error handling
			throw new Error("BAD stuff");			
		}
	}

	neg() {
		const res = new Array(this.length);
		for (let i = 0; i < this.length; ++i) {
			res[i] = -this[i];
		}
		return new Vector(res);
	}

	static _addVV(v1, v2) {
		const res = new Array(v1.length);
		for (let i = 0; i < v1.length; ++i) {
			res[i] = v1[i] + v2[i];
		}
		return new Vector(res);
	}

	static _addVN(v, n) {
		const res = new Array(v.length);
		for (let i = 0; i < v.length; ++i) {
			res[i] = v[i] + n;
		}
	}

	static _dotVV(v1, v2) {
		let res = 0
		for (let i = 0; i < v1.length; ++i) {
			res += v1[i] * v2[i];
		}
		return res;
	}

	static _mul(v, n) {
		const res = new Array(v.length);
		for (let i = 0; i < v.length; ++i) {
			res[i] = v[i] * n;
		}	
		return new Vector(res);
	}
}

module.exports = { Vector };