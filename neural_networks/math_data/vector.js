

class Vector {
	d = [];
	constructor(data) {
		this.d = Array.from(data);
	}

	dim() {
		return [this.d.length, 1]
	}

	apply(fn) {
		return new Vector(this.d.map(n => fn(n)));
	}

	add(v) {
		if (v instanceof Vector && v.d.length === this.d.length) {
			return Vector._addVV(this.d, v.d);
		} else if (typeof v === "number") {
			return Vector._addVN(this.d, n);
		} else {
			// TODO: Better error handling
			throw new Error("BAD stuff");
		}
	}

	dot(v) {
		if (Array.isArray(v) && v.d.length === this.d.length) {
			return Vector._dotVV(this.d, v.d);
		} else if (typeof v === "number") {
			return Vector._mul(this.d, v);
		} else {
			// TODO: Better error handling
			throw new Error("BAD stuff");			
		}
	}

	neg() {
		const res = new Array(this.d.length);
		for (let i = 0; i < this.d.length; ++i) {
			res[i] = -this.d[i];
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