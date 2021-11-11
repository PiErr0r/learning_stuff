const { Vector } = require('./vector');

class Matrix {
	d = [];
	constructor(data) {
		this.d = data.map(r => Array.from(r));
	}

	dim() {
		return [this.d.length, this.d[0].length]
	}

	apply(fn) {
		return new Matrix(this.d.map(r => r.map(c => fn(c))));
	}

	add(m) {
		if (m instanceof Matrix && m.d.length === this.d.length && m.d[0].length === this.d[0].length) {
			return Matrix._addMM(this.d, m.d);
		} else if (m instanceof Vector) {
			if (m.d.length === this.d[0].length) {
				return Matrix._addMV(this.d, m.d);
			} else if (m.d.length === this.d.length) {
				return Matrix._addMV_T(this.d, m.d);
			} else {
				// TODO: better error handling
				throw new Error("BAD stuff");
			}
		} else if (typeof m === "number") {
			return Matrix._addMN(this.d, m);
		} else {
			// TODO: better error handling
			throw new Error("BAD stuff");			
		}
	}

	mulL(v) {
		return Matrix._mulMV_T(this.d, v.d);
	}

	mulR(v) {
		return Matrix._mulMV(this.d, v.d);
	}

	dot(m) {
		if (m instanceof Matrix && this.d[0].length === m.d.length) {
			return Matrix._mulMM(this.d, m.d);
		} else if (m instanceof Vector) {
			if (m.d.length === this.d[0].length) {
				console.warn("Vector (b) length same as matrix (A) column number. Will return `A * b`");
				return Matrix._mulMV(this.d, m.d);
			} else if (m.d.length === this.d.length) {
				console.warn("Vector (b) length same as matrix (A) row number. Will return `b * A`");
				return Matrix._mulMV_T(this.d, m.d);
			} else {
				// TODO: better error handling
				throw new Error("BAD stuff");
			}
		} else if (typeof m === "number") {
			return Matrix._mulMN(this.d, m);
		} else {
			// TODO: better error handling
			throw new Error("BAD stuff");			
		}	
	}

	inv() {
		if (this.d.length !== this.d[0].length) {
			throw new Error("Matrix must be square!");
		}
		const dim = this.d.length;
		const a = this.d.map((r, i) => [...r, ...(new Array(dim).fill(0).map((_, j) => j === i ? 1 : 0))]);
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
		const r = this.d.length, c = this.d[0].length;
		const res = new Array(c).fill(0).map(r => new Array(r));
		for (let i = 0; i < c; ++i) {
			for (let j = 0; j < r; ++j) {
				res[i][j] = this.d[j][i];
			}
		}
		return new Matrix(res);
	}

	toString() {
		let r = '[\n';
		for (let i = 0; i < this.d.length; ++i) {
			r += `\t[${this.d[i].join(' ')}]\n`;
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
		for (let i = 0; i < m[0].length; ++i) {
			for (let j = 0; j < v.length; ++j) {
				res[i][j] = m[i][j] * v[j]
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

	static _addMV_T() {
		const res = new Array(m.length).fill(0).map(r => new Array(m[0].length));
		for (let i = 0; i < m.length; ++i) {
			for (let j = 0; j < m[0].length; ++j) {
				res[i][j] = m1[i][j] + v[i];
			}
		}
		return new Matrix(res);
	}

	static _addMN() {
		const res = new Array(m.length).fill(0).map(r => new Array(m[0].length));
		for (let i = 0; i < m.length; ++i) {
			for (let j = 0; j < m[0].length; ++j) {
				res[i][j] = m1[i][j] + n;
			}
		}
		return new Matrix(res);
	}
}

module.exports =  {
	Matrix
}