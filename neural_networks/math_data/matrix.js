const { Vector } = require('./vector');

class Matrix extends Array {
	constructor(aOrData, b) {
		if (Array.isArray(aOrData)) {
			super(aOrData.length);
			this.fill(0);
			for (let i = 0; i < this.length; ++i) {
				this[i] = [...aOrData[i]];
			}
		} else if (typeof aOrData === "number" && aOrData && !b) {
			super(aOrData);
			this.fill(0);
		} else if (typeof aOrData === "number" && typeof b === "number" && aOrData && b) {
			super(aOrData);
			this.fill();
			for (let i = 0; i < aOrData; ++i) {
				this[i] = new Array(b).fill(0);
			}
		} else {
			// console.trace()
			// throw new Error("ASD");
			super(aOrData)
		}
	}

	dim() {
		return [this.length, this[0].length]
	}

	index(ii) {
		return new Vector(this.map((r, i) => r[ ii[i] ]));
	}

	apply(fn = (n) => n, opts = { axis: null, initial: 0 }) {
		const { axis, initial } = opts;
		switch (axis) {
			case null:
				return new Matrix(this.map((r, i) => r.map((c, j) => fn(c, i, j))));
			case 0: 
				return new Vector(this.T().map((r, i) => r.reduce((a, c, j) => fn(c, i, j), initial)));
			case 1:
				return new Vector(this.map((r, i) => r.reduce((a, c, j) => fn(c, i, j), initial)));

		}
	}

	sum(axis = null) {
		switch (axis) {
			case null:
				return this.reduce((ar, cr) => ar + cr.reduce((ac, cc) => ac + cc, 0), 0);
			case 0:
				return new Vector(this.T().map(r => r.reduce((a, c) => a + c, 0)));
			case 1:
				return new Vector(this.map(r => r.reduce((a, c) => a + c, 0)));
		}
	}

	max(axis = null) {
		switch (axis) {
			case null:
				return Math.max(...this.flat());
			case 0:
				return new Vector(this.T().map(r => Math.max(...r)));
			case 1:
				return new Vector(this.map(r => Math.max(...r)));
		}
	}

	argmax(axis = null) {
		let res;
		switch (axis) {
			case null:
				let mx = -Infinity, ii = -1;
				for (let i = 0; i < this.length; ++i) {
					for (let j = 0; j < this[0].length; ++j) {
						if (this[i][j] > mx) {
							mx = this[i][j];
							ii = i * this[0].length + j;
						}
					}
				}
				return ii;
			case 0:
				res = new Vector(this.length);
				for (let i = 0; i < this[0].length; ++i) {
					let mx = -Infinity, ii = -1;
					for (let j = 0; j < this.length; ++j) {
						if (this[j][i] > mx) {
							mx = this[j][i];
							ii = j;
						}
					}
					res[i] = ii;
				}
				return res;
			case 1:
				res = new Vector(this[0].length);
				for (let i = 0; i < this.length; ++i) {
					let mx = -Infinity, ii = -1;
					for (let j = 0; j < this[0].length; ++j) {
						if (this[i][j] > mx) {
							mx = this[i][j];
							ii = j;
						}
					}
					res[i] = ii;
				}
				return res;
		}
	}

	mean(axis = null) {
		switch (axis) {
			case null:
				return this.sum() / (this.length * this[0].length);
			case 0:
				return this.sum(0).apply((n, i) => n / this.length);
			case 1:
				return this.sum(1).apply((n, i) => n / this[i].length);
		}
	}

	add(m) {
		if (m instanceof Matrix && m.length === this.length && m[0].length === this[0].length) {
			return Matrix._addMM(this, m);
		} else if (m instanceof Vector) {
			if (m.length === this[0].length) {
				return Matrix._addMV(this, m);
			} else if (m.length === this.length) {
				return Matrix._addMV_T(this, m);
			} else {
				// TODO: better error handling
				throw new Error("BAD stuff");
			}
		} else if (typeof m === "number") {
			return Matrix._addMN(this, m);
		} else {
			// TODO: better error handling
			throw new Error("BAD stuff");			
		}
	}

	mulL(v) {
		return Matrix._mulMV_T(this, v);
	}

	mulR(v) {
		return Matrix._mulMV(this, v);
	}

	dot(m, elementWise = false) {
		if (elementWise && m.length === this.length && m[0].length === this[0].length) {
			return Matrix._mulMM_el(this, m);
		} else if (elementWise) {
			throw new Error("Worst stuff");
		}
		if (m instanceof Matrix && this[0].length === m.length) {
			return Matrix._mulMM(this, m);
		} else if (m instanceof Vector) {
			if (m.length === this[0].length) {
				console.warn("Vector (b) length same as matrix (A) column number. Will return `A * b`");
				return Matrix._mulMV(this, m);
			} else if (m.length === this.length) {
				console.warn("Vector (b) length same as matrix (A) row number. Will return `b * A`");
				return Matrix._mulMV_T(this, m);
			} else {
				// TODO: better error handling
				throw new Error("BAD stuff");
			}
		} else if (typeof m === "number") {
			return Matrix._mulMN(this, m);
		} else {
			// TODO: better error handling
			throw new Error("BAD stuff");			
		}	
	}

	inv() {
		if (this.length !== this[0].length) {
			throw new Error("Matrix must be square!");
		}
		const dim = this.length;
		const a = this.map((r, i) => [...r, ...(new Array(dim).fill(0).map((_, j) => j === i ? 1 : 0))]);
		for (let i = 0; i < dim; ++i) {
			if (a[i][i] == 0) throw new Error("Math error");
			for (let j = 0; j < dim; ++j) {
				if (i !== j) {
					const r = a[j][i] / a[i][i];
					for (let k = 0; k < 2 * dim; ++k)
						a[j][k] -= r * a[i][k]
				}
			}
		}

		for (let i = 0; i < dim; ++i)
			for (let j = dim; j < 2 * dim; ++j)
				a[i][j] /= a[i][i];

		return new Matrix(a.map(r => r.slice(dim)));
	}

	T() {
		const r = this.length, c = this[0].length;
		const res = new Array(c).fill(0).map(r => new Array(r));
		for (let i = 0; i < r; ++i) {
			for (let j = 0; j < c; ++j) {
				res[i][j] = this[j][i];
			}
		}
		return new Matrix(res);
	}

	toString() {
		let r = '[\n';
		for (let i = 0; i < this.length; ++i) {
			r += `\t[ ${this[i].join(' ')} ]\n`;
		}
		r += ']';
		return r;
	}

	static _mulMM(m1, m2) {
		const r1 = m1.length, c1 = m1[0].length, 
					r2 = m2.length, c2 = m2[0].length;
		console.assert(c1 === r2);
		const d = c1;
		const res = new Array(r1).fill(0).map(r => new Array(c2));

		for (let i = 0; i < r1; ++i) {
			for (let j = 0; j < c2; ++j) {
				let sum = 0;
				for (let k = 0; k < d; ++k) {
					sum += m1[i][k] * m2[k][j];
				}
				res[i][j] = (sum);
			}
		}
		return new Matrix(res);
	}

	static _mulMM_el(m1, m2) {
		const r = m1.length, c = m1[0].length;
		const res = new Matrix(r, c);
		for (let i = 0; i < r; ++i) {
			for (let j = 0; j < c; ++j) {
				res[i][j] = m1[i][j] * m2[i][j];
			}
		}
		return res;
	}

	static _mulMV(m, v) {
		const res = new Array(m.length);
		for (let i = 0; i < m.length; ++i) {
			let sum = 0;
			for (let j = 0; j < v.length; ++j) {
				sum += m[i][j] * v[j];
			}
			res[i] = sum;
		}
		return new Vector(res);
	}

	static _mulMV_T(m, v) {
		const res = new Array(m[0].length);
		for (let i = 0; i < m[0].length; ++i) {
			let sum = 0;
			for (let j = 0; j < v.length; ++j) {
				sum += m[j][i] * v[j]
			}
			res[i] = sum;
		}
		return new Vector(res);
	}

	static _mulMN(m, n) {
		const res = new Array(m.length).fill(0).map(r => new Array(m[0].length));
		for (let i = 0; i < m.length; ++i) {
			for (let j = 0; j < m[0].length; ++j) {
				res[i][j] = m[i][j] * n;
			}
		}
		return new Matrix(res);
	}

	static _addMM(m1, m2) {
		const res = new Array(m1.length).fill(0).map(r => new Array(m1[0].length));
		for (let i = 0; i < m1.length; ++i) {
			for (let j = 0; j < m1[0].length; ++j) {
				res[i][j] = m1[i][j] + m2[i][j]
			}
		}
		return new Matrix(res);
	}

	static _addMV(m, v) {
		const res = new Array(m.length).fill(0).map(r => new Array(m[0].length));
		for (let i = 0; i < m.length; ++i) {
			for (let j = 0; j < m[0].length; ++j) {
				res[i][j] = m[i][j] + v[j];
			}
		}
		return new Matrix(res);
	}

	static _addMV_T(m, v) {
		const res = new Array(m.length).fill(0).map(r => new Array(m[0].length));
		for (let i = 0; i < m.length; ++i) {
			for (let j = 0; j < m[0].length; ++j) {
				res[i][j] = m[i][j] + v[i];
			}
		}
		return new Matrix(res);
	}

	static _addMN(m, n) {
		const res = new Array(m.length).fill(0).map(r => new Array(m[0].length));
		for (let i = 0; i < m.length; ++i) {
			for (let j = 0; j < m[0].length; ++j) {
				res[i][j] = m[i][j] + n;
			}
		}
		return new Matrix(res);
	}
}

module.exports =  {
	Matrix
}